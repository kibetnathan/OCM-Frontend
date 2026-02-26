import React, { useEffect, useState } from "react";
import useMainStore from "../zustand/mainStore";
import useAuthStore from "../zustand/authStore";

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const IconChevron = ({ open }) => (
  <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const IconX = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="font-cormorant text-2xl font-semibold text-stone-800 shrink-0">{children}</h2>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  );
}

function InputLabel({ children }) {
  return (
    <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">
      {children}
    </label>
  );
}

function FormInput({ ...props }) {
  return (
    <input
      {...props}
      className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
    />
  );
}

// ── Fellowship Card ───────────────────────────────────────────────────────────

function FellowshipCard({ group, allUsers, allProfiles, onSelect, isSelected }) {
  const memberList = allUsers.filter((u) => group.members?.includes(u.id));
  const leader = allUsers.find((u) => u.id === group.leader);
  const leaderProfile = allProfiles.find((p) => p.user?.id === group.leader);

  return (
    <div
      onClick={() => onSelect(group)}
      className={`flex flex-col bg-white border transition-all duration-200 cursor-pointer hover:border-amber-300 hover:shadow-md ${
        isSelected ? "border-amber-400 shadow-md" : "border-stone-100"
      }`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between p-5 border-b border-stone-100">
        <div>
          <h3 className="font-cormorant text-xl font-semibold text-stone-800 leading-tight">
            {group.name}
          </h3>
          {group.description && (
            <p className="text-xs text-stone-400 mt-1 line-clamp-1">{group.description}</p>
          )}
        </div>
        <span className="text-[0.6rem] uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 shrink-0 ml-3">
          {memberList.length} {memberList.length === 1 ? "member" : "members"}
        </span>
      </div>

      {/* Leader */}
      <div className="px-5 py-3 flex items-center gap-3 border-b border-stone-100">
        <img
          src={leaderProfile?.profile_pic || "/images/defaultavatar.jpg"}
          alt={leader?.username || "Leader"}
          className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/30"
        />
        <div>
          <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Leader</p>
          <p className="text-xs text-stone-600 font-medium">
            {leader
              ? leader.first_name && leader.last_name
                ? `${leader.first_name} ${leader.last_name}`
                : leader.username
              : "—"}
          </p>
        </div>
      </div>

      {/* Member avatars */}
      <div className="px-5 py-3 flex items-center gap-1.5">
        {memberList.slice(0, 6).map((m) => {
          const mp = allProfiles.find((p) => p.user?.id === m.id);
          return (
            <img
              key={m.id}
              src={mp?.profile_pic || "/images/defaultavatar.jpg"}
              alt={m.username}
              title={m.first_name ? `${m.first_name} ${m.last_name}` : m.username}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-white -ml-1.5 first:ml-0"
            />
          );
        })}
        {memberList.length > 6 && (
          <span className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[0.55rem] text-stone-500 font-medium -ml-1.5">
            +{memberList.length - 6}
          </span>
        )}
        {memberList.length === 0 && (
          <p className="text-xs text-stone-300 italic">No members yet</p>
        )}
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function FellowshipDetail({ group, allUsers, allProfiles, onClose }) {
  const memberList = allUsers.filter((u) => group.members?.includes(u.id));
  const leader = allUsers.find((u) => u.id === group.leader);
  const leaderProfile = allProfiles.find((p) => p.user?.id === group.leader);

  return (
    <div className="relative overflow-hidden bg-[#0f0f0d]/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-5">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 mb-1">Fellowship Group</p>
          <h3 className="font-cormorant text-2xl font-semibold text-stone-100 leading-tight">
            {group.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-stone-600 hover:text-stone-300 transition-colors p-1"
        >
          <IconX />
        </button>
      </div>

      {group.description && (
        <p className="text-xs text-stone-400 leading-relaxed relative z-10 border-l-2 border-amber-500/30 pl-3">
          {group.description}
        </p>
      )}

      {/* Leader */}
      <div className="relative z-10">
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 font-coptic mb-2">Leader</p>
        <div className="flex items-center gap-3">
          <img
            src={leaderProfile?.profile_pic || "/images/defaultavatar.jpg"}
            alt={leader?.username || "Leader"}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/30"
          />
          <div>
            <p className="text-sm font-cormorant font-semibold text-stone-200">
              {leader
                ? leader.first_name && leader.last_name
                  ? `${leader.first_name} ${leader.last_name}`
                  : leader.username
                : "No leader assigned"}
            </p>
            {leader && (
              <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-500">
                @{leader.username}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="relative z-10">
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 font-coptic mb-2">
          Members ({memberList.length})
        </p>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {memberList.length > 0 ? memberList.map((m) => {
            const mp = allProfiles.find((p) => p.user?.id === m.id);
            return (
              <div key={m.id} className="flex items-center gap-3">
                <img
                  src={mp?.profile_pic || "/images/defaultavatar.jpg"}
                  alt={m.username}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs text-stone-300 truncate">
                    {m.first_name && m.last_name ? `${m.first_name} ${m.last_name}` : m.username}
                  </p>
                  <p className="font-coptic text-[0.55rem] text-stone-600 truncate">@{m.username}</p>
                </div>
              </div>
            );
          }) : (
            <p className="text-xs text-stone-600 italic">No members yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create Form ───────────────────────────────────────────────────────────────

function CreateFellowshipForm({ allUsers, allProfiles, onSuccess }) {
  const createFellowship = useMainStore((state) => state.createFellowship);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const filteredUsers = allUsers.filter((u) => {
    const q = memberSearch.toLowerCase();
    const name = `${u.first_name} ${u.last_name} ${u.username}`.toLowerCase();
    return q ? name.includes(q) : true;
  });

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Group name is required.");
    setSubmitting(true);
    const result = await createFellowship({
      name,
      description,
      leader: leaderId ? Number(leaderId) : null,
      members: selectedMembers,
    });
    setSubmitting(false);
    if (result.success) {
      setName(""); setDescription(""); setLeaderId("");
      setSelectedMembers([]); setMemberSearch("");
      onSuccess?.();
    } else {
      setError("Failed to create group. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Group Name *</InputLabel>
        <FormInput
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Nairobi North Fellowship"
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Description <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this fellowship group…"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors resize-none min-h-16 w-full"
        />
      </div>

      {/* Leader */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Leader <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <select
          value={leaderId}
          onChange={(e) => setLeaderId(e.target.value)}
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors w-full"
        >
          <option value="">Select a leader…</option>
          {allUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.first_name && u.last_name
                ? `${u.first_name} ${u.last_name} (@${u.username})`
                : `@${u.username}`}
            </option>
          ))}
        </select>
      </div>

      {/* Members */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Members <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>

        {/* Selected chips */}
        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {selectedMembers.map((id) => {
              const u = allUsers.find((u) => u.id === id);
              return (
                <span
                  key={id}
                  className="flex items-center gap-1 text-[0.65rem] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1"
                >
                  {u?.first_name || u?.username}
                  <button type="button" onClick={() => toggleMember(id)} className="hover:text-amber-900">
                    <IconX />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300">
            <IconSearch />
          </span>
          <input
            type="text"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            placeholder="Search members…"
            className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
          />
        </div>

        {/* User list */}
        <div className="border border-stone-200 divide-y divide-stone-100 max-h-48 overflow-y-auto">
          {filteredUsers.length > 0 ? filteredUsers.map((u) => {
            const mp = allProfiles.find((p) => p.user?.id === u.id);
            const checked = selectedMembers.includes(u.id);
            return (
              <div
                key={u.id}
                onClick={() => toggleMember(u.id)}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                  checked ? "bg-amber-50" : "hover:bg-stone-50"
                }`}
              >
                <img
                  src={mp?.profile_pic || "/images/defaultavatar.jpg"}
                  alt={u.username}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-700 truncate">
                    {u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.username}
                  </p>
                  <p className="font-coptic text-[0.55rem] text-stone-400 truncate">@{u.username}</p>
                </div>
                <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                  checked ? "bg-amber-500 border-amber-500" : "border-stone-300"
                }`}>
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>
            );
          }) : (
            <p className="text-xs text-stone-300 px-3 py-4 text-center italic">No users found</p>
          )}
        </div>
        {selectedMembers.length > 0 && (
          <p className="text-[0.6rem] text-stone-400 uppercase tracking-widest">
            {selectedMembers.length} member{selectedMembers.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      {error && (
        <p className="text-[0.6rem] uppercase tracking-widest text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2 group"
      >
        {submitting ? (
          <span className="animate-pulse">Creating…</span>
        ) : (
          <><IconPlus /><span>Create Fellowship Group</span></>
        )}
      </button>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function Fellowships() {
  const token = useAuthStore((state) => state.token);

  const fellowships = useMainStore((state) => state.fellowships);
  const allUsers    = useMainStore((state) => state.users) || [];
  const allProfiles = useMainStore((state) => state.profiles) || [];

  const fetchFellowships = useMainStore((state) => state.fetchFellowships);
  const fetchUsers       = useMainStore((state) => state.fetchUsers);
  const fetchProfiles    = useMainStore((state) => state.fetchProfiles);

  const fellowshipList = fellowships?.results
    ?? (Array.isArray(fellowships) ? fellowships : []);

  const [search, setSearch]         = useState("");
  const [selectedGroup, setSelected] = useState(null);
  const [showForm, setShowForm]      = useState(false);
  const [successMsg, setSuccessMsg]  = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchFellowships();
    fetchUsers();
    fetchProfiles();
  },[token, fetchUsers, fetchProfiles, fetchFellowships]);

  const filtered = fellowshipList.filter((g) =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuccess = () => {
    setShowForm(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-[#faf8f3] p-8">

      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-1">Groups</p>
          <h1 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">
            Fellowship Groups
          </h1>
          <div className="w-8 h-0.5 bg-amber-500 mt-3" />
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setSelected(null); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-coptic text-[0.65rem] uppercase tracking-widest px-4 py-3 transition-colors"
        >
          <IconPlus />
          {showForm ? "Cancel" : "New Group"}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-coptic text-xs uppercase tracking-widest">
          Fellowship group created successfully ✓
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ── Left: list + search ── */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Stats bar */}
          <div className="flex items-center gap-6 pb-5 border-b border-stone-200">
            <div>
              <p className="font-cormorant text-3xl font-light text-stone-800">
                {fellowships?.count ?? fellowshipList.length}
              </p>
              <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Total Groups</p>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <p className="font-cormorant text-3xl font-light text-stone-800">
                {fellowshipList.reduce((acc, g) => acc + (g.members?.length ?? 0), 0)}
              </p>
              <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Total Members</p>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <p className="font-cormorant text-3xl font-light text-stone-800">
                {fellowshipList.filter((g) => g.leader).length}
              </p>
              <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">With Leaders</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300">
              <IconSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups…"
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
            />
          </div>

          {/* Group cards */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((group) => (
                <FellowshipCard
                  key={group.id}
                  group={group}
                  allUsers={allUsers}
                  allProfiles={allProfiles}
                  onSelect={(g) => { setSelected(g); setShowForm(false); }}
                  isSelected={selectedGroup?.id === group.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 gap-3">
              <div className="w-8 h-px bg-amber-500/40" />
              <p className="text-xs uppercase tracking-[0.25em] text-stone-300">
                {search ? "No groups match your search" : "No fellowship groups yet"}
              </p>
              <div className="w-8 h-px bg-amber-500/40" />
            </div>
          )}
        </div>

        {/* ── Right: detail or form ── */}
        <div className="xl:col-span-1">
          {showForm ? (
            <>
              <SectionHeading>New Group</SectionHeading>
              <CreateFellowshipForm
                allUsers={allUsers}
                allProfiles={allProfiles}
                onSuccess={handleSuccess}
              />
            </>
          ) : selectedGroup ? (
            <>
              <SectionHeading>Group Details</SectionHeading>
              <FellowshipDetail
                group={selectedGroup}
                allUsers={allUsers}
                allProfiles={allProfiles}
                onClose={() => setSelected(null)}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-stone-200 gap-3">
              <IconUsers />
              <p className="text-xs uppercase tracking-widest text-stone-300 font-coptic text-center">
                Select a group to view details<br />or create a new one
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Fellowships;