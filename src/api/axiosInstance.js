// src/api/axiosInstance.js
import axios from 'axios';
import useAuthStore from '../zustand/useAuthStore';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Your Django API
});

api.interceptors.request.use(async (config) => {
  // 1. Get the current token from the Zustand store state
  let token = useAuthStore.getState().token;

  // 2. Fallback: If store is empty but Firebase has a user, get a fresh token
  if (!token) {
    const auth = getAuth();
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;