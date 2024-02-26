import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from './axiosConfig';
import './App.css';
import { Link } from 'react-router-dom';

const Employee = () => {
  const [employeeDetails, setEmployeeDetails] = useState({
    name: '',
    id: '',
    department: '',
    dob: null,
    gender: '',
    designation: '',
    salary: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails({
      ...employeeDetails,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setEmployeeDetails({
      ...employeeDetails,
      dob: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (
      employeeDetails.name.trim().length === 0 ||
      employeeDetails.salary.trim().length === 0 ||
      employeeDetails.dob === null
    ) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    // Additional validation
    if (employeeDetails.name.length > 30) {
      setErrorMessage('Name must be within 30 characters');
      return;
    }

    if (employeeDetails.salary.length > 8) {
      setErrorMessage('Salary must be within 8 digits');
      return;
    }

    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    if (employeeDetails.dob > eighteenYearsAgo) {
      setErrorMessage('Age must be above 18 years');
      return;
    }

    try {
      // Submit the form
      const response = await axios.post('/submitEmployee', employeeDetails);
      console.log('Form data submitted successfully:', response.data);
      setEmployeeData(prev => [...prev, response.data]);

      setEmployeeDetails({
        name: '',
        id: '',
        department: '',
        dob: null,
        gender: '',
        designation: '',
        salary: ''
      });
      window.location.reload();

      setErrorMessage('');
      alert('Employee data submitted successfully');
    } catch (error) {
      console.error('Error submitting form data:', error);
      setErrorMessage('Error submitting form data');
      alert('Error submitting form data');
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
      const response = await axios.delete("http://localhost:5000/deleteEmployee/" + id);
      console.log(response);
      if (response.status === 200) {
        alert('Employee data deleted successfully');
        // Update the employee data state to remove the deleted employee
        setEmployeeData(prevEmployeeData => prevEmployeeData.filter(employee => employee.id !== id));
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date

const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    axios.get("http://localhost:5000/getEmployee")
      .then((response) => {
        console.log(response.data);
        if (Array.isArray(response.data)) {
          setEmployeeData(response.data);
        } else {
          console.error('Invalid API response: expected an array');
        }
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
      });
  }, [setEmployeeData]);

  const filteredEmployeeData = employeeData.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div>
        <h1  className='emp' >Employee Details</h1>
        
        <form onSubmit={handleSubmit}>
          <label>
            Employee name:
            <input
              type="text"
              name="name"
              value={employeeDetails.name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            ID:
            <input
              type="text"
              name="id"
              value={employeeDetails.id}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Department:
            <input
              type="text"
              name="department"
              value={employeeDetails.department}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={employeeDetails.dob}
            onChange={handleChange}
            max={tomorrowFormatted} // Set min attribute to tomorrow's date

          />
        </label>
          <br />
          <label>
            Gender:
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={employeeDetails.gender === "male"}
              onChange={handleChange}
            />
            Male
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={employeeDetails.gender === "female"}
              onChange={handleChange}
            />
            Female
          </label>
          <br />
          <label>
            Designation:
            <input
              type="text"
              name="designation"
              value={employeeDetails.designation}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Salary:
            <input
              type="text"
              name="salary"
              value={employeeDetails.salary}
              onChange={handleChange}
            />
          </label>
          <br />
          <button type="submit">Submit</button>
          {errorMessage && <p>{errorMessage}</p>}
        </form>
      </div>
      <div>
        <h1>Employee Records</h1>
        <input
  type="text"
  placeholder="Search by name"
  value={searchQuery}
  onChange={handleSearch}
  style={{
    padding: '10px',
    fontSize: '16px',
    alignItems: 'center',
    marginLeft: '610px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '300px' // Adjust width as needed
  }}
/>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Department</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredEmployeeData.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>{employee.id}</td>
                <td>{employee.department}</td>
                <td>{new Date(employee.dob).toLocaleDateString()}</td>
                <td>{employee.gender}</td>
                <td>{employee.designation}</td>
                <td>{employee.salary}</td>
                <td>
                  <button onClick={() => handleDelete(employee.id)}>Delete</button>
                  <Link to={`/employee/${employee.id}`}>
                    <button>Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
