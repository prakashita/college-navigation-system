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
  export const fetchShortestRoute = async (start_id, start_type, end_id, end_type) => {
    const res = await axios.get(`${API_URL}/navigation/shortest-route`, {
      params: { start_id, start_type, end_id, end_type },
    });
    return res.data;
  };

export default API;