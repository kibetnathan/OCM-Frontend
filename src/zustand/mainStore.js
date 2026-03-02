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
    // Fetch a single post by id
    fetchPost: async (postId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`http://localhost:8000/api/post/${postId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch post");
            return await res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    },

    // Fetch comments for a specific post
    fetchPostComments: async (postId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`http://localhost:8000/api/comment/?post_id=${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch comments");
            const data = await res.json();
            return data?.results ?? (Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    // Add a comment to a post
    addComment: async (postId, content) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch("http://localhost:8000/api/comment/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ post_id: postId, text: content }),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const newComment = await res.json();
            // Also increment comment_count on the post in the feed
            set((state) => {
                const current = state.posts?.results ?? (Array.isArray(state.posts) ? state.posts : []);
                const updated = current.map((p) =>
                    p.id === postId ? { ...p, comment_count: (p.comment_count ?? 0) + 1 } : p
                );
                return {
                    posts: state.posts?.results
                        ? { ...state.posts, results: updated }
                        : updated,
                };
            });
            return { success: true, comment: newComment };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    // Edit a comment
    editComment: async (commentId, content) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`http://localhost:8000/api/comment/${commentId}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: content }),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            return { success: true, comment: await res.json() };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    // Delete a comment
    deleteComment: async (commentId, postId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`http://localhost:8000/api/comment/${commentId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete comment");
            // Decrement comment_count on the post in the feed
            set((state) => {
                const current = state.posts?.results ?? (Array.isArray(state.posts) ? state.posts : []);
                const updated = current.map((p) =>
                    p.id === postId ? { ...p, comment_count: Math.max(0, (p.comment_count ?? 1) - 1) } : p
                );
                return {
                    posts: state.posts?.results
                        ? { ...state.posts, results: updated }
                        : updated,
                };
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    // Delete a post
    deletePost: async (postId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`http://localhost:8000/api/post/${postId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete post");
            set((state) => {
                const current = state.posts?.results ?? (Array.isArray(state.posts) ? state.posts : []);
                const updated = current.filter((p) => p.id !== postId);
                return {
                    posts: state.posts?.results
                        ? { ...state.posts, count: (state.posts.count ?? 1) - 1, results: updated }
                        : updated,
                };
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

}));

export default useMainStore;