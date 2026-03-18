import { create } from "zustand";
import useAuthStore from "./authStore";

const API = import.meta.env.VITE_API_URL ?? "https://opencms-q36g.onrender.com/api";

const useMemorizeStore = create((set, get) => ({

    // ── State ────────────────────────────────────────────────────────────────

    verses: [],          // all saved verses
    dueVerses: [],       // verses where next_review <= now
    stats: null,         // { total, due_today, mastered, streak }
    savedVerseKeys: [],  // "<book_id>-<chapter>-<verse_number>-<translation>" — for fast lookup in BiblePage

    loading: false,
    statsLoading: false,
    error: null,

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Returns true if a specific verse is already saved.
     * Used by BiblePage to render the bookmark icon state.
     */
    isVerseSaved: (bookId, chapter, verseNumber, translation) => {
        const key = `${bookId}-${chapter}-${verseNumber}-${translation}`;
        return get().savedVerseKeys.includes(key);
    },

    _verseKey: (v) => `${v.book_id}-${v.chapter}-${v.verse_number}-${v.translation}`,

    // ── Fetches ──────────────────────────────────────────────────────────────

    fetchVerses: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/memorize/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch verses");
            const data = await res.json();
            const verses = data?.results ?? (Array.isArray(data) ? data : []);
            set({
                verses,
                savedVerseKeys: verses.map(get()._verseKey),
                loading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchDueVerses: async () => {
        set({ loading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/memorize/due/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch due verses");
            const data = await res.json();
            set({
                dueVerses: data?.results ?? (Array.isArray(data) ? data : []),
                loading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchStats: async () => {
        set({ statsLoading: true });
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/memorize/stats/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch stats");
            const stats = await res.json();
            set({ stats, statsLoading: false });
        } catch (err) {
            set({ error: err ,statsLoading: false });
        }
    },

    /**
     * Fetch all three in parallel — call this on MemorizePage mount.
     */
    fetchAll: async () => {
        set({ loading: true, statsLoading: true, error: null });
        try {
            const token = useAuthStore.getState().token;
            const [versesRes, dueRes, statsRes] = await Promise.all([
                fetch(`${API}/memorize/`,       { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API}/memorize/due/`,   { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API}/memorize/stats/`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            const [versesData, dueData, statsData] = await Promise.all([
                versesRes.json(), dueRes.json(), statsRes.json(),
            ]);
            const verses = versesData?.results ?? (Array.isArray(versesData) ? versesData : []);
            set({
                verses,
                dueVerses: dueData?.results ?? (Array.isArray(dueData) ? dueData : []),
                stats: statsData,
                savedVerseKeys: verses.map(get()._verseKey),
                loading: false,
                statsLoading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false, statsLoading: false });
        }
    },

    // ── Mutations ────────────────────────────────────────────────────────────

    /**
     * Bookmark a verse from BiblePage.
     * Payload: { book_id, book_name, chapter, verse_number, translation, verse_text }
     */
    bookmarkVerse: async (payload) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/memorize/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (res.status === 400) {
                const err = await res.json();
                const message = Object.values(err).flat()[0] ?? "Already saved";
                return { success: false, alreadyExists: true, error: message };
            }
            if (!res.ok) throw new Error("Failed to save verse");
            const newVerse = await res.json();
            const key = get()._verseKey(newVerse);
            set((state) => ({
                verses: [newVerse, ...state.verses],
                savedVerseKeys: [key, ...state.savedVerseKeys],
                stats: state.stats
                    ? { ...state.stats, total: state.stats.total + 1 }
                    : null,
            }));
            return { success: true, verse: newVerse };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    /**
     * Submit a practice result after a review session.
     * Updates the verse in both `verses` and `dueVerses` with the server response.
     */
    submitReview: async (verseId, score, level) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/memorize/${verseId}/review/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ score, level }),
            });
            if (!res.ok) throw new Error("Failed to submit review");
            const updated = await res.json();

            set((state) => ({
                verses: state.verses.map((v) => v.id === verseId ? updated : v),
                // Remove from dueVerses — it has been reviewed this session
                dueVerses: state.dueVerses.filter((v) => v.id !== verseId),
                stats: state.stats
                    ? {
                        ...state.stats,
                        due_today: Math.max(0, state.stats.due_today - 1),
                        mastered: updated.interval_days >= 14
                            ? state.stats.mastered + (
                                // Only increment mastered count if it wasn't already mastered
                                state.verses.find((v) => v.id === verseId)?.interval_days < 14 ? 1 : 0
                              )
                            : state.stats.mastered,
                    }
                    : null,
            }));
            return { success: true, verse: updated };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    deleteVerse: async (verseId) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await fetch(`${API}/memorize/${verseId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete verse");
            set((state) => {
                const deleted = state.verses.find((v) => v.id === verseId);
                const deletedKey = deleted ? get()._verseKey(deleted) : null;
                return {
                    verses: state.verses.filter((v) => v.id !== verseId),
                    dueVerses: state.dueVerses.filter((v) => v.id !== verseId),
                    savedVerseKeys: deletedKey
                        ? state.savedVerseKeys.filter((k) => k !== deletedKey)
                        : state.savedVerseKeys,
                    stats: state.stats
                        ? {
                            ...state.stats,
                            total: Math.max(0, state.stats.total - 1),
                            due_today: state.dueVerses.some((v) => v.id === verseId)
                                ? Math.max(0, state.stats.due_today - 1)
                                : state.stats.due_today,
                        }
                        : null,
                };
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },
}));

export default useMemorizeStore;