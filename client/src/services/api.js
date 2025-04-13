import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';
const API = axios.create({
  baseURL: 'http://localhost:8000', // Your FastAPI backend URL
  headers: { 'Content-Type': 'application/json' }
});
export const fetchMapData = async () => {
    const response = await axios.get(`${API_URL}/maps/maps/`);
    return response.data;
  };
// Add JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;