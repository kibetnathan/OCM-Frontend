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
const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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
    <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">{children}</label>
  );
}

function FormInput({ ...props }) {
  return (
    <input {...props}
      className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
  );
}

function userName(u) {
  return u?.first_name && u?.last_name ? `${u.first_name} ${u.last_name}` : (u?.username ?? "—");
}

// ── Member Picker (shared) ────────────────────────────────────────────────────

function MemberPicker({ allUsers, allProfiles, selected, onChange }) {
  const [search, setSearch] = useState("");
  const filtered = allUsers.filter((u) => {
    const q = search.toLowerCase();
    return q ? `${u.first_name} ${u.last_name} ${u.username}`.toLowerCase().includes(q) : true;
  });
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((m) => m !== id) : [...selected, id]);

  return (
    <div className="flex flex-col gap-1.5">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {selected.map((id) => {
            const u = allUsers.find((u) => u.id === id);
            return (
              <span key={id} className="flex items-center gap-1 text-[0.65rem] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1">
                {u?.first_name || u?.username}
                <button type="button" onClick={() => toggle(id)} className="hover:text-amber-900"><IconX /></button>
              </span>
            );
          })}
        </div>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"><IconSearch /></span>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members…"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>
      <div className="border border-stone-200 divide-y divide-stone-100 max-h-48 overflow-y-auto">
        {filtered.length > 0 ? filtered.map((u) => {
          const mp = allProfiles.find((p) => p.user?.id === u.id);
          const checked = selected.includes(u.id);
          return (
            <div key={u.id} onClick={() => toggle(u.id)}
              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${checked ? "bg-amber-50" : "hover:bg-stone-50"}`}>
              <img src={mp?.profile_pic_url || "/images/defaultavatar.jpg"} alt={u.username} className="w-7 h-7 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-700 truncate">{userName(u)}</p>
                <p className="font-coptic text-[0.55rem] text-stone-400 truncate">
                  @{u.username}
                  {u.groups?.length > 0 && <span className="ml-2 text-amber-600">{u.groups[0]}</span>}
                </p>
              </div>
              <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
            </div>
          );
        }) : <p className="text-xs text-stone-300 px-3 py-4 text-center italic">No users found</p>}
      </div>
      {selected.length > 0 && (
        <p className="text-[0.6rem] text-stone-400 uppercase tracking-widest">{selected.length} member{selected.length !== 1 ? "s" : ""} selected</p>
      )}
    </div>
  );
}

// ── Team Card ─────────────────────────────────────────────────────────────────

function TeamCard({ team, allUsers, allProfiles, onSelect, isSelected }) {
  const memberList = allUsers.filter((u) => team.members?.includes(u.id));
  return (
    <div onClick={() => onSelect(team)}
      className={`flex flex-col bg-white border transition-all duration-200 cursor-pointer hover:border-amber-300 hover:shadow-md ${isSelected ? "border-amber-400 shadow-md" : "border-stone-100"}`}>
      <div className="flex items-start justify-between p-5 border-b border-stone-100">
        <div className="flex-1 min-w-0">
          <h3 className="font-cormorant text-xl font-semibold text-stone-800 leading-tight truncate">{team.name}</h3>
          {team.description && <p className="text-xs text-stone-400 mt-1 line-clamp-2">{team.description}</p>}
        </div>
        <span className="text-[0.6rem] uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 shrink-0 ml-3">
          {memberList.length} {memberList.length === 1 ? "member" : "members"}
        </span>
      </div>
      <div className="px-5 py-3 flex items-center gap-1.5">
        {memberList.slice(0, 7).map((m) => {
          const mp = allProfiles.find((p) => p.user?.id === m.id);
          return (
            <img key={m.id} src={mp?.profile_pic_url || "/images/defaultavatar.jpg"} alt={m.username} title={userName(m)}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-white -ml-1.5 first:ml-0" />
          );
        })}
        {memberList.length > 7 && (
          <span className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[0.55rem] text-stone-500 -ml-1.5">
            +{memberList.length - 7}
          </span>
        )}
        {memberList.length === 0 && <p className="text-xs text-stone-300 italic">No members yet</p>}
      </div>
    </div>
  );
}

// ── Team Detail ───────────────────────────────────────────────────────────────

function TeamDetail({ team, allUsers, allProfiles, onClose, onEdit, onDelete }) {
  const memberList = allUsers.filter((u) => team.members?.includes(u.id));
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="relative overflow-hidden bg-khaki/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-5">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-700 mb-1">Leadership Team</p>
          <h3 className="font-cormorant text-2xl font-semibold text-stone-100 leading-tight">{team.name}</h3>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 ml-2">
          <button onClick={onEdit} className="p-1.5 text-stone-500 hover:text-amber-400 transition-colors" title="Edit">
            <IconEdit />
          </button>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="p-1.5 text-stone-500 hover:text-red-400 transition-colors" title="Delete">
              <IconTrash />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-1 ml-1">
              <span className="font-coptic text-[0.55rem] text-red-400 uppercase tracking-widest">Delete?</span>
              <button onClick={() => onDelete(team.id)} className="p-0.5 text-red-400 hover:text-red-300"><IconCheck /></button>
              <button onClick={() => setConfirmDelete(false)} className="p-0.5 text-stone-500 hover:text-stone-300"><IconX /></button>
            </div>
          )}
          <button onClick={onClose} className="p-1.5 text-stone-600 hover:text-stone-300 transition-colors ml-0.5">
            <IconX />
          </button>
        </div>
      </div>

      {team.description && (
        <p className="text-sm text-stone-100 leading-relaxed relative z-10 border-l-2 border-amber-500/55 pl-3">{team.description}</p>
      )}

      <div className="relative z-10">
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-700 font-coptic mb-3">Members ({memberList.length})</p>
        <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
          {memberList.length > 0 ? memberList.map((m) => {
            const mp = allProfiles.find((p) => p.user?.id === m.id);
            return (
              <div key={m.id} className="flex items-center gap-3">
                <img src={mp?.profile_pic_url || "/images/defaultavatar.jpg"} alt={m.username}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-amber-500/20" />
                <div className="min-w-0">
                  <p className="text-sm text-light truncate font-cormorant font-medium">{userName(m)}</p>
                  <p className="font-coptic text-[0.55rem] text-stone-600 truncate">
                    @{m.username}
                    {m.groups?.length > 0 && <span className="ml-2 text-amber-600">{m.groups[0]}</span>}
                  </p>
                </div>
              </div>
            );
          }) : <p className="text-xs text-stone-600 italic">No members yet</p>}
        </div>
      </div>
    </div>
  );
}

// ── Create Form ───────────────────────────────────────────────────────────────

function CreateTeamForm({ allUsers, allProfiles, onSuccess }) {
  const createLeadershipTeam = useMainStore((state) => state.createLeadershipTeam);

  const [name,            setName]            = useState("");
  const [description,     setDescription]     = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [submitting,      setSubmitting]      = useState(false);
  const [error,           setError]           = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Team name is required.");
    setSubmitting(true);
    const result = await createLeadershipTeam({ name, description, members: selectedMembers });
    setSubmitting(false);
    if (result?.success) {
      setName(""); setDescription(""); setSelectedMembers([]);
      onSuccess?.();
    } else {
      setError("Failed to create team. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <InputLabel>Team Name *</InputLabel>
        <FormInput type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Elders Board" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Description <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this team oversee?"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors resize-none min-h-16 w-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Members <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <MemberPicker allUsers={allUsers} allProfiles={allProfiles} selected={selectedMembers} onChange={setSelectedMembers} />
      </div>
      {error && <p className="text-[0.6rem] uppercase tracking-widest text-red-400">{error}</p>}
      <button type="submit" disabled={submitting}
        className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2">
        {submitting ? <span className="animate-pulse">Creating…</span> : <><IconPlus /><span>Create Team</span></>}
      </button>
    </form>
  );
}

// ── Edit Form ─────────────────────────────────────────────────────────────────

function EditTeamForm({ team, allUsers, allProfiles, onSuccess, onCancel }) {
  const updateLeadershipTeam = useMainStore((state) => state.updateLeadershipTeam);

  const [name,            setName]            = useState(team.name        || "");
  const [description,     setDescription]     = useState(team.description || "");
  const [selectedMembers, setSelectedMembers] = useState(team.members     || []);
  const [submitting,      setSubmitting]      = useState(false);
  const [error,           setError]           = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Team name is required.");
    setSubmitting(true);
    const result = await updateLeadershipTeam(team.id, { name, description, members: selectedMembers });
    setSubmitting(false);
    if (result?.success) onSuccess?.(result.team);
    else setError("Failed to update team. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <InputLabel>Team Name *</InputLabel>
        <FormInput type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Description</InputLabel>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors resize-none min-h-16 w-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Members</InputLabel>
        <MemberPicker allUsers={allUsers} allProfiles={allProfiles} selected={selectedMembers} onChange={setSelectedMembers} />
      </div>
      {error && <p className="text-[0.6rem] uppercase tracking-widest text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={submitting}
          className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2">
          {submitting ? <span className="animate-pulse">Saving…</span> : <><IconCheck /><span>Save Changes</span></>}
        </button>
        <button type="button" onClick={onCancel}
          className="border border-stone-200 text-stone-500 hover:border-stone-400 font-coptic text-[0.65rem] uppercase tracking-widest px-4 py-3 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function LeadershipDashboard() {
  const token = useAuthStore((state) => state.token);

  const leadershipTeams = useMainStore((state) => state.leadership_teams);
  const allUsers        = useMainStore((state) => state.users)    || [];
  const allProfiles     = useMainStore((state) => state.profiles) || [];

  const fetchLeadershipTeams = useMainStore((state) => state.fetchLeadershipTeams);
  const deleteTeam           = useMainStore((state) => state.deleteLeadershipTeam);
  const fetchUsers           = useMainStore((state) => state.fetchUsers);
  const fetchProfiles        = useMainStore((state) => state.fetchProfiles);

  const teamList = leadershipTeams?.results ?? (Array.isArray(leadershipTeams) ? leadershipTeams : []);

  const [search,     setSearch]     = useState("");
  const [mode,       setMode]       = useState("idle"); // "idle" | "create" | "edit"
  const [selected,   setSelected]   = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchLeadershipTeams();
    fetchUsers();
    fetchProfiles();
  }, [token, fetchLeadershipTeams, fetchUsers, fetchProfiles]);

  const filtered = teamList.filter((t) => t.name?.toLowerCase().includes(search.toLowerCase()));
  const totalMembers = teamList.reduce((acc, t) => acc + (t.members?.length ?? 0), 0);

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 3000); };

  const handleDelete = async (id) => {
    await deleteTeam(id);
    // Always clear selection — the team is gone from the store regardless
    setSelected(null);
    setMode("idle");
    showSuccess("Leadership team deleted.");
  };

  const handleEditSuccess = (updatedTeam) => {
    setSelected(updatedTeam);
    setMode("idle");
    showSuccess("Leadership team updated successfully ✓");
  };

  const rightTitle = mode === "create" ? "New Team" : mode === "edit" ? "Edit Team" : "Team Details";

  return (
    <div className="min-h-screen w-full bg-[#faf8f3] p-8">

      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-1">Teams</p>
          <h1 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">Leadership Teams</h1>
          <div className="w-8 h-0.5 bg-amber-500 mt-3" />
        </div>
        <button onClick={() => { setMode(mode === "create" ? "idle" : "create"); setSelected(null); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-coptic text-[0.65rem] uppercase tracking-widest px-4 py-3 transition-colors">
          <IconPlus />
          {mode === "create" ? "Cancel" : "New Team"}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-coptic text-xs uppercase tracking-widest">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2 flex flex-col gap-5">
          <div className="flex items-center gap-6 pb-5 border-b border-stone-200">
            <div>
              <p className="font-cormorant text-3xl font-light text-stone-800">{leadershipTeams?.count ?? teamList.length}</p>
              <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Teams</p>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <p className="font-cormorant text-3xl font-light text-stone-800">{totalMembers}</p>
              <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Total Members</p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"><IconSearch /></span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teams…"
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((team) => (
                <TeamCard key={team.id} team={team} allUsers={allUsers} allProfiles={allProfiles}
                  onSelect={(t) => { setSelected(t); setMode("idle"); }}
                  isSelected={selected?.id === team.id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 gap-3">
              <div className="w-8 h-px bg-amber-500/40" />
              <p className="text-xs uppercase tracking-[0.25em] text-stone-300">
                {search ? "No teams match your search" : "No leadership teams yet"}
              </p>
              <div className="w-8 h-px bg-amber-500/40" />
            </div>
          )}
        </div>

        <div className="xl:col-span-1">
          {mode !== "idle" || selected ? (
            <>
              <SectionHeading>{rightTitle}</SectionHeading>
              {mode === "create" && (
                <CreateTeamForm allUsers={allUsers} allProfiles={allProfiles}
                  onSuccess={() => { setMode("idle"); showSuccess("Leadership team created successfully ✓"); }} />
              )}
              {mode === "edit" && selected && (
                <EditTeamForm team={selected} allUsers={allUsers} allProfiles={allProfiles}
                  onSuccess={handleEditSuccess} onCancel={() => setMode("idle")} />
              )}
              {mode === "idle" && selected && (
                <TeamDetail team={selected} allUsers={allUsers} allProfiles={allProfiles}
                  onClose={() => setSelected(null)}
                  onEdit={() => setMode("edit")}
                  onDelete={handleDelete} />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-stone-200 gap-3">
              <IconUsers />
              <p className="text-xs uppercase tracking-widest text-stone-300 font-coptic text-center">
                Select a team to view details<br />or create a new one
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default LeadershipDashboard;