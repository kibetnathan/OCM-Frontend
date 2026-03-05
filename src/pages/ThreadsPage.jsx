import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { NavLink } from 'react-router-dom';
import { useChatStore, canCreateRoom, ROOM_TYPES } from '../zustand/chatStore';
import useAuthStore from '../zustand/authStore';
import useMainStore from '../zustand/mainStore';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}
const AVATAR_COLORS = [
  'bg-amber-600', 'bg-stone-500', 'bg-amber-700',
  'bg-yellow-600', 'bg-stone-600', 'bg-amber-500',
];
function avatarBg(id) {
  return AVATAR_COLORS[Math.abs(Number(id) || 0) % AVATAR_COLORS.length];
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
  </svg>
);
const IconHash = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"/>
  </svg>
);
const IconSend = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
  </svg>
);
const IconSmile = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>
  </svg>
);
const IconPlus = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
  </svg>
);
const IconX = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ userId, name: nameProp, size = 'md' }) {
  const sz = size === 'sm' ? 'w-6 h-6 text-[0.45rem]'
           : size === 'lg' ? 'w-9 h-9 text-xs'
           : 'w-7 h-7 text-[0.5rem]';
  return (
    <div className={`${sz} ${avatarBg(userId ?? 0)} flex items-center justify-center text-white font-cormorant font-semibold shrink-0`}>
      {getInitials(nameProp ?? '?')}
    </div>
  );
}

// ── Create Room Modal ─────────────────────────────────────────────────────────
// Sections map directly to the four mainStore slices and ROOM_TYPES keys.
// Adding a new type in the future = add one entry to SECTIONS, nothing else.

const SECTIONS = [
  { type: 'fellowship', label: 'Fellowship Groups',  storeKey: 'fellowships'      },
  { type: 'leadership', label: 'Leadership Teams',   storeKey: 'leadership_teams' },
  { type: 'department', label: 'Serving Teams',      storeKey: 'departments'      },
  { type: 'course',     label: 'Courses',            storeKey: 'courses'          },
];

function GroupOption({ group, typeKey, selectedKey, onSelect }) {
  const isSelected = selectedKey === `${typeKey}_${group.id}`;
  return (
    <button
      onClick={() => onSelect(`${typeKey}_${group.id}`, group, typeKey)}
      className={`w-full text-left px-4 py-2.5 border transition-colors ${
        isSelected
          ? 'border-amber-400 bg-amber-50'
          : 'border-stone-200 hover:border-stone-300 bg-white'
      }`}
    >
      <p className="font-cormorant text-sm font-semibold text-stone-800 leading-tight">{group.name}</p>
      {group.description && (
        <p className="text-xs text-stone-400 mt-0.5 truncate">{group.description}</p>
      )}
    </button>
  );
}

function CreateRoomModal({ onClose, onConfirm, loading, error }) {
  const [selectedKey, setSelectedKey] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  const { fellowships, leadership_teams, departments, courses,
          fetchFellowships, fetchLeadershipTeams, fetchDepartments, fetchCourses } = useMainStore();

  // Load all four lists when the modal opens
  useEffect(() => {
    fetchFellowships();
    fetchLeadershipTeams();
    fetchDepartments();
    fetchCourses();
  }, []);

  // Map storeKey -> actual array (handle both paginated and plain array)
  const storeData = { fellowships, leadership_teams, departments, courses };
  function getList(storeKey) {
    const val = storeData[storeKey];
    return val?.results ?? (Array.isArray(val) ? val : []);
  }

  const handleSelect = (key, group, type) => {
    setSelectedKey(key);
    setSelectedGroup(group);
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (selectedGroup && selectedType) onConfirm(selectedGroup, selectedType);
  };

  const hasAnyItems = SECTIONS.some((s) => getList(s.storeKey).length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#faf8f3] border border-stone-200 shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 shrink-0">
          <div>
            <p className="text-[0.5rem] uppercase tracking-[0.2em] text-stone-400 mb-0.5">New Chat Room</p>
            <h2 className="font-cormorant text-xl font-semibold text-stone-800">Link a Group</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <IconX />
          </button>
        </div>

        {/* Body -- scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <p className="text-xs text-stone-500 leading-relaxed">
            Select a group to create a chat room for. Each group can only have one room.
          </p>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
          )}

          {!hasAnyItems && (
            <div className="py-6 text-center">
              <p className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">
                Loading groups...
              </p>
            </div>
          )}

          {SECTIONS.map(({ type, label, storeKey }) => {
            const list = getList(storeKey);
            if (list.length === 0) return null;
            return (
              <div key={type}>
                <p className="font-coptic text-[0.5rem] uppercase tracking-[0.18em] text-stone-400 mb-2">
                  {label}
                </p>
                <div className="space-y-1.5">
                  {list.map((group) => (
                    <GroupOption
                      key={group.id}
                      group={group}
                      typeKey={type}
                      selectedKey={selectedKey}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500 hover:text-stone-700 px-4 py-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedKey || loading}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-100 disabled:text-stone-300 text-white font-coptic text-[0.6rem] uppercase tracking-widest px-5 py-2 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Room List Item ────────────────────────────────────────────────────────────

function RoomListItem({ room, lastMsg, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-white/5 transition-all group ${
        isSelected
          ? 'bg-amber-500/10 border-r-2 border-r-amber-500'
          : 'border-r-2 border-r-transparent hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center gap-2 mb-0.5">
        <span className={`shrink-0 transition-colors ${isSelected ? 'text-amber-500' : 'text-stone-600 group-hover:text-stone-400'}`}>
          <IconHash />
        </span>
        <span className={`font-cormorant text-base font-semibold truncate flex-1 leading-tight ${isSelected ? 'text-stone-100' : 'text-stone-400 group-hover:text-stone-200'}`}>
          {room.name}
        </span>
        {room.sourceType && (
          <span className="font-coptic text-[0.42rem] uppercase tracking-widest text-stone-700 shrink-0">
            {ROOM_TYPES[room.sourceType]?.label ?? room.sourceType}
          </span>
        )}
      </div>
      {room.description && (
        <p className={`text-[0.6rem] truncate pl-4 leading-relaxed ${isSelected ? 'text-stone-500' : 'text-stone-700'}`}>
          {room.description}
        </p>
      )}
      {lastMsg && (
        <p className={`text-[0.62rem] truncate pl-4 mt-0.5 leading-relaxed ${isSelected ? 'text-stone-400' : 'text-stone-600 group-hover:text-stone-500'}`}>
          <span className={isSelected ? 'text-stone-300' : 'text-stone-500 group-hover:text-stone-400'}>
            {lastMsg.displayName?.split(' ')[0]}:{' '}
          </span>
          {lastMsg.text}
        </p>
      )}
    </button>
  );
}

// ── Message Row ───────────────────────────────────────────────────────────────

const QUICK_REACTIONS = ['pray', 'heart', 'thumbsup', 'fire', 'raised_hands', 'tada', 'muscle'];
const REACTION_DISPLAY = {
  pray: '🙏', heart: '❤️', thumbsup: '👍', fire: '🔥',
  raised_hands: '🙌', tada: '🎉', muscle: '💪',
};

function MessageRow({ message, prevSameUser, onReact, currentUserId }) {
  const isOwn = String(message.userId) === String(currentUserId);
  const [showPicker, setShowPicker] = useState(false);
  const reactions = message.reactions ?? [];

  return (
    <div className={`flex gap-3 group ${isOwn ? 'flex-row-reverse' : ''} ${prevSameUser ? 'mt-0.5' : 'mt-5'} relative`}>
      <div className="w-7 shrink-0 flex items-end">
        {!prevSameUser && (
          <Avatar userId={message.userId} name={message.displayName} size="md" />
        )}
      </div>

      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[72%]`}>
        {!prevSameUser && (
          <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <span className="font-cormorant text-sm font-semibold text-stone-800 leading-none">
              {isOwn ? 'You' : (message.displayName ?? 'Member')}
            </span>
            <span className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

        <div className={`px-3.5 py-2.5 text-sm leading-relaxed ${
          isOwn
            ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
            : 'bg-white border border-stone-200 text-stone-700 shadow-sm'
        }`}>
          {message.text}
        </div>

        {reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1.5 ${isOwn ? 'justify-end' : ''}`}>
            {reactions.map((r) => {
              const hasReacted = r.users?.includes(String(currentUserId));
              const display = REACTION_DISPLAY[r.emoji] ?? r.emoji;
              return (
                <button
                  key={r.emoji}
                  onClick={() => onReact(message.id, r.emoji)}
                  className={`flex items-center gap-1 border px-2 py-0.5 transition-colors shadow-sm ${
                    hasReacted
                      ? 'bg-amber-50 border-amber-400'
                      : 'bg-white border-stone-200 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-xs">{display}</span>
                  <span className="font-coptic text-[0.48rem] text-stone-500">{r.users?.length ?? 0}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={`absolute top-0 ${isOwn ? 'left-10' : 'right-0'} hidden group-hover:flex items-center z-10`}>
        <div className="relative">
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="p-1.5 bg-white border border-stone-200 text-stone-400 hover:text-amber-500 hover:border-amber-300 transition-colors shadow-sm"
          >
            <IconSmile />
          </button>
          {showPicker && (
            <div className={`absolute top-0 ${isOwn ? 'right-full mr-1' : 'left-full ml-1'} flex gap-1 bg-white border border-stone-200 px-2 py-1.5 z-20 shadow-md`}>
              {QUICK_REACTIONS.map((key) => (
                <button
                  key={key}
                  onClick={() => { onReact(message.id, key); setShowPicker(false); }}
                  className="text-sm hover:scale-125 transition-transform"
                >
                  {REACTION_DISPLAY[key]}
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
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    rooms, roomsLoading,
    messages, messagesLoading,
    subscribeToRooms, subscribeToRoom,
    sendMessage, handleReaction, createRoom,
  } = useChatStore();
  const { user } = useAuthStore();

  const isPrivileged = canCreateRoom(user);

  // Bootstrap
  useEffect(() => {
    subscribeToRooms();
    return () => {
      useChatStore.getState().roomsUnsubscribe?.();
      useChatStore.getState().messagesUnsubscribe?.();
    };
  }, []);

  // Auto-select first room
  useEffect(() => {
    if (rooms.length > 0 && activeRoomId === null) {
      setActiveRoomId(rooms[0].id);
    }
  }, [rooms]);

  // Subscribe to messages when room changes
  useEffect(() => {
    if (activeRoomId !== null) {
      subscribeToRoom(activeRoomId);
      setInput('');
    }
  }, [activeRoomId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  const filtered = rooms
    .filter((r) => typeof r.name === 'string')
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const handleSend = () => {
    const text = input.trim();
    if (!text || !user || activeRoomId === null) return;
    const displayName =
      user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.username ?? 'Member';
    sendMessage(activeRoomId, user.id, displayName, text);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onReact = (messageId, emoji) => {
    if (!user || activeRoomId === null) return;
    handleReaction(activeRoomId, messageId, emoji, user.id);
  };

  // Now receives both group and type from the modal
  const handleCreateRoom = async (group, type) => {
    if (!user) return;
    setCreateLoading(true);
    setCreateError('');
    const result = await createRoom(group, type, user);
    setCreateLoading(false);
    if (result.success) {
      setShowCreateModal(false);
    } else {
      setCreateError(result.error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f3]">
      <Sidebar />

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => { setShowCreateModal(false); setCreateError(''); }}
          onConfirm={handleCreateRoom}
          loading={createLoading}
          error={createError}
        />
      )}

      <div className="flex flex-1 min-w-0 overflow-hidden">
        {/* Centre: chat area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#faf8f3]">

          <ul className="flex flex-row border-b border-stone-200 px-6">
            {[{ to: '/feed', label: 'Top Posts' }, { to: '/threads', label: 'My Groups' }].map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `font-cormorant text-xl px-5 py-4 border-b-2 transition-colors hover:cursor-pointer ${isActive ? 'text-stone-800 border-amber-500' : 'text-stone-400 border-transparent hover:text-stone-700'}`
              }>{label}</NavLink>
            ))}
          </ul>

          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white shrink-0">
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.2em] text-stone-400 mb-0.5">Fellowship Chat</p>
              <h3 className="font-cormorant text-2xl font-semibold text-stone-800 leading-tight flex items-center gap-2">
                <span className="text-amber-500"><IconHash /></span>
                {roomsLoading ? '...' : (activeRoom?.name ?? 'Select a room')}
              </h3>
              {activeRoom?.description && (
                <p className="text-xs text-stone-400 mt-1 border-l-2 border-amber-400/50 pl-2.5 max-w-lg leading-relaxed">
                  {activeRoom.description}
                </p>
              )}
            </div>
            {activeRoom?.createdBy && (
              <p className="text-[0.52rem] font-coptic uppercase tracking-widest text-stone-400 shrink-0">
                Created by {activeRoom.createdBy.displayName}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#faf8f3]">
            {messagesLoading && (
              <div className="flex justify-center py-10">
                <span className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-400 animate-pulse">
                  Loading messages...
                </span>
              </div>
            )}
            {!messagesLoading && activeRoomId === null && (
              <div className="flex flex-col items-center py-20 gap-3 text-center">
                <p className="font-cormorant text-xl text-stone-400">Select a room to begin</p>
              </div>
            )}
            {!messagesLoading && activeRoomId !== null && messages.length === 0 && (
              <div className="flex flex-col items-center py-16 gap-2 text-center">
                <p className="font-cormorant text-lg text-stone-400">Be the first to speak in this room</p>
                <p className="text-xs text-stone-300 font-coptic uppercase tracking-widest">No messages yet</p>
              </div>
            )}
            {!messagesLoading && messages.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="font-coptic text-[0.48rem] uppercase tracking-widest text-stone-400 shrink-0">Today</span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>
                {messages.map((msg, i) => (
                  <MessageRow
                    key={msg.id}
                    message={msg}
                    prevSameUser={messages[i - 1]?.userId === msg.userId}
                    onReact={onReact}
                    currentUserId={user?.id}
                  />
                ))}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-stone-200 px-6 py-4 shrink-0 bg-white">
            <div className="flex items-end gap-3 bg-[#faf8f3] border border-stone-200 focus-within:border-amber-400 transition-colors px-4 py-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={activeRoom ? `Message #${activeRoom.name}...` : 'Select a room...'}
                disabled={activeRoomId === null}
                rows={1}
                className="flex-1 resize-none text-sm text-stone-700 placeholder:text-stone-300 bg-transparent focus:outline-none leading-relaxed max-h-28 disabled:opacity-40"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || activeRoomId === null}
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

        {/* Right panel: dark room list */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#0f0f0d] border-l border-white/6 h-screen overflow-hidden">
          <div className="px-5 py-5 border-b border-white/6 shrink-0">
            <p className="text-[0.55rem] uppercase tracking-[0.25em] text-stone-500 mb-1">Messaging</p>
            <h2 className="font-cormorant text-xl font-semibold text-stone-100 leading-tight">Group Chats</h2>
            <div className="w-5 h-0.5 bg-amber-500 mt-2" />
          </div>

          <div className="px-3 py-3 border-b border-white/6 shrink-0">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-600"><IconSearch /></span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rooms..."
                className="w-full bg-white/5 border border-white/[0.08] focus:border-amber-500/40 focus:outline-none pl-8 pr-3 py-2 text-xs text-stone-300 placeholder:text-stone-700 transition-colors"
              />
            </div>
          </div>

          <div className="px-5 py-3 border-b border-white/6 flex items-center gap-4 shrink-0">
            <div>
              <p className="font-cormorant text-xl font-light text-stone-200">{rooms.length}</p>
              <p className="font-coptic text-[0.48rem] uppercase tracking-widest text-stone-600">Rooms</p>
            </div>
          </div>

          <div className="px-4 pt-4 pb-2 shrink-0 flex items-center justify-between">
            <p className="font-coptic text-[0.5rem] uppercase tracking-[0.2em] text-stone-600">Chats</p>
            {isPrivileged && (
              <button
                onClick={() => setShowCreateModal(true)}
                title="Create a new room"
                className="flex items-center gap-1 text-stone-600 hover:text-amber-500 transition-colors"
              >
                <IconPlus />
                <span className="font-coptic text-[0.48rem] uppercase tracking-widest">New</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {roomsLoading && (
              <div className="flex justify-center py-10">
                <span className="font-coptic text-[0.45rem] uppercase tracking-widest text-stone-700 animate-pulse">Loading...</span>
              </div>
            )}
            {!roomsLoading && filtered.map((room) => (
              <RoomListItem
                key={room.id}
                room={room}
                lastMsg={activeRoomId === room.id ? messages[messages.length - 1] : null}
                isSelected={activeRoomId === room.id}
                onClick={() => setActiveRoomId(room.id)}
              />
            ))}
            {!roomsLoading && filtered.length === 0 && (
              <div className="flex flex-col items-center py-10 gap-2">
                <p className="font-coptic text-[0.5rem] uppercase tracking-widest text-stone-700">No rooms found</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ThreadsPage;