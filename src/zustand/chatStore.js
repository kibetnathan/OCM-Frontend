import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  messages: [],
  replyTo: null,

  setMessages: (messages) => set({ messages }),

  setReplyTo: (id) => set({ replyTo: id }),

  insertMessage: (newMsg) => {
    const messages = get().messages;

    if (!newMsg.parent) {
      set({ messages: [...messages, newMsg] });
      return;
    }

    const updated = messages.map(msg => {
      if (msg.id === newMsg.parent) {
        return {
          ...msg,
          replies: [...(msg.replies || []), newMsg]
        };
      }
      return msg;
    });

    set({ messages: updated });
  }
}));