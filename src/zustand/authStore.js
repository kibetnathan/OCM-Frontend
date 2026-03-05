import { create } from "zustand";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
} from "firebase/auth";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: true,
  error: null,

  // ── INIT (call once in App.jsx) ──────────────────────────────────────────
  initAuth: () => {
    return onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        try {
          const res = await fetch(`${API}/users/me/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = res.ok ? await res.json() : firebaseUser;
          set({ user: userData, token, loading: false });
        } catch {
          set({ user: firebaseUser, token, loading: false });
        }
      } else {
        set({ user: null, token: null, loading: false });
      }
    });
  },

  // ── LOGIN ────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();
      const res = await fetch(`${API}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not fetch user data.");
      const userData = await res.json();
      set({ user: userData, token, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ── REGISTER ─────────────────────────────────────────────────────────────
  // Returns true on success so the component can navigate.
  // Returns false on failure so the component can stay on the form.
  register: async (email, password, profileData) => {
    set({ loading: true, error: null });
    let firebaseUser = null;

    try {
      // 1. Create Firebase user
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      // 2. Create Django profile (FirebaseAuthentication auto-creates shell user)
      const res = await fetch(`${API}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData), // username, first_name, last_name, DoB, etc.
      });

      if (!res.ok) {
        const errData = await res.json();
        // Roll back Firebase user so they can try again cleanly
        await firebaseUser.delete();
        firebaseUser = null;
        const message =
          errData?.username?.[0] || errData?.detail || "Registration failed.";
        throw new Error(message);
      }

      const data = await res.json();
      set({ user: data.user, token, loading: false });
      return true; // ← signal success to component

    } catch (err) {
      // Safety net: if JS crashed after Firebase but before delete()
      if (firebaseUser) {
        try { await firebaseUser.delete(); } catch { /* already deleted or expired */ }
      }
      set({ error: err.message, loading: false });
      return false; // ← signal failure to component
    }
  },

  // ── LOGOUT ───────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, token: null, error: null });
    } catch (err) {
      console.error("Logout error:", err);
    }
  },

  // ── REFRESH TOKEN ────────────────────────────────────────────────────────
  refreshAccess: async () => {
    try {
      if (auth.currentUser) {
        const newToken = await auth.currentUser.getIdToken(true);
        set({ token: newToken });
      }
    } catch (err) {
      console.error("Token refresh error:", err);
      get().logout();
    }
  },
}));

export default useAuthStore;