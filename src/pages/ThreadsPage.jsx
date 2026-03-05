import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { NavLink } from "react-router-dom";

// ── Dummy Data ─────────────────────────────────────────────────────────────────

const DUMMY_USERS = [
  { id: 1, name: "Pastor James Odhiambo", username: "james.o", role: "Pastor" },
  { id: 2, name: "Sarah Mwangi", username: "sarah.m", role: "Elder" },
  { id: 3, name: "David Kamau", username: "david.k", role: "Member" },
  { id: 4, name: "Grace Wanjiru", username: "grace.w", role: "Leader" },
  { id: 5, name: "Peter Njoroge", username: "peter.n", role: "Member" },
  { id: 6, name: "Faith Akinyi", username: "faith.a", role: "Member" },
  { id: 7, name: "Samuel Otieno", username: "samuel.o", role: "Deacon" },
  { id: 8, name: "Ruth Nyambura", username: "ruth.n", role: "Member" },
];

const DUMMY_ROOMS = [
  {
    id: 1,
    name: "Young Adults Fellowship",
    description:
      "A space for young adults to connect, share, and grow together in faith.",
    members: [1, 2, 3, 4, 5],
    messages: [
      {
        id: 1,
        userId: 3,
        text: "Good morning everyone! Don't forget Bible study this Friday at 6pm 🙏",
        timestamp: "2025-03-05T07:12:00Z",
        reactions: [
          { emoji: "🙏", count: 4 },
          { emoji: "❤️", count: 2 },
        ],
      },
      {
        id: 2,
        userId: 4,
        text: "Friday works perfectly. Shall we bring food to share?",
        timestamp: "2025-03-05T07:18:00Z",
        reactions: [{ emoji: "👍", count: 3 }],
      },
      {
        id: 3,
        userId: 1,
        text: "Yes! Potluck style. The sign-up sheet will be posted on the notice board.",
        timestamp: "2025-03-05T07:45:00Z",
        reactions: [{ emoji: "🙌", count: 5 }],
      },
      {
        id: 4,
        userId: 5,
        text: "I can bring chapati and stew 🍲",
        timestamp: "2025-03-05T08:02:00Z",
        reactions: [],
      },
      {
        id: 5,
        userId: 2,
        text: "Wonderful! Let's make it a blessed evening. The sermon topic will be on purpose and calling.",
        timestamp: "2025-03-05T08:30:00Z",
        reactions: [{ emoji: "🔥", count: 3 }],
      },
    ],
  },
  {
    id: 2,
    name: "Women of Grace",
    description: "Empowering women through faith, fellowship, and prayer.",
    members: [2, 4, 6, 8],
    messages: [
      {
        id: 1,
        userId: 8,
        text: "Prayer request: please keep my family in your prayers this week 🙏",
        timestamp: "2025-03-04T09:00:00Z",
        reactions: [{ emoji: "🙏", count: 3 }],
      },
      {
        id: 2,
        userId: 4,
        text: "We're with you Ruth. You're not alone. Will keep you in prayer.",
        timestamp: "2025-03-04T09:15:00Z",
        reactions: [{ emoji: "❤️", count: 3 }],
      },
      {
        id: 3,
        userId: 2,
        text: "The Saturday mentorship session starts at 10am. We have a wonderful guest speaker!",
        timestamp: "2025-03-04T10:00:00Z",
        reactions: [{ emoji: "🎉", count: 3 }],
      },
      {
        id: 4,
        userId: 6,
        text: "So excited! Will she be speaking on marriage and family?",
        timestamp: "2025-03-04T10:20:00Z",
        reactions: [],
      },
      {
        id: 5,
        userId: 2,
        text: "Yes, and also on entrepreneurship and faith in the marketplace!",
        timestamp: "2025-03-04T10:35:00Z",
        reactions: [{ emoji: "🔥", count: 3 }],
      },
    ],
  },
  {
    id: 3,
    name: "Men's Brotherhood",
    description:
      "Building strong men of God through accountability and fellowship.",
    members: [1, 3, 5, 7],
    messages: [
      {
        id: 1,
        userId: 7,
        text: "Brothers, the early morning prayer is at 5am tomorrow. Who's joining?",
        timestamp: "2025-03-05T20:00:00Z",
        reactions: [{ emoji: "💪", count: 2 }],
      },
      {
        id: 2,
        userId: 1,
        text: "I'll be there. We need more of us showing up consistently.",
        timestamp: "2025-03-05T20:15:00Z",
        reactions: [{ emoji: "🙏", count: 3 }],
      },
      {
        id: 3,
        userId: 3,
        text: "Count me in. Alarm is set 💪",
        timestamp: "2025-03-05T20:22:00Z",
        reactions: [],
      },
      {
        id: 4,
        userId: 5,
        text: "I'll try my best. Work has been hectic but family and faith come first.",
        timestamp: "2025-03-05T20:45:00Z",
        reactions: [{ emoji: "💪", count: 2 }],
      },
      {
        id: 5,
        userId: 7,
        text: "That's the spirit Peter. We carry each other. See you all at dawn brothers 🌅",
        timestamp: "2025-03-05T21:00:00Z",
        reactions: [{ emoji: "🙏", count: 3 }],
      },
    ],
  },
  {
    id: 4,
    name: "Prayer & Intercession",
    description:
      "Dedicated intercessors standing in the gap for the church and community.",
    members: [1, 2, 4, 7, 8],
    messages: [
      {
        id: 1,
        userId: 2,
        text: "Today's prayer focus: the nation, our leaders, and those suffering in silence.",
        timestamp: "2025-03-05T05:30:00Z",
        reactions: [{ emoji: "🙏", count: 4 }],
      },
      {
        id: 2,
        userId: 8,
        text: "Amen. Let's also remember the sick in our congregation.",
        timestamp: "2025-03-05T05:45:00Z",
        reactions: [{ emoji: "🙏", count: 3 }],
      },
      {
        id: 3,
        userId: 4,
        text: "Prayer points have been shared in the document. Please review before we meet.",
        timestamp: "2025-03-05T06:00:00Z",
        reactions: [{ emoji: "👍", count: 4 }],
      },
      {
        id: 4,
        userId: 1,
        text: "Thank you all for your faithfulness. This ministry is the backbone of everything we do.",
        timestamp: "2025-03-05T06:30:00Z",
        reactions: [{ emoji: "🙌", count: 4 }],
      },
      {
        id: 5,
        userId: 7,
        text: "It's a privilege and a calling. Press on brothers and sisters! 🙏🔥",
        timestamp: "2025-03-05T06:45:00Z",
        reactions: [{ emoji: "🔥", count: 4 }],
      },
    ],
  },
  {
    id: 5,
    name: "Children's Ministry",
    description: "Training up children in the way they should go.",
    members: [4, 6, 8],
    messages: [
      {
        id: 1,
        userId: 6,
        text: "Craft supplies for Sunday school have arrived! 🎨 Paint, glitter, and cardboard.",
        timestamp: "2025-03-03T14:00:00Z",
        reactions: [{ emoji: "🎉", count: 2 }],
      },
      {
        id: 2,
        userId: 8,
        text: "Amazing! The kids are going to love making the Noah's Ark project.",
        timestamp: "2025-03-03T14:20:00Z",
        reactions: [{ emoji: "❤️", count: 2 }],
      },
      {
        id: 3,
        userId: 4,
        text: "This Sunday's lesson: Joseph and his coat of many colours. I'll prepare the visual aids.",
        timestamp: "2025-03-03T15:00:00Z",
        reactions: [{ emoji: "👍", count: 2 }],
      },
      {
        id: 4,
        userId: 6,
        text: "Perfect! Shall we do a skit? The children love acting it out.",
        timestamp: "2025-03-03T15:30:00Z",
        reactions: [{ emoji: "🙌", count: 2 }],
      },
      {
        id: 5,
        userId: 4,
        text: "Great idea! Assign roles on Saturday so everyone can practise. See you Sunday! 🌟",
        timestamp: "2025-03-03T16:00:00Z",
        reactions: [{ emoji: "🙌", count: 2 }],
      },
    ],
  },
];

