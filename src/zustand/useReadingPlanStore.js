import { create } from "zustand";
import useAuthStore from "./authStore";

const API = import.meta.env.VITE_API_URL ?? "https://opencms-q36g.onrender.com/api";

const useReadingPlanStore = create((set, get) => ({

    plans:   [],
    myPlans: [],
    loading: false,
    error:   null,

    fetchAll: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const [plansRes, myRes] = await Promise.all([
                fetch(`${API}/reading-plans/`,    { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API}/reading-plans/my/`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            const [plansData, myData] = await Promise.all([plansRes.json(), myRes.json()]);
            set({
                plans:   plansData?.results ?? (Array.isArray(plansData) ? plansData : []),
                myPlans: myData?.results    ?? (Array.isArray(myData)    ? myData    : []),
                loading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    joinPlan: async (planId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/reading-plans/${planId}/join/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to join plan");
            const data = await res.json();
            set((state) => ({
                plans: state.plans.map(p =>
                    p.id === planId ? { ...p, is_joined: true, member_count: data.member_count } : p
                ),
                myPlans: state.myPlans.find(p => p.id === planId)
                    ? state.myPlans
                    : [...state.myPlans, state.plans.find(p => p.id === planId)].filter(Boolean),
            }));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    leavePlan: async (planId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/reading-plans/${planId}/leave/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to leave plan");
            const data = await res.json();
            set((state) => ({
                plans: state.plans.map(p =>
                    p.id === planId ? { ...p, is_joined: false, member_count: data.member_count } : p
                ),
                myPlans: state.myPlans.filter(p => p.id !== planId),
            }));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    createPlan: async (payload) => {
        set({ loading: true });
        try {
            const token = useAuthStore.getState().token;
            const isFormData = payload instanceof FormData;
            const res = await fetch(`${API}/reading-plans/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(!isFormData && { 'Content-Type': 'application/json' }),
                },
                body: isFormData ? payload : JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const newPlan = await res.json();
            set((state) => ({ plans: [newPlan, ...state.plans], loading: false }));
            return { success: true, plan: newPlan };
        } catch (err) {
            set({ loading: false });
            return { success: false, error: err.message };
        }
    },

    updatePlan: async (id, payload) => {
        try {
            const token = useAuthStore.getState().token;
            const isFormData = payload instanceof FormData;
            const res = await fetch(`${API}/reading-plans/${id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(!isFormData && { 'Content-Type': 'application/json' }),
                },
                body: isFormData ? payload : JSON.stringify(payload),
            });
            if (!res.ok) { const e = await res.json(); throw new Error(JSON.stringify(e)); }
            const updated = await res.json();
            set((state) => ({ plans: state.plans.map(p => p.id === id ? updated : p) }));
            return { success: true, plan: updated };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    deletePlan: async (id) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/reading-plans/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete plan");
            set((state) => ({
                plans:   state.plans.filter(p => p.id !== id),
                myPlans: state.myPlans.filter(p => p.id !== id),
            }));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },
}));

export default useReadingPlanStore;