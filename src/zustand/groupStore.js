import { create } from "zustand";
import useAuthStore from "./authStore";

const API = import.meta.env.VITE_API_URL ?? "https://opencms-q36g.onrender.com/api";

const useGroupStore = create((set) => ({
  groups: [],
  loading: false,

  fetchGroups: async () => {
    set({ loading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API}/groups/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ groups: data, loading: false });
    } catch (err) {
      set({ loading: false });
      console.error(err);
    }
  },
}));

export default useGroupStore;