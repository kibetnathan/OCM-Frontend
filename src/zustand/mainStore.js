import { create } from "zustand";
import useAuthStore from "./authStore";

const API = import.meta.env.VITE_API_URL ?? "https://opencms-q36g.onrender.com/api";

const useMainStore = create((set) => ({
    leadership_teams: [],
    users: [],
    profiles: [],
    equipment: [],
    departments: [],
    services: [],
    fellowships: [],
    courses: [],
    posts: [],
    groups: [],
    toggleLike: async (postId, token) => {
        try {
            const response = await fetch(`${API}/posts/${postId}/toggle_like/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
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
            const res = await fetch(`${API}/leadership-team/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ leadership_teams: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    updateLeadershipTeam: async (id, payload) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/leadership-team/${id}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const updated = await res.json();
            set((state) => {
                const current = state.leadership_teams?.results
                    ? state.leadership_teams.results
                    : (Array.isArray(state.leadership_teams) ? state.leadership_teams : []);
                const updatedList = current.map((t) => t.id === id ? updated : t);
                return {
                    leadership_teams: state.leadership_teams?.results
                        ? { ...state.leadership_teams, results: updatedList }
                        : updatedList
                };
            });
            return { success: true, team: updated };
        } catch (err) { return { success: false, error: err.message }; }
    },
    deleteLeadershipTeam: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/leadership-team/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete leadership team");
            set((state) => {
                const current = state.leadership_teams?.results
                    ? state.leadership_teams.results
                    : (Array.isArray(state.leadership_teams) ? state.leadership_teams : []);
                const filtered = current.filter((t) => t.id !== id);
                return {
                    leadership_teams: state.leadership_teams?.results
                        ? { ...state.leadership_teams, count: (state.leadership_teams.count ?? 1) - 1, results: filtered }
                        : filtered
                };
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    fetchDepartments: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/department/`, {
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
            const res = await fetch(`${API}/services/`, {
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
            const res = await fetch(`${API}/fellowship-group/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ fellowships: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    updateFellowship: async (id, payload) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/fellowship-group/${id}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const updated = await res.json();
            set((state) => {
                const current = state.fellowships?.results
                    ? state.fellowships.results
                    : (Array.isArray(state.fellowships) ? state.fellowships : []);
                const updatedList = current.map((g) => g.id === id ? updated : g);
                return {
                    fellowships: state.fellowships?.results
                        ? { ...state.fellowships, results: updatedList }
                        : updatedList
                };
            });
            return { success: true, group: updated };
        } catch (err) { return { success: false, error: err.message }; }
    },
    deleteFellowship: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/fellowship-group/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete fellowship group");
            set((state) => {
                const current = state.fellowships?.results
                    ? state.fellowships.results
                    : (Array.isArray(state.fellowships) ? state.fellowships : []);
                const filtered = current.filter((g) => g.id !== id);
                return {
                    fellowships: state.fellowships?.results
                        ? { ...state.fellowships, count: (state.fellowships.count ?? 1) - 1, results: filtered }
                        : filtered
                };
            });
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    },
    fetchCourses: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/course/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ courses: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    updateCourse: async (id, payload) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/course/${id}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const updated = await res.json();
            set((state) => {
                const current = state.courses?.results ? state.courses.results : (Array.isArray(state.courses) ? state.courses : []);
                const updatedList = current.map((c) => c.id === id ? updated : c);
                return {
                    courses: state.courses?.results ? { ...state.courses, results: updatedList } : updatedList
                };
            });
            return { success: true, course: updated };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },
    deleteCourse: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/course/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete course");
            set((state) => {
                const current = state.courses?.results ? state.courses.results : (Array.isArray(state.courses) ? state.courses : []);
                const filtered = current.filter((c) => c.id !== id);
                return {
                    courses: state.courses?.results ? { ...state.courses, count: (state.courses.count ?? 1) - 1, results: filtered } : filtered
                };
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },
    fetchPosts: async (token) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API}/post/`, {
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
            const res = await fetch(`${API}/comment/`, {
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
            const res = await fetch(`${API}/post/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) {
                const errData = await res.json();
                console.log("Server Error Data:", errData);
                throw new Error(errData.detail || "Upload failed");
            }
            const newPost = await res.json();
            set((state) => {
                const currentPosts = state.posts?.results ? state.posts.results : (Array.isArray(state.posts) ? state.posts : []);
                return {
                    loading: false,
                    posts: state.posts?.results
                        ? { ...state.posts, results: [newPost, ...currentPosts] }
                        : [newPost, ...currentPosts]
                };
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            let url = `${API}/users/`;
            let allUsers = [];
            while (url) {
                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                const page = data?.results ?? (Array.isArray(data) ? data : []);
                allUsers = [...allUsers, ...page];
                url = data?.next ?? null;
            }
            set({ users: allUsers, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    updateUser: async (id, payload) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/users/${id}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const updated = await res.json();
            set((state) => ({
                users: (state.users || []).map((u) => u.id === id ? updated : u)
            }));
            return { success: true, item: updated };
        } catch (err) { return { success: false, error: err.message }; }
    },
    deleteUser: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/users/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete user");
            set((state) => ({
                users: (state.users || []).filter((u) => u.id !== id),
            }));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },
    fetchGroups: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/groups/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ groups: data?.results ?? (Array.isArray(data) ? data : []), loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    fetchProfiles: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/profile/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ profiles: data?.results ?? (Array.isArray(data) ? data : []), loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    updateProfile: async (id, payload) => {
        try {
            const token = useAuthStore.getState().token;
            const isFormData = payload instanceof FormData;
            const res = await fetch(`${API}/profile/${id}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(!isFormData && { "Content-Type": "application/json" }),
                },
                body: isFormData ? payload : JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const updated = await res.json();
            set((state) => ({
                profiles: (state.profiles || []).map((p) => p.id === id ? updated : p)
            }));
            return { success: true, item: updated };
        } catch (err) { return { success: false, error: err.message }; }
    },
    fetchEquipment: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/equipment/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            set({ equipment: data?.results ?? (Array.isArray(data) ? data : []), loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
    createLeadershipTeam: async (payload) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/leadership-team/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const newTeam = await res.json();
            set((state) => {
                const current = state.leadership_teams?.results ? state.leadership_teams.results : (Array.isArray(state.leadership_teams) ? state.leadership_teams : []);
                const count = state.leadership_teams?.count ?? current.length;
                return { loading: false, leadership_teams: state.leadership_teams?.results ? { ...state.leadership_teams, count: count + 1, results: [newTeam, ...current] } : [newTeam, ...current] };
            });
            return { success: true };
        } catch (err) { set({ error: err.message, loading: false }); return { success: false, error: err.message }; }
    },
    createDepartment: async (payload) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/department/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const newDept = await res.json();
            set((state) => {
                const current = state.departments?.results ? state.departments.results : (Array.isArray(state.departments) ? state.departments : []);
                const count = state.departments?.count ?? current.length;
                return { loading: false, departments: state.departments?.results ? { ...state.departments, count: count + 1, results: [newDept, ...current] } : [newDept, ...current] };
            });
            return { success: true };
        } catch (err) { set({ error: err.message, loading: false }); return { success: false, error: err.message }; }
    },
    updateDepartment: async (id, payload) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/department/${id}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const updated = await res.json();
            set((state) => {
                const current = state.departments?.results ? state.departments.results : (Array.isArray(state.departments) ? state.departments : []);
                return { departments: state.departments?.results ? { ...state.departments, results: current.map((d) => d.id === id ? updated : d) } : current.map((d) => d.id === id ? updated : d) };
            });
            return { success: true, department: updated };
        } catch (err) { return { success: false, error: err.message }; }
    },
    deleteDepartment: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/department/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete department");
            set((state) => {
                const current = state.departments?.results ? state.departments.results : (Array.isArray(state.departments) ? state.departments : []);
                const filtered = current.filter((d) => d.id !== id);
                return { departments: state.departments?.results ? { ...state.departments, count: (state.departments.count ?? 1) - 1, results: filtered } : filtered };
            });
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    },
    createService: async (payload) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/services/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const newService = await res.json();
            set((state) => {
                const current = state.services?.results ? state.services.results : (Array.isArray(state.services) ? state.services : []);
                const count = state.services?.count ?? current.length;
                return { loading: false, services: state.services?.results ? { ...state.services, count: count + 1, results: [newService, ...current] } : [newService, ...current] };
            });
            return { success: true };
        } catch (err) { set({ error: err.message, loading: false }); return { success: false, error: err.message }; }
    },
    updateService: async (id, payload) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/services/${id}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const updated = await res.json();
            set((state) => {
                const current = state.services?.results ? state.services.results : (Array.isArray(state.services) ? state.services : []);
                return { services: state.services?.results ? { ...state.services, results: current.map((s) => s.id === id ? updated : s) } : current.map((s) => s.id === id ? updated : s) };
            });
            return { success: true, service: updated };
        } catch (err) { return { success: false, error: err.message }; }
    },
    deleteService: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/services/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete service");
            set((state) => {
                const current = state.services?.results ? state.services.results : (Array.isArray(state.services) ? state.services : []);
                const filtered = current.filter((s) => s.id !== id);
                return { services: state.services?.results ? { ...state.services, count: (state.services.count ?? 1) - 1, results: filtered } : filtered };
            });
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    },
    createEquipment: async (payload) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const isFormData = payload instanceof FormData;
            const res = await fetch(`${API}/equipment/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(!isFormData && { "Content-Type": "application/json" }),
                },
                body: isFormData ? payload : JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const newEquipment = await res.json();
            set((state) => ({ loading: false, equipment: [newEquipment, ...(state.equipment || [])] }));
            return { success: true };
        } catch (err) { set({ error: err.message, loading: false }); return { success: false, error: err.message }; }
    },
    updateEquipment: async (id, payload) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/equipment/${id}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const updated = await res.json();
            set((state) => ({
                equipment: (state.equipment || []).map((e) => e.id === id ? updated : e)
            }));
            return { success: true, item: updated };
        } catch (err) { return { success: false, error: err.message }; }
    },
    deleteEquipment: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/equipment/${id}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete equipment");
            set((state) => ({
                equipment: (state.equipment || []).filter((e) => e.id !== id)
            }));
            return { success: true };
        } catch (err) { return { success: false, error: err.message }; }
    },
    createFellowship: async (payload) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/fellowship-group/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const newGroup = await res.json();
            set((state) => {
                const current = state.fellowships?.results ? state.fellowships.results : (Array.isArray(state.fellowships) ? state.fellowships : []);
                const count = state.fellowships?.count ?? current.length;
                return { loading: false, fellowships: state.fellowships?.results ? { ...state.fellowships, count: count + 1, results: [newGroup, ...current] } : [newGroup, ...current] };
            });
            return { success: true };
        } catch (err) { set({ error: err.message, loading: false }); return { success: false, error: err.message }; }
    },
    createCourse: async (payload) => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/course/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const newCourse = await res.json();
            set((state) => {
                const current = state.courses?.results ? state.courses.results : (Array.isArray(state.courses) ? state.courses : []);
                const count = state.courses?.count ?? current.length;
                return { loading: false, courses: state.courses?.results ? { ...state.courses, count: count + 1, results: [newCourse, ...current] } : [newCourse, ...current] };
            });
            return { success: true };
        } catch (err) { set({ error: err.message, loading: false }); return { success: false, error: err.message }; }
    },
    fetchPost: async (postId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/post/${postId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch post");
            return await res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    fetchPostComments: async (postId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/comment/?post=${postId}`, {
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
    addComment: async (postId, content) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/comment/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ post_id: postId, text: content }),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const newComment = await res.json();
            set((state) => {
                const current = state.posts?.results ?? (Array.isArray(state.posts) ? state.posts : []);
                const updated = current.map((p) =>
                    p.id === postId ? { ...p, comment_count: (p.comment_count ?? 0) + 1 } : p
                );
                return { posts: state.posts?.results ? { ...state.posts, results: updated } : updated };
            });
            return { success: true, comment: newComment };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },
    editComment: async (commentId, content) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/comment/${commentId}/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ text: content }),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            return { success: true, comment: await res.json() };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },
    deleteComment: async (commentId, postId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/comment/${commentId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete comment");
            set((state) => {
                const current = state.posts?.results ?? (Array.isArray(state.posts) ? state.posts : []);
                const updated = current.map((p) =>
                    p.id === postId ? { ...p, comment_count: Math.max(0, (p.comment_count ?? 1) - 1) } : p
                );
                return { posts: state.posts?.results ? { ...state.posts, results: updated } : updated };
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },
    deletePost: async (postId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/post/${postId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete post");
            set((state) => {
                const current = state.posts?.results ?? (Array.isArray(state.posts) ? state.posts : []);
                const updated = current.filter((p) => p.id !== postId);
                return { posts: state.posts?.results ? { ...state.posts, count: (state.posts.count ?? 1) - 1, results: updated } : updated };
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },
}));

export default useMainStore;