import axios from 'axios';

// Dynamically choose the URL. It appends '/api' to your Railway link.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the JWT token to requests if the admin is logged in
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
