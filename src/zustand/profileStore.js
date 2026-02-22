import { create } from "zustand";
import useAuthStore from "./authStore";

const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });

    try {
      const auth = useAuthStore.getState();
      const token = auth?.token;
      const user_id = auth?.user?.id;

      if (!token || !user_id) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `http://localhost:8000/api/profile/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();

      set({
        profile: data,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
    }
  },
}));

export default useProfileStore;