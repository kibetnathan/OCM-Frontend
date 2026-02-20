import { create } from "zustand";

// Key for localStorage
const USER_KEY = "user";
const TOKEN_KEY = "token";

const useAuthStore = create((set) => ({
  // Initial state (hydrate from localStorage)
  user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  loading: false,
  error: null,

  // -------- LOGIN --------
  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      // TODO: replace with actual API call
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json(); // { access: "...", refresh: "..." }

      // Fetch user info
      const userRes = await fetch("http://localhost:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });

      if (!userRes.ok) throw new Error("Could not fetch user data");

      const userData = await userRes.json();

      // Update state
      set({ user: userData, token: data.access, loading: false });

      // Persist in localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, data.access);
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // -------- REGISTER / SIGNUP --------
register: async (username, email, password, extraFields) => {
  set({ loading: true, error: null });
  try {
    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password1: password,
        password2: password,
        ...extraFields, // DoB, campus, phone_number, school, workplace
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Registration failed");
    }

    const data = await response.json();

    // Auto-login by setting token and user
    set({
      user: data.user,
      token: data.tokens.access,
      loading: false,
    });

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.tokens.access);
  } catch (err) {
    set({ error: err.message, loading: false });
  }
},

  // -------- LOGOUT --------
  logout: () => {
    set({ user: null, token: null, error: null });
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  // -------- REFRESH TOKEN (optional for cookies later) --------
  refreshAccess: async () => {
    try {
      const res = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        credentials: "include", // if using HttpOnly cookie for refresh token
      });
      if (!res.ok) throw new Error("Could not refresh token");

      const data = await res.json();
      set({ token: data.access });
      localStorage.setItem(TOKEN_KEY, data.access);
    } catch {
      set({ user: null, token: null });
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  },
}));

export default useAuthStore;