import { useEffect, useState } from "react";
import { useChatStore } from "../zustand/chatStore";
import useChatSocket from "../hooks/useChatSocket";

/* ------------------------------
   Message Item Component
------------------------------ */
function MessageItem({ message, onReply }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <p>
        <strong>{message.sender?.display_name}</strong>
      </p>

      <p>{message.content}</p>

      <button onClick={() => onReply(message.id)}>
        Reply
      </button>

      <div style={{ paddingLeft: "20px" }}>
        {message.replies?.map(reply => (
          <MessageItem
            key={reply.id}
            message={reply}
            onReply={onReply}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------
   Message List Component
------------------------------ */
function MessageList() {
  const { messages, setReplyTo } = useChatStore();

  return (
    <div>
      {messages.map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          onReply={setReplyTo}
        />
      ))}
    </div>
  );
}

/* ------------------------------
   Main Chat Page
------------------------------ */
export default function ChatPage({ roomId }) {
  const { replyTo, setReplyTo, setMessages } = useChatStore();

  const [text, setText] = useState("");

  const sendMessage = useChatSocket(roomId);

  /* Fetch history */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch(`/api/chat/rooms/${roomId}/messages/`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Chat fetch error:", err));

  }, [roomId, setMessages]);

  /* Send message */
  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage({
      content: text,
      parent: replyTo
    });

    setText("");
    setReplyTo(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <MessageList />

      {replyTo && (
        <div style={{ marginTop: "10px" }}>
          Replying to message {replyTo}

          <button
            style={{ marginLeft: "10px" }}
            onClick={() => setReplyTo(null)}
          >
            Cancel
          </button>
        </div>
      )}

      <div style={{ marginTop: "15px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />

        <button
          onClick={handleSend}
          style={{ marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}