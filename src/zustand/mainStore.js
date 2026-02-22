import { create } from "zustand";
import useAuthStore from "./authStore";

const useMainStore = create((set) => ({
    leadership_teams: [],
    departments: [],
    services: [],
    fellowships: [],
    courses: [],
    loading: false,
    error: null,
    
    fetchLeadershipTeams: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch("http://localhost:8000/api/leadership-team/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ leadership_teams: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    fetchDepartments: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch("http://localhost:8000/api/department/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ departments: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    fetchServices: async () => {
        set({loading: true, error: null});
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch("http://localhost:8000/api/services/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ services: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    fetchFellowships: async () => {
        set({loading: true, error: null});
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch("http://localhost:8000/api/fellowship-group/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ fellowships: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    fetchCourses: async () => {
        set({loading: true, error: null});
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch("http://localhost:8000/api/courses/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ courses: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export default useMainStore;