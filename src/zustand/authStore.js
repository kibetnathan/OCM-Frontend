// stores/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();

      // Fetch user info
      const userRes = await fetch('http://localhost:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      const userData = await userRes.json();

      // Save in state
      set({ user: userData, token: data.access, loading: false });

      // Save in localStorage
      localStorage.setItem('token', data.access);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
}));

export default useAuthStore;