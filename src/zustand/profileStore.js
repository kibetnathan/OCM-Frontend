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
    updateProfile: async (payload) => {
        set({ loading: true, error: null });
        try {
            const auth = useAuthStore.getState();
            const token = auth?.token;
            const user_id = auth?.user?.id;

            if (!token || !user_id) throw new Error("User not authenticated");

            const isFormData = payload instanceof FormData;

            const response = await fetch(
                `http://localhost:8000/api/profile/${user_id}/`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        ...(!isFormData && { "Content-Type": "application/json" }),
                    },
                    body: isFormData ? payload : JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(JSON.stringify(errData));
            }

            const data = await response.json();
            set({ profile: data, loading: false });
            return { success: true };
        } catch (err) {
            set({ error: err.message, loading: false });
            return { success: false, error: err.message };
        }
    },
}));

export default useProfileStore;