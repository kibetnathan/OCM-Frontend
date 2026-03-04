import { create } from "zustand";
import { auth } from "../firebase"; // Adjust path to your firebase config file
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onIdTokenChanged 
} from "firebase/auth";

const useAuthStore = create((set, get) => ({
  // Initial state is null. We let Firebase initialize it securely.
  user: null,
  token: null,
  loading: true, // Start true so your app can show a spinner while Firebase loads
  error: null,

  // -------- INIT AUTH (Call this ONCE in App.js) --------
  initAuth: () => {
    return onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        
        // Fetch your custom Django user data
        try {
          const userRes = await fetch("http://localhost:8000/api/users/me/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            set({ user: userData, token: token, loading: false });
          } else {
            set({ user: firebaseUser, token: token, loading: false }); // Fallback
          }
        } catch {
          set({ user: firebaseUser, token: token, loading: false });
        }
      } else {
        set({ user: null, token: null, loading: false });
      }
    });
  },

  // -------- LOGIN --------
  // Note: Firebase requires an EMAIL for login, not a plain username.
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // 1. Log in via Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // 2. Fetch user profile from Django
      const userRes = await fetch("http://localhost:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) throw new Error("Could not fetch user data from Django");
      const userData = await userRes.json();

      // Update state
      set({ user: userData, token: token, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // -------- REGISTER / SIGNUP --------
  register: async (username, first_name, last_name, email, password, extraFields) => {
    set({ loading: true, error: null });
    try {
      // 1. Create Auth record in Firebase (handles the password safely)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // 2. Send the rest of the data to Django to create the profile
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Django uses this to verify the user
        },
        body: JSON.stringify({
          username,
          first_name,
          last_name,
          email,
          // Notice we DO NOT send passwords to Django anymore!
          ...extraFields, 
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Django registration failed");
      }

      const data = await response.json();

      // Update state
      set({ user: data.user || data, token: token, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      
      // Edge Case Cleanup: If Django fails, delete the orphaned Firebase user
      if (auth.currentUser && err.message.includes("Django")) {
         await auth.currentUser.delete();
      }
    }
  },

  // -------- LOGOUT --------
  logout: async () => {
    try {
      await signOut(auth); // Tells Firebase to kill the session
      set({ user: null, token: null, error: null });
    } catch (err) {
      console.error("Logout error:", err);
    }
  },

  // -------- REFRESH TOKEN --------
  // Firebase handles token refreshes automatically. 
  // We keep this function so your old components don't crash if they call it.
  refreshAccess: async () => {
    try {
      if (auth.currentUser) {
        const newToken = await auth.currentUser.getIdToken(true); // force refresh
        set({ token: newToken });
      }
    } catch (err) {
      console.error("Token refresh error:", err);
      get().logout();
    }
  },
}));

export default useAuthStore;