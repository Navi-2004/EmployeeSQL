import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:5000', // Example base URL
  baseURL:'https://employeesql.onrender.com',
  timeout: 5000, // Request timeout in milliseconds
});

export default instance;
