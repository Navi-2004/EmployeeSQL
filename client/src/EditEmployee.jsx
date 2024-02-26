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
      navigate("/"); // Redirect to home page after successful update
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
          Employee Name:
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
          />
        </label>
        <br />
        <label>
          Gender:
          <select
            name="gender"
            value={employeeDetails.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditEmployee;
