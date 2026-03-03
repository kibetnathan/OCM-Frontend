import { useEffect, useRef } from "react";
import { useChatStore } from "../zustand/chatStore";

export default function useChatSocket(roomId) {
  const socketRef = useRef(null);
  const insertMessage = useChatStore(s => s.insertMessage);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      insertMessage(data);
    };

    socketRef.current = socket;

    return () => socket.close();
  }, [roomId]);

  const sendMessage = (data) => {
    socketRef.current?.send(JSON.stringify(data));
  };

  return sendMessage;
}