// EmployeeOfTheWeekCard.js
import React from "react";

const EmployeeOfTheWeekCard = ({ employee }) => {
  return (
    <div className="employee-of-the-week-card">
      <h2>Employee of the Week</h2>
      <div>
        <p>Name: {employee.name}</p>
        <p>ID: {employee.id}</p>
        <p>Department: {employee.department}</p>
        {/* Add more details as needed */}
      </div>
      <p className="congratulations">Congratulations!</p> {/* Add congratulatory message */}
    </div>
  );
};

export default EmployeeOfTheWeekCard;
