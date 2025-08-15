import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://Assistlore.co' 
  : 'http://localhost:3000';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
