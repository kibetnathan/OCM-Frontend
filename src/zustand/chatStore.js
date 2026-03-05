import { create } from 'zustand';
import { db } from '../firebase';
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

// ── Role gate ─────────────────────────────────────────────────────────────────
const PRIVILEGED_GROUPS = ['Pastor', 'Jr Leader', 'Leader', 'Head Pastor', 'Staff'];

export function canCreateRoom(user) {
  if (!user?.groups) return false;
  return user.groups.some((g) => PRIVILEGED_GROUPS.includes(g));
}

// ── Room source types ─────────────────────────────────────────────────────────
// Firestore room IDs are prefixed to avoid collisions across model types:
//   fellowship_12, leadership_5, department_3, course_8
export const ROOM_TYPES = {
  fellowship: { key: 'fellowship', label: 'Fellowship Groups' },
  leadership: { key: 'leadership', label: 'Leadership Teams'  },
  department: { key: 'department', label: 'Serving Teams'     },
  course:     { key: 'course',     label: 'Courses'           },
};

export function buildRoomId(type, id) {
  return `${type}_${id}`;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useChatStore = create((set, get) => ({
  rooms: [],
  roomsLoading: false,
  roomsUnsubscribe: null,

  messages: [],
  messagesLoading: false,
  messagesUnsubscribe: null,

  // ── Subscribe to ALL rooms (realtime) ──────────────────────────────────
  subscribeToRooms: () => {
    if (get().roomsUnsubscribe) get().roomsUnsubscribe();
    set({ roomsLoading: true });

    const unsub = onSnapshot(
      collection(db, 'rooms'),
      (snapshot) => {
        const rooms = snapshot.docs
          .map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate().toISOString() ?? null,
          }))
          .filter((r) => typeof r.name === 'string' && r.name.trim() !== '');

        rooms.sort((a, b) => a.name.localeCompare(b.name));
        set({ rooms, roomsLoading: false });
      },
      (err) => {
        console.error('[chatStore] subscribeToRooms error:', err.message);
        set({ roomsLoading: false });
      }
    );

    set({ roomsUnsubscribe: unsub });
  },

  // ── Subscribe to messages in a room (realtime) ─────────────────────────
  subscribeToRoom: (roomId) => {
    if (get().messagesUnsubscribe) get().messagesUnsubscribe();
    set({ messagesLoading: true, messages: [] });

    const q = query(
      collection(db, 'rooms', String(roomId), 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            timestamp: data.timestamp?.toDate().toISOString() ?? new Date().toISOString(),
            reactions: Object.entries(data.reactions ?? {}).map(([emoji, users]) => ({
              emoji,
              users: Array.isArray(users) ? users : [],
            })),
          };
        });
        set({ messages, messagesLoading: false });
      },
      (err) => {
        console.error('[chatStore] subscribeToRoom error:', err.message);
        set({ messagesLoading: false });
      }
    );

    set({ messagesUnsubscribe: unsub });
  },

  // ── Create a room ──────────────────────────────────────────────────────
  // group   -- { id, name, description } from any of the four source models
  // type    -- 'fellowship' | 'leadership' | 'department' | 'course'
  // creator -- authStore.user
  createRoom: async (group, type, creator) => {
    const roomId = buildRoomId(type, group.id);
    const roomRef = doc(db, 'rooms', roomId);

    const existing = await getDoc(roomRef);
    if (existing.exists()) {
      return { success: false, error: 'A room for this group already exists.' };
    }

    const displayName =
      creator.first_name && creator.last_name
        ? `${creator.first_name} ${creator.last_name}`
        : creator.username ?? 'Unknown';

    try {
      await setDoc(roomRef, {
        name: group.name,
        description: group.description ?? '',
        sourceType: type,
        sourceId: String(group.id),
        members: [],
        createdBy: {
          id: String(creator.id),
          displayName,
        },
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (err) {
      console.error('[chatStore] createRoom error:', err.message);
      return { success: false, error: err.message };
    }
  },

  // ── Send a message ─────────────────────────────────────────────────────
  sendMessage: async (roomId, userId, displayName, text) => {
    try {
      await addDoc(collection(db, 'rooms', String(roomId), 'messages'), {
        text,
        timestamp: serverTimestamp(),
        userId: String(userId),
        displayName,
        reactions: {},
      });
    } catch (err) {
      console.error('[chatStore] sendMessage error:', err.message);
    }
  },

  // ── Toggle a reaction ──────────────────────────────────────────────────
  handleReaction: async (roomId, messageId, emoji, userId) => {
    const uid = String(userId);
    const messageRef = doc(db, 'rooms', String(roomId), 'messages', messageId);

    try {
      const snap = await getDoc(messageRef);
      if (!snap.exists()) return;

      const reactions = { ...(snap.data().reactions ?? {}) };
      const current = Array.isArray(reactions[emoji]) ? reactions[emoji] : [];
      const hasReacted = current.includes(uid);

      if (hasReacted) {
        const updated = current.filter((u) => u !== uid);
        if (updated.length === 0) {
          delete reactions[emoji];
        } else {
          reactions[emoji] = updated;
        }
      } else {
        reactions[emoji] = [...current, uid];
      }

      await updateDoc(messageRef, { reactions });
    } catch (err) {
      console.error('[chatStore] handleReaction error:', err.message);
    }
  },
}));