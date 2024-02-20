import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Employee from './Employee';
import EditEmployee from './EditEmployee';
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Employee />} />
          <Route path="/employee/:id" element={<EditEmployee />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
