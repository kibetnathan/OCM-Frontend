import React, { useEffect, useState } from "react";
import useMainStore from "../zustand/mainStore";
import useAuthStore from "../zustand/authStore";

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconBuilding = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
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

function userName(u) {
  return u?.first_name && u?.last_name
    ? `${u.first_name} ${u.last_name}`
    : u?.username ?? "—";
}

// ── Department Card ───────────────────────────────────────────────────────────

function DepartmentCard({ dept, allUsers, allProfiles, onSelect, isSelected }) {
  const memberList    = allUsers.filter((u) => dept.members?.includes(u.id));
  const leader        = allUsers.find((u) => u.id === dept.leader);
  const leaderProfile = allProfiles.find((p) => p.user?.id === dept.leader);

  return (
    <div
      onClick={() => onSelect(dept)}
      className={`flex flex-col bg-white border transition-all duration-200 cursor-pointer hover:border-amber-300 hover:shadow-md ${
        isSelected ? "border-amber-400 shadow-md" : "border-stone-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-stone-100">
        <div className="flex-1 min-w-0">
          <h3 className="font-cormorant text-xl font-semibold text-stone-800 leading-tight truncate">
            {dept.name}
          </h3>
          {dept.description && (
            <p className="text-xs text-stone-400 mt-1 line-clamp-2">{dept.description}</p>
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
          className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/30"
        />
        <div>
          <p className="text-[0.55rem] uppercase tracking-widest text-stone-400 font-coptic leading-none">Leader</p>
          <p className="text-xs text-stone-600">{leader ? userName(leader) : "—"}</p>
        </div>
      </div>

      {/* Member avatars */}
      <div className="px-5 py-3 flex items-center gap-1">
        {memberList.slice(0, 6).map((m) => {
          const mp = allProfiles.find((p) => p.user?.id === m.id);
          return (
            <img
              key={m.id}
              src={mp?.profile_pic || "/images/defaultavatar.jpg"}
              alt={m.username}
              title={userName(m)}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-white -ml-1.5 first:ml-0"
            />
          );
        })}
        {memberList.length > 6 && (
          <span className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[0.55rem] text-stone-500 -ml-1.5">
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

function DepartmentDetail({ dept, allUsers, allProfiles, onClose }) {
  const memberList    = allUsers.filter((u) => dept.members?.includes(u.id));
  const leader        = allUsers.find((u) => u.id === dept.leader);
  const leaderProfile = allProfiles.find((p) => p.user?.id === dept.leader);

  return (
    <div className="relative overflow-hidden bg-[#0f0f0d]/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-5">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 mb-1">Department</p>
          <h3 className="font-cormorant text-2xl font-semibold text-stone-100 leading-tight">
            {dept.name}
          </h3>
        </div>
        <button onClick={onClose} className="text-stone-600 hover:text-stone-300 transition-colors p-1">
          <IconX />
        </button>
      </div>

      {dept.description && (
        <p className="text-xs text-stone-400 leading-relaxed relative z-10 border-l-2 border-amber-500/30 pl-3">
          {dept.description}
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
              {leader ? userName(leader) : "No leader assigned"}
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
                  <p className="text-xs text-stone-300 truncate">{userName(m)}</p>
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

function CreateDepartmentForm({ allUsers, allProfiles, onSuccess }) {
  const createDepartment = useMainStore((state) => state.createDepartment);

  const [name,           setName]           = useState("");
  const [description,    setDescription]    = useState("");
  const [leaderId,       setLeaderId]       = useState("");
  const [memberSearch,   setMemberSearch]   = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [submitting,     setSubmitting]     = useState(false);
  const [error,          setError]          = useState(null);

  const filteredUsers = allUsers.filter((u) => {
    const q = memberSearch.toLowerCase();
    return q
      ? `${u.first_name} ${u.last_name} ${u.username}`.toLowerCase().includes(q)
      : true;
  });

  const toggleMember = (id) =>
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Department name is required.");
    setSubmitting(true);
    const result = await createDepartment({
      name,
      description,
      leader: leaderId ? Number(leaderId) : null,
      members: selectedMembers,
    });
    setSubmitting(false);
    if (result?.success) {
      setName(""); setDescription(""); setLeaderId("");
      setSelectedMembers([]); setMemberSearch("");
      onSuccess?.();
    } else {
      setError("Failed to create department. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Department Name *</InputLabel>
        <input
          type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Worship & Arts"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Description <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <textarea
          value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this department do?"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors resize-none min-h-16 w-full"
        />
      </div>

      {/* Leader */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Leader <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <select
          value={leaderId} onChange={(e) => setLeaderId(e.target.value)}
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

        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {selectedMembers.map((id) => {
              const u = allUsers.find((u) => u.id === id);
              return (
                <span key={id} className="flex items-center gap-1 text-[0.65rem] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1">
                  {u?.first_name || u?.username}
                  <button type="button" onClick={() => toggleMember(id)} className="hover:text-amber-900">
                    <IconX />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"><IconSearch /></span>
          <input
            type="text" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)}
            placeholder="Search members…"
            className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
          />
        </div>

        <div className="border border-stone-200 divide-y divide-stone-100 max-h-48 overflow-y-auto">
          {filteredUsers.length > 0 ? filteredUsers.map((u) => {
            const mp      = allProfiles.find((p) => p.user?.id === u.id);
            const checked = selectedMembers.includes(u.id);
            return (
              <div
                key={u.id} onClick={() => toggleMember(u.id)}
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
                  <p className="text-sm text-stone-700 truncate">{userName(u)}</p>
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
        type="submit" disabled={submitting}
        className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2"
      >
        {submitting
          ? <span className="animate-pulse">Creating…</span>
          : <><IconPlus /><span>Create Department</span></>}
      </button>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function DepartmentDashboard() {
  const token = useAuthStore((state) => state.token);

  const departments = useMainStore((state) => state.departments);
  const allUsers    = useMainStore((state) => state.users)    || [];
  const allProfiles = useMainStore((state) => state.profiles) || [];

  const fetchDepartments = useMainStore((state) => state.fetchDepartments);
  const fetchUsers       = useMainStore((state) => state.fetchUsers);
  const fetchProfiles    = useMainStore((state) => state.fetchProfiles);

  const deptList = departments?.results
    ?? (Array.isArray(departments) ? departments : []);

  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchDepartments();
    fetchUsers();
    fetchProfiles();
  }, [token, fetchDepartments, fetchUsers, fetchProfiles]);

  const filtered = deptList.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalMembers  = deptList.reduce((acc, d) => acc + (d.members?.length ?? 0), 0);
  const withLeaders   = deptList.filter((d) => d.leader).length;

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
            Serving Departments
          </h1>
          <div className="w-8 h-0.5 bg-amber-500 mt-3" />
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setSelected(null); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-coptic text-[0.65rem] uppercase tracking-widest px-4 py-3 transition-colors"
        >
          <IconPlus />
          {showForm ? "Cancel" : "New Department"}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-coptic text-xs uppercase tracking-widest">
          Department created successfully ✓
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ── Left: list ── */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Stats */}
          <div className="flex items-center gap-6 pb-5 border-b border-stone-200 flex-wrap">
            {[
              { label: "Departments",    value: departments?.count ?? deptList.length },
              { label: "Total Members",  value: totalMembers },
              { label: "With Leaders",   value: withLeaders },
            ].map(({ label, value }, i, arr) => (
              <React.Fragment key={label}>
                <div>
                  <p className="font-cormorant text-3xl font-light text-stone-800">{value}</p>
                  <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">{label}</p>
                </div>
                {i < arr.length - 1 && <div className="w-px h-8 bg-stone-200" />}
              </React.Fragment>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"><IconSearch /></span>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments…"
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
            />
          </div>

          {/* Cards */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  dept={dept}
                  allUsers={allUsers}
                  allProfiles={allProfiles}
                  onSelect={(d) => { setSelected(d); setShowForm(false); }}
                  isSelected={selected?.id === dept.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 gap-3">
              <div className="w-8 h-px bg-amber-500/40" />
              <p className="text-xs uppercase tracking-[0.25em] text-stone-300">
                {search ? "No departments match your search" : "No departments yet"}
              </p>
              <div className="w-8 h-px bg-amber-500/40" />
            </div>
          )}
        </div>

        {/* ── Right: detail or form ── */}
        <div className="xl:col-span-1">
          {showForm ? (
            <>
              <SectionHeading>New Department</SectionHeading>
              <CreateDepartmentForm
                allUsers={allUsers}
                allProfiles={allProfiles}
                onSuccess={handleSuccess}
              />
            </>
          ) : selected ? (
            <>
              <SectionHeading>Department Details</SectionHeading>
              <DepartmentDetail
                dept={selected}
                allUsers={allUsers}
                allProfiles={allProfiles}
                onClose={() => setSelected(null)}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-stone-200 gap-3">
              <IconBuilding />
              <p className="text-xs uppercase tracking-widest text-stone-300 font-coptic text-center">
                Select a department to view details<br />or create a new one
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DepartmentDashboard;