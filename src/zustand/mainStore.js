import { create } from "zustand";
import useAuthStore from "./authStore";

const useMainStore = create((set) => ({
    leadership_teams: [],
    departments: [],
    services: [],
    fellowships: [],
    courses: [],
    posts: [],
    toggleLike: async (postId, token) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/toggle_like/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            // Update the post in the store's state
            set((state) => ({
                posts: {
                    ...state.posts,
                    results: state.posts.results.map((p) =>
                        p.id === postId
                            ? { ...p, like_count: data.like_count, is_liked: data.is_liked }
                            : p
                    ),
                },
            }));
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    },
    comments: [],
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
        set({ loading: true, error: null });
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
        set({ loading: true, error: null });
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
        set({ loading: true, error: null });
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
    },
    fetchPosts: async (token) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("http://localhost:8000/api/post/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ posts: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    fetchComments: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch("http://localhost:8000/api/comment/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ comments: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));

export default useMainStore;