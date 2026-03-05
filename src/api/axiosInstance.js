import axios from 'axios';
import useAuthStore from '../zustand/authStore';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://opencms-q36g.onrender.com/api/',
});

api.interceptors.request.use(async (config) => {
  let token = useAuthStore.getState().token;

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