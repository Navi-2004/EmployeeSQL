import React, { useState, useEffect } from "react";
import axios from "./axiosConfig";
import "./App.css";
import { Link } from "react-router-dom";
import EmployeeOfTheWeekCard from "./EmployeeOfTheWeekCard";

const Employee = () => {
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "",
    id: "",
    department: "",
    dob: null,
    gender: "",
    designation: "",
    salary: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortBySalaryAsc, setSortBySalaryAsc] = useState(true); // State to track sorting order


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails({
      ...employeeDetails,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setEmployeeDetails({
      ...employeeDetails,
      dob: date,
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
      setErrorMessage("Please fill in all fields");
      return;
    }

    // Additional validation
    if (employeeDetails.name.length > 30) {
      setErrorMessage("Name must be within 30 characters");
      return;
    }

    if (employeeDetails.salary.length > 8 || employeeDetails.salary < 0) {
      setErrorMessage("Salary must be within 8 digits and greater than 0");
      return;
    }

    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    if (employeeDetails.dob > eighteenYearsAgo) {
      setErrorMessage("Age must be above 18 years");
      return; // Return if age is less than 18
    }

    try {
      // Submit the form
      const response = await axios.post("/submitEmployee", employeeDetails);
      console.log("Form data submitted successfully:", response.data);

      // Update employeeData without reloading the page
      setEmployeeData((prev) => [...prev, response.data]);

      setEmployeeDetails({
        name: "",
        id: "",
        department: "",
        dob: null,
        gender: "",
        designation: "",
        salary: "",
      });

      setErrorMessage("");
      alert("Employee data submitted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form data:", error);
      setErrorMessage("Error submitting form data");
      alert("Error submitting form data");
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
      const response = await axios.delete("/deleteEmployee/" + id);
      console.log(response);
      if (response.status === 200) {
        alert("Employee data deleted successfully");
        // Update the employee data state to remove the deleted employee
        setEmployeeData((prevEmployeeData) =>
          prevEmployeeData.filter((employee) => employee.id !== id)
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    setCurrentPage(1); // Reset current page when performing a new search
  };

  const filteredEmployeeData = employeeData.filter((employee) => {
    const nameMatch = employee.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const departmentMatch = employee.department
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return nameMatch || departmentMatch;
  });

  useEffect(() => {
    axios
      .get("/getEmployee")
      .then((response) => {
        console.log(response.data);
        if (Array.isArray(response.data)) {
          setEmployeeData(response.data);
        } else {
          console.error("Invalid API response: expected an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  function getEighteenYearsAgoDate() {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return eighteenYearsAgo;
  }

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredEmployeeData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredEmployeeData.length
  );
  const currentEmployees = filteredEmployeeData.slice(startIndex, endIndex);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  

  const handleSortBySalary = () => {
    const sortedData = [...employeeData].sort((a, b) => {
      if (sortBySalaryAsc) {
        return a.salary - b.salary;
      } else {
        return b.salary - a.salary;
      }
    });
    setEmployeeData(sortedData);
    setSortBySalaryAsc(!sortBySalaryAsc);
    setCurrentPage(1); // Reset current page after sorting
  };

  /*
emploee of the week

*/
const [employeeOfTheWeek, setEmployeeOfTheWeek] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const handleSelectEmployeeOfWeek = (id) => {
    const selectedEmployee = employeeData.find((employee) => employee.id === id);
    if (selectedEmployee) {
      setEmployeeOfTheWeek(selectedEmployee);
    } else {
      console.error("Employee not found with ID:", id);
    }
  };

  return (
    <div>
      <div className="table-container">
        <h1 className="emp">Employee Details</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Employee name:{" "}
            <input
              type="text"
              name="name"
              value={employeeDetails.name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            ID: {" "}
            <input
              type="text"
              name="id"
              value={employeeDetails.id}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Department:{"   "}
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
            Date Of Birth : {" "}
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
            Designation: {"                             "}
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
          <button type="submit" style={{marginLeft:6+"em"}}>Submit</button>
          {errorMessage && <p>{errorMessage}</p>}
        </form>
      </div>
      <div>
        <h1>Employee Records</h1>
        <input
          type="text"
          placeholder="Search by name or department"
          value={searchQuery}
          onChange={handleSearch}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            width: "300px",
            marginLeft: "40%", // Adjust width as needed
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
              <th>
              Salary{" "}
              <button className="but" onClick={handleSortBySalary}>
                {sortBySalaryAsc ? "▲" : "▼"}
              </button>
            </th>              <th>Actions</th>
            <th>
              EOW
            </th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>{employee.id}</td>
                <td>{employee.department}</td>
                <td>{new Date(employee.dob).toLocaleDateString()}</td>
                <td>{employee.gender}</td>
                <td>{employee.designation}</td>
                <td>{employee.salary}</td>
                <td>
                  <button onClick={() => handleDelete(employee.id)}>
                    Delete
                  </button>
                  <Link to={`/employee/${employee.id}`}>
                    <button>Edit</button>
                  </Link>
                 
                 
                </td>
                <td>
                <button onClick={() => handleSelectEmployeeOfWeek(employee.id)}>
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="butt"
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${
                  pageNumber === currentPage ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageClick(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            )
          )}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="butt"
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
      {employeeOfTheWeek && <EmployeeOfTheWeekCard employee={employeeOfTheWeek} />}

    </div>
  );
};

export default Employee;
