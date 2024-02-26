import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosConfig';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeDetails, setEmployeeDetails] = useState({
    name: '',
    id: '',
    department: '',
    dob: '', // Change to string format
    gender: '', // Make sure initial state matches one of the options
    designation: '',
    salary: ''
  });

  function getEighteenYearsAgoDate() {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return eighteenYearsAgo;
  }
  useEffect(() => {
    axios.get(`/getEmployee/${id}`)
      .then(response => {
        setEmployeeDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching employee details:', error);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setEmployeeDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`/updateEmployee/${id}`, employeeDetails);
      alert('Employee details updated successfully');
      navigate("/"); 
    } catch (error) {
      console.error('Error updating employee details:', error);
      alert('Error updating employee details');
    }
  };

  return (
    <div>
      <h1>Edit Employee Details</h1>
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
            <select
              name="department"
              value={employeeDetails.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
              <option value="Engineering">Engineering</option>
            </select>
          </label>

          <br />
          <label>
            Date Of Birth :
            <input
              type="date"
              name="dob"
              value={employeeDetails.dob}
              onChange={handleChange}
              max={getEighteenYearsAgoDate().toISOString().split("T")[0]}
              // max={new Date().toISOString().split("T")[0]}
            />
          </label>
          <br />
          <label>
            Gender:
            <input
              type="radio"
              name="gender"
              value="male"
              checked={employeeDetails.gender === "male"}
              onChange={handleChange}
            />
            Male
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
            <select
              name="designation"
              value={employeeDetails.designation}
              onChange={handleChange}
            >
              <option value="">Select Designation</option>
              <option value="Manager">Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Assistant">Assistant</option>
              <option value="Engineer">Engineer</option>
              <option value="Analyst">Analyst</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Specialist">Specialist</option>
            </select>
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
        </form>
        
    </div>
  );
};

export default EditEmployee;
