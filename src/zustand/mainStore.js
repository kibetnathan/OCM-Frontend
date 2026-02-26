import { create } from "zustand";
import useAuthStore from "./authStore";

const useMainStore = create((set) => ({
    leadership_teams: [],
    departments: [],
    services: [],
    fellowships: [],
    courses: [],
    posts: [],
    users: [],
    profiles: [],
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
            const res = await fetch("http://localhost:8000/api/course/", {
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
    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch("http://localhost:8000/api/users/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            // Support both paginated { results: [] } and plain array responses
            set({ users: data?.results ?? (Array.isArray(data) ? data : []), loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    fetchProfiles: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch("http://localhost:8000/api/profile/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            // Support both paginated { results: [] } and plain array responses
            set({ profiles: data?.results ?? (Array.isArray(data) ? data : []), loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    uploadPost: async (formData, token) => {
    set({ loading: true, error: null });
    try {
        const res = await fetch("http://localhost:8000/api/post/", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            // NO Content-Type header here!
            body: formData,
        });

        if (!res.ok) {
            const errData = await res.json();
            console.log("Server Error Data:", errData); // Debugging is your friend
            throw new Error(errData.detail || "Upload failed");
        }

        const newPost = await res.json();
        
        set((state) => {
            // Check if results exists (Paginated API) or if it's a direct array
            const currentPosts = state.posts?.results ? state.posts.results : (Array.isArray(state.posts) ? state.posts : []);
            
            return {
                loading: false,
                posts: state.posts?.results 
                    ? { ...state.posts, results: [newPost, ...currentPosts] } // If paginated object
                    : [newPost, ...currentPosts] // If simple array
            };
        });
    } catch (err) {
        set({ error: err.message, loading: false });
    }
}
}));

export default useMainStore;