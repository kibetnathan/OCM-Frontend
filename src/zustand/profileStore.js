import { create } from "zustand";
import useAuthStore from "./authStore";


const useProfileStore = create((set) => ({
    profile: null,
    loading: false,
    error: null,

    fetchProfile: async (token) => {
        set({ loading: true, error: null });
        try {

            const user = useAuthStore.getState()
            if (!user || !user.user) throw new Error("User not authenticated");

            const user_id = user.user.id;
            const response = await fetch(`http://localhost:8000/api/profile/${user_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch profile");

            const data = await response.json();
            set({ profile: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));

export default useProfileStore;