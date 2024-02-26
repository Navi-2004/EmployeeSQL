const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
require("dotenv").config();

const app = express();
const port = 5000;
const corsOptions = {
  origin: ['https://employee-sql.vercel.app/', 'http://localhost:3000']
};

app.use(cors(corsOptions));


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  ssl: { ca: fs.readFileSync('./DigiCertGlobalRootCA.crt.pem') }
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.json());

app.post('/submitEmployee', (req, res) => {
  console.log('Received employee data:', req.body);
    const employeeData = req.body;
  
    if (employeeData.name.length > 30) {
      return res.status(400).json({ error: 'Name must be within 30 characters' });
    }
  
    if (employeeData.salary.length > 8) {
      return res.status(400).json({ error: 'Salary must be within 8 digits' });
    }
  
    if (!employeeData.dob) {
      return res.status(400).json({ error: 'Date of Birth is required' });
    }
  
    const sql = 'INSERT INTO employees (name, id, department, dob, gender, designation, salary) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [employeeData.name, employeeData.id, employeeData.department, employeeData.dob, employeeData.gender, employeeData.designation, employeeData.salary], (err, result) => {
      if (err) {
        console.error('Error inserting employee data into database:', err);
        return res.status(500).json({ error: 'Failed to submit employee data' });
      }
      console.log('Employee data submitted successfully');
      return res.status(200).json({ success: true });
    });
  });

  app.get("/getEmployee", (req, res) => {
    const sql = 'SELECT * FROM employees';
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error fetching employee data:', err);
        return res.status(500).json({ error: 'Failed to fetch employee data' });
      }
      console.log('Employee data fetched successfully');
       
      // Ensure that result is an array
      if (!Array.isArray(result)) {
        console.error('Invalid API response: expected an array');
        return res.status(500).json({ error: 'Invalid API response: expected an array' });
      }
  
      // Send the array of employee objects in the response
      return res.status(200).json(result);
    });
  });

  app.delete("/deleteEmployee/:id", (req, res) => {
    const id=req.params.id;
    const sqp="Delete from employees where id=?";
    connection.query(sqp,id,(err,result)=>{
      if(err){
        console.error('Error deleting employee data:', err);
        return res.status(500).json({ error: 'Failed to delete employee data' });
      }
      console.log('Employee data deleted successfully');
      return res.status(200).json({ success: true });
    });
  })


  app.get("/getEmployee/:id", (req, res) => {
    const id = req.params.id;
  
    // Basic validation
    if (!id) {
      return res.status(400).json({ error: 'Invalid request' });
    }
  
    // Construct SQL query to fetch employee by ID
    const sql = 'SELECT * FROM employees WHERE id = ?';
  
    // Execute the query
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error fetching employee data:', err);
        return res.status(500).json({ error: 'Failed to fetch employee data' });
      }
  
      // Check if an employee with the given ID exists
      if (result.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // Send the employee data in the response
      return res.status(200).json(result[0]);
    });
  });
  
  app.put("/updateEmployee/:id", (req, res) => {
    const id = req.params.id;
    const employeeData = req.body;
  
    // Basic validation
    if (!id || Object.keys(employeeData).length === 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }
  
    // Additional validation if needed
  
    // Construct SQL query to update employee details
    const sql = 'UPDATE employees SET name=?, department=?, dob=?, gender=?, designation=?, salary=? WHERE id=?';
    const values = [employeeData.name, employeeData.department, employeeData.dob, employeeData.gender, employeeData.designation, employeeData.salary, id];
  
    // Execute the query
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error updating employee data:', err);
        return res.status(500).json({ error: 'Failed to update employee data' });
      }
      console.log('Employee data updated successfully');
      return res.status(200).json({ success: true });
    });
  });
  
  
app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
