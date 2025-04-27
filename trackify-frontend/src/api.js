import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use(async (req) => {
  try {
    // Try to get token if Clerk is loaded
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return req;
});

export default API;
