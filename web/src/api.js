import axios from 'axios';

// Use a relative base URL by default so the Vite dev-server proxy can forward requests to the API.
// In production set VITE_API_BASE to the full API origin (e.g. https://api.example.com)
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export default api;