const CURRENT_USER_ID = 3;

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-amber-600",
  "bg-stone-500",
  "bg-amber-700",
  "bg-yellow-600",
  "bg-stone-600",
  "bg-amber-500",
];
function avatarBg(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

const IconHash = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
    />
  </svg>
);

const IconSend = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
    />
  </svg>
);

const IconSmile = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
    />
  </svg>
);

// ── Avatar ─────────────────────────────────────────────────────────────────────

function Avatar({ userId, size = "md" }) {
  const user = DUMMY_USERS.find((u) => u.id === userId);
  if (!user) return null;
  const sz =
    size === "sm"
      ? "w-6 h-6 text-[0.45rem]"
      : size === "lg"
        ? "w-9 h-9 text-xs"
        : "w-7 h-7 text-[0.5rem]";
  return (
    <div
      className={`${sz} ${avatarBg(userId)} flex items-center justify-center text-white font-cormorant font-semibold shrink-0`}
    >
      {getInitials(user.name)}
    </div>
  );
}

// ── Room List Item (right dark panel) ────────────────────────────────────────

function RoomListItem({ room, lastMsg, lastUser, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-white/5 transition-all group ${
        isSelected
          ? "bg-amber-500/10 border-r-2 border-r-amber-500"
          : "border-r-2 border-r-transparent hover:bg-white/4"
      }`}
    >
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className={`shrink-0 transition-colors ${isSelected ? "text-amber-500" : "text-stone-600 group-hover:text-stone-400"}`}
        >
          <IconHash />
        </span>
        <span
          className={`font-cormorant text-base font-semibold truncate flex-1 leading-tight ${isSelected ? "text-stone-100" : "text-stone-400 group-hover:text-stone-200"}`}
        >
          {room.name}
        </span>
        <span
          className={`font-coptic text-[0.48rem] uppercase tracking-widest shrink-0 ${isSelected ? "text-amber-500/70" : "text-stone-700"}`}
        >
          {room.members.length}
        </span>
      </div>
      {lastMsg && (
        <p
          className={`text-[0.65rem] truncate pl-4 leading-relaxed ${isSelected ? "text-stone-400" : "text-stone-600 group-hover:text-stone-500"}`}
        >
          <span
            className={
              isSelected
                ? "text-stone-300"
                : "text-stone-500 group-hover:text-stone-400"
            }
          >
            {lastUser?.name.split(" ")[0]}:{" "}
          </span>
          {lastMsg.text}
        </p>
      )}
      {/* Member avatar strip */}
      <div className="flex items-center gap-0.5 mt-2 pl-4">
        {room.members.slice(0, 5).map((uid) => (
          <Avatar key={uid} userId={uid} size="sm" />
        ))}
        {room.members.length > 5 && (
          <span className="font-coptic text-[0.45rem] text-stone-700 ml-1">
            +{room.members.length - 5}
          </span>
        )}
      </div>
    </button>
  );
}

// ── Message Row (light chat theme) ───────────────────────────────────────────

const QUICK_REACTIONS = ["🙏", "❤️", "👍", "🔥", "🙌", "🎉", "💪"];

function MessageRow({ message, prevSameUser, onReact }) {
  const user = DUMMY_USERS.find((u) => u.id === message.userId);
  const isOwn = message.userId === CURRENT_USER_ID;
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div
      className={`flex gap-3 group ${isOwn ? "flex-row-reverse" : ""} ${prevSameUser ? "mt-0.5" : "mt-5"} relative`}
    >
      {/* Avatar */}
      <div className="w-7 shrink-0 flex items-end">
        {!prevSameUser && <Avatar userId={message.userId} size="md" />}
      </div>

      <div
        className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[72%]`}
      >
        {/* Name + time — high contrast on light bg */}
        {!prevSameUser && (
          <div
            className={`flex items-baseline gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}
          >
            <span className="font-cormorant text-sm font-semibold text-stone-800 leading-none">
              {isOwn ? "You" : user?.name.split(" ").slice(0, 2).join(" ")}
            </span>
            <span className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

        {/* Bubble — white card for others, amber for own */}
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed ${
            isOwn
              ? "bg-amber-500 text-white shadow-sm shadow-amber-200"
              : "bg-white border border-stone-200 text-stone-700 shadow-sm"
          }`}
        >
          {message.text}
        </div>

        {/* Reactions */}
        {message.reactions?.length > 0 && (
          <div
            className={`flex flex-wrap gap-1 mt-1.5 ${isOwn ? "justify-end" : ""}`}
          >
            {message.reactions.map((r, i) => (
              <button
                key={i}
                onClick={() => onReact(message.id, r.emoji)}
                className="flex items-center gap-1 bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50 px-2 py-0.5 transition-colors shadow-sm"
              >
                <span className="text-xs">{r.emoji}</span>
                <span className="font-coptic text-[0.48rem] text-stone-500">
                  {r.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover emoji trigger */}
      <div
        className={`absolute top-0 ${isOwn ? "left-10" : "right-0"} hidden group-hover:flex items-center z-10`}
      >
        <div className="relative">
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="p-1.5 bg-white border border-stone-200 text-stone-400 hover:text-amber-500 hover:border-amber-300 transition-colors shadow-sm"
          >
            <IconSmile />
          </button>
          {showPicker && (
            <div
              className={`absolute top-0 ${isOwn ? "right-full mr-1" : "right-full ml-1"} flex gap-1 bg-white border border-stone-200 px-2 py-1.5 z-20 shadow-md`}
            >
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji);
                    setShowPicker(false);
                  }}
                  className="text-sm hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function ThreadsPage() {
  const [activeRoomId, setActiveRoomId] = useState(1);
  const [search, setSearch] = useState("");
  const [allMessages, setAllMessages] = useState(() => {
    const init = {};
    DUMMY_ROOMS.forEach((r) => {
      init[r.id] = r.messages;
    });
    return init;
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeRoom = DUMMY_ROOMS.find((r) => r.id === activeRoomId);
  const roomMessages = allMessages[activeRoomId] ?? [];
  const roomMembers = DUMMY_USERS.filter((u) =>
    activeRoom?.members.includes(u.id),
  );

  const filtered = DUMMY_ROOMS.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, activeRoomId]);

  useEffect(() => {
    setInput("");
  }, [activeRoomId]);

  const handleReact = (msgId, emoji) => {
    setAllMessages((prev) => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] ?? []).map((m) => {
        if (m.id !== msgId) return m;
        const existing = m.reactions.find((r) => r.emoji === emoji);
        return {
          ...m,
          reactions: existing
            ? m.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
              )
            : [...m.reactions, { emoji, count: 1 }],
        };
      }),
    }));
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setAllMessages((prev) => ({
      ...prev,
      [activeRoomId]: [
        ...(prev[activeRoomId] ?? []),
        {
          id: Date.now(),
          userId: CURRENT_USER_ID,
          text,
          timestamp: new Date().toISOString(),
          reactions: [],
        },
      ],
    }));
    setInput("");
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f3]">
      <Sidebar />

      <div className="flex flex-1 min-w-0 overflow-hidden">
        {/* ── Centre: light chat area ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#faf8f3]">
          {/* ── Tab Bar ── */}
          <ul className="flex flex-row border-b border-stone-200 px-6">
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `font-cormorant text-xl px-5 py-4 border-b-2 transition-colors hover:cursor-pointer ${
                  isActive
                    ? "text-stone-800 border-amber-500"
                    : "text-stone-400 border-transparent hover:text-stone-700"
                }`
              }
            >
              Top Posts
            </NavLink>
            <NavLink
              to="/threads"
              className={({ isActive }) =>
                `font-cormorant text-xl px-5 py-4 border-b-2 transition-colors hover:cursor-pointer ${
                  isActive
                    ? "text-stone-800 border-amber-500"
                    : "text-stone-400 border-transparent hover:text-stone-700"
                }`
              }
            >
              My Groups
            </NavLink>
          </ul>
          {/* Chat header — light, matches FeedChannel */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white shrink-0">
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.2em] text-stone-400 mb-0.5">
                Fellowship Chat
              </p>
              <h3 className="font-cormorant text-2xl font-semibold text-stone-800 leading-tight flex items-center gap-2">
                <span className="text-amber-500">
                  <IconHash />
                </span>
                {activeRoom?.name}
              </h3>
              {activeRoom?.description && (
                <p className="text-xs text-stone-400 mt-1 border-l-2 border-amber-400/50 pl-2.5 max-w-lg leading-relaxed">
                  {activeRoom.description}
                </p>
              )}
            </div>

            {/* Member avatars */}
            <div className="flex items-center gap-1.5 shrink-0">
              {roomMembers.slice(0, 5).map((m) => (
                <div key={m.id} title={m.name}>
                  <Avatar userId={m.id} size="sm" />
                </div>
              ))}
              {roomMembers.length > 5 && (
                <div className="w-6 h-6 bg-stone-100 border border-stone-200 flex items-center justify-center">
                  <span className="font-coptic text-[0.45rem] text-stone-500">
                    +{roomMembers.length - 5}
                  </span>
                </div>
              )}
              <span className="ml-1 text-[0.6rem] font-coptic uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1">
                {roomMembers.length} members
              </span>
            </div>
          </div>

          {/* Members strip — light */}
          <div className="border-b border-stone-200 px-6 py-2.5 flex items-center gap-3 shrink-0 bg-white">
            <p className="font-coptic text-[0.48rem] uppercase tracking-widest text-stone-400 shrink-0">
              Online
            </p>
            <div className="flex items-center gap-3 overflow-x-auto">
              {roomMembers.map((m) => (
                <div key={m.id} className="flex items-center gap-1.5 shrink-0">
                  <div className="relative">
                    <Avatar userId={m.id} size="sm" />
                    {m.id <= 4 && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 ring-1 ring-white" />
                    )}
                  </div>
                  <span className="font-coptic text-[0.48rem] uppercase tracking-widest text-stone-400">
                    {m.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Messages — light parchment bg */}
          <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#faf8f3]">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="font-coptic text-[0.48rem] uppercase tracking-widest text-stone-400 shrink-0">
                Today
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {roomMessages.map((msg, i) => {
              const prevMsg = roomMessages[i - 1];
              const prevSameUser = prevMsg?.userId === msg.userId;
              return (
                <MessageRow
                  key={msg.id}
                  message={msg}
                  prevSameUser={prevSameUser}
                  onReact={handleReact}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input — light */}
          <div className="border-t border-stone-200 px-6 py-4 shrink-0 bg-white">
            <div className="flex items-end gap-3 bg-[#faf8f3] border border-stone-200 focus-within:border-amber-400 transition-colors px-4 py-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Message #${activeRoom?.name}…`}
                rows={1}
                className="flex-1 resize-none text-sm text-stone-700 placeholder:text-stone-300 bg-transparent focus:outline-none leading-relaxed max-h-28"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="shrink-0 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-100 disabled:text-stone-300 text-white font-coptic text-[0.6rem] uppercase tracking-widest px-4 py-2 transition-colors"
              >
                <IconSend />
                Send
              </button>
            </div>
            <p className="font-coptic text-[0.48rem] uppercase tracking-widest text-stone-300 mt-1.5">
              Enter to send · Shift + Enter for new line
            </p>
          </div>
        </div>

        {/* ── Right panel: dark room list ── */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#0f0f0d] border-l border-white/6 h-screen overflow-hidden">
          {/* Header */}
          <div className="px-5 py-5 border-b border-white/6 shrink-0">
            <p className="text-[0.55rem] uppercase tracking-[0.25em] text-stone-500 mb-1">
              Messaging
            </p>
            <h2 className="font-cormorant text-xl font-semibold text-stone-100 leading-tight">
              Group Chats
            </h2>
            <div className="w-5 h-0.5 bg-amber-500 mt-2" />
          </div>

          {/* Search */}
          <div className="px-3 py-3 border-b border-white/6 shrink-0">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-600">
                <IconSearch />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rooms…"
                className="w-full bg-white/5 border border-white/8 focus:border-amber-500/40 focus:outline-none pl-8 pr-3 py-2 text-xs text-stone-300 placeholder:text-stone-700 transition-colors"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="px-5 py-3 border-b border-white/6 flex items-center gap-4 shrink-0">
            <div>
              <p className="font-cormorant text-xl font-light text-stone-200">
                {DUMMY_ROOMS.length}
              </p>
              <p className="font-coptic text-[0.48rem] uppercase tracking-widest text-stone-600">
                Rooms
              </p>
            </div>
            <div className="w-px h-6 bg-white/8" />
            <div>
              <p className="font-cormorant text-xl font-light text-stone-200">
                {[...new Set(DUMMY_ROOMS.flatMap((r) => r.members))].length}
              </p>
              <p className="font-coptic text-[0.48rem] uppercase tracking-widest text-stone-600">
                Members
              </p>
            </div>
          </div>

          {/* Section label */}
          <div className="px-4 pt-4 pb-1 shrink-0">
            <p className="font-coptic text-[0.5rem] uppercase tracking-[0.2em] text-stone-600">
              Chats
            </p>
          </div>

          {/* Room list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((room) => {
              const msgs = allMessages[room.id] ?? [];
              const lastMsg = msgs[msgs.length - 1];
              const lastUser = DUMMY_USERS.find(
                (u) => u.id === lastMsg?.userId,
              );
              return (
                <RoomListItem
                  key={room.id}
                  room={room}
                  lastMsg={lastMsg}
                  lastUser={lastUser}
                  isSelected={activeRoomId === room.id}
                  onClick={() => setActiveRoomId(room.id)}
                />
              );
            })}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-10 gap-2">
                <p className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-700">
                  No rooms found
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ThreadsPage;
