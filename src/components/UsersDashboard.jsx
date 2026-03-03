import React, { useEffect, useState } from "react";
import useMainStore from "../zustand/mainStore";
import useAuthStore from "../zustand/authStore";

// ── Icons ─────────────────────────────────────────────────────────────────────

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

const IconMail = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconPhone = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const IconBuilding = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
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

function DetailRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="text-stone-500 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-500 leading-none mb-0.5">{label}</p>
        <p className="text-sm text-stone-300 truncate">{value}</p>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ── User Card ─────────────────────────────────────────────────────────────────

function UserCard({ isSelected, onSelect, user, allProfiles }) {
  const userProfile = allProfiles.find((p) => p.user?.id === user.id);
  return (
    <div
      onClick={() => onSelect(user)}
      className={`flex flex-row gap-4 p-3 items-center bg-white border transition-all duration-200 cursor-pointer hover:border-amber-300 hover:shadow-sm ${
        isSelected ? "border-amber-400 shadow-sm" : "border-transparent"
      }`}
    >
      <span className="font-cormorant text-2xl font-light text-stone-300 leading-none w-6 shrink-0 text-right">
        {user.id}
      </span>
      <img
        src={userProfile?.profile_pic_url || "/images/defaultavatar.jpg"}
        alt={user.username}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/30 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-cormorant text-lg font-semibold text-stone-800 leading-tight truncate">
          {user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.username}
        </p>
        <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-400 truncate">
          @{user.username}
        </p>
      </div>
      {user.groups?.length > 0 && (
        <span className="text-[0.55rem] uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 shrink-0 hidden sm:block">
          {user.groups[0]}
        </span>
      )}
    </div>
  );
}

// ── User Detail ───────────────────────────────────────────────────────────────

function UserDetail({ user, allProfiles, onClose, onEdit, onDelete }) {
  const userProfile = allProfiles.find((p) => p.user?.id === user.id);
  const roles = user.groups ?? [];
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="relative overflow-hidden bg-[#0f0f0d]/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-5">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Action buttons */}
      <div className="relative z-10 flex items-center justify-end gap-0.5">
        <button onClick={onEdit} title="Edit" className="p-1.5 text-stone-500 hover:text-amber-400 transition-colors">
          <IconEdit />
        </button>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} title="Delete" className="p-1.5 text-stone-500 hover:text-red-400 transition-colors">
            <IconTrash />
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-1 ml-1">
            <span className="font-coptic text-[0.55rem] text-red-400 uppercase tracking-widest">Delete?</span>
            <button onClick={() => onDelete(user.id)} className="p-0.5 text-red-400 hover:text-red-300"><IconCheck /></button>
            <button onClick={() => setConfirmDelete(false)} className="p-0.5 text-stone-500 hover:text-stone-300"><IconX /></button>
          </div>
        )}
        <button onClick={onClose} className="p-1.5 text-stone-600 hover:text-stone-300 transition-colors ml-0.5">
          <IconX />
        </button>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 relative z-10">
        <img
          src={userProfile?.profile_pic_url || "/images/defaultavatar.jpg"}
          alt={user.username}
          className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-500/30"
        />
        <div className="text-center">
          <h3 className="font-cormorant text-2xl font-semibold text-stone-100 leading-tight">
            {user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`
              : user.username}
          </h3>
          <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-500 mt-0.5">
            @{user.username}
          </p>
        </div>

        {roles.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {roles.map((role) => (
              <span
                key={role}
                className="text-[0.55rem] uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5"
              >
                {role}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-white/[0.07] relative z-10" />

      <div className="flex flex-col gap-3 relative z-10">
        <p className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">Contact</p>
        <DetailRow icon={<IconMail />}  label="Email" value={user.email} />
        <DetailRow icon={<IconPhone />} label="Phone" value={userProfile?.phone_number} />
      </div>

      <div className="h-px bg-white/[0.07] relative z-10" />

      <div className="flex flex-col gap-3 relative z-10">
        <p className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">Personal</p>
        <DetailRow icon={<IconCalendar />} label="Date of Birth" value={formatDate(userProfile?.DoB)} />
        <DetailRow icon={<IconBuilding />} label="Campus"        value={userProfile?.campus} />
        <DetailRow icon={<IconBuilding />} label="School"        value={userProfile?.school} />
        <DetailRow icon={<IconBuilding />} label="Workplace"     value={userProfile?.workplace} />
      </div>
    </div>
  );
}

// ── Edit User Form ────────────────────────────────────────────────────────────

function EditUserForm({ user, allProfiles, onSuccess, onCancel }) {
  const updateUser    = useMainStore((state) => state.updateUser);
  const updateProfile = useMainStore((state) => state.updateProfile);
  const allGroups     = useMainStore((state) => state.groups) || [];
  const fetchGroups   = useMainStore((state) => state.fetchGroups);

  const userProfile = allProfiles.find((p) => p.user?.id === user.id);

  // User fields
  const [firstName,     setFirstName]     = useState(user.first_name || "");
  const [lastName,      setLastName]      = useState(user.last_name  || "");
  const [email,         setEmail]         = useState(user.email      || "");
  const [username,      setUsername]      = useState(user.username   || "");
  const [selectedGroups, setSelectedGroups] = useState(user.groups   || []);

  // Profile fields
  const [phone,      setPhone]      = useState(userProfile?.phone_number || "");
  const [dob,        setDob]        = useState(userProfile?.DoB          || "");
  const [campus,     setCampus]     = useState(userProfile?.campus       || "");
  const [school,     setSchool]     = useState(userProfile?.school       || "");
  const [workplace,  setWorkplace]  = useState(userProfile?.workplace    || "");

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const toggleGroup = (name) =>
    setSelectedGroups((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) return setError("Username is required.");

    setSubmitting(true);

    // PATCH user (includes groups)
    const userResult = await updateUser(user.id, {
      first_name: firstName,
      last_name:  lastName,
      email,
      username,
      groups: selectedGroups,
    });

    if (!userResult?.success) {
      setSubmitting(false);
      return setError("Failed to update user. Please try again.");
    }

    // PATCH profile if one exists
    if (userProfile?.id) {
      const profileResult = await updateProfile(userProfile.id, {
        user_id:      user.id,
        phone_number: phone,
        DoB:          dob || null,
        campus,
        school,
        workplace,
      });

      if (!profileResult?.success) {
        setSubmitting(false);
        return setError("User saved but profile update failed.");
      }
    }

    setSubmitting(false);
    onSuccess?.(userResult.item);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* User fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <InputLabel>First Name</InputLabel>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name"
            className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <InputLabel>Last Name</InputLabel>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name"
            className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Username *</InputLabel>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" required
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Email</InputLabel>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Roles / Groups</InputLabel>
        {/* Selected badges */}
        {selectedGroups.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedGroups.map((g) => (
              <span key={g} className="flex items-center gap-1 text-[0.65rem] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1">
                {g}
                <button type="button" onClick={() => toggleGroup(g)} className="hover:text-amber-900"><IconX /></button>
              </span>
            ))}
          </div>
        )}
        {/* Available groups list */}
        <div className="border border-stone-200 divide-y divide-stone-100 max-h-36 overflow-y-auto">
          {allGroups.length > 0 ? allGroups.map((g) => {
            const name    = g.name ?? g; // handle {id, name} objects or plain strings
            const checked = selectedGroups.includes(name);
            return (
              <div key={name} onClick={() => toggleGroup(name)}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-sm ${checked ? "bg-amber-50 text-amber-800" : "text-stone-700 hover:bg-stone-50"}`}>
                <span>{name}</span>
                <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                  {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                </div>
              </div>
            );
          }) : (
            <p className="text-xs text-stone-300 px-3 py-4 text-center italic">No groups available</p>
          )}
        </div>
        {selectedGroups.length === 0 && (
          <p className="text-[0.6rem] text-stone-400 uppercase tracking-widest">No roles assigned</p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-100" />

      {/* Profile fields */}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Phone Number</InputLabel>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 700 000 000"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Date of Birth</InputLabel>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors w-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Campus</InputLabel>
        <input type="text" value={campus} onChange={(e) => setCampus(e.target.value)} placeholder="Campus name"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>School</InputLabel>
        <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School / University"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Workplace</InputLabel>
        <input type="text" value={workplace} onChange={(e) => setWorkplace(e.target.value)} placeholder="Company / Organisation"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
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

function UsersDashboard() {
  const token = useAuthStore((state) => state.token);

  const allUsers    = useMainStore((state) => state.users)    || [];
  const allProfiles = useMainStore((state) => state.profiles) || [];

  const fetchUsers    = useMainStore((state) => state.fetchUsers);
  const fetchProfiles = useMainStore((state) => state.fetchProfiles);
  const deleteUser    = useMainStore((state) => state.deleteUser);

  const [search,      setSearch]      = useState("");
  const [selected,    setSelected]    = useState(null);
  const [groupFilter, setGroupFilter] = useState("all");
  const [mode,        setMode]        = useState("idle"); // "idle" | "edit"
  const [successMsg,  setSuccessMsg]  = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchProfiles();
    fetchUsers();
  }, [token, fetchProfiles, fetchUsers]);

  const allGroups = [...new Set(allUsers.flatMap((u) => u.groups ?? []))].sort();

  const filtered = allUsers.filter((u) => {
    const matchSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(search.toLowerCase());
    const matchGroup = groupFilter === "all" || u.groups?.includes(groupFilter);
    return matchSearch && matchGroup;
  });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDelete = async (id) => {
    const result = await deleteUser(id);
    if (result?.success) {
      setSelected(null);
      setMode("idle");
      showSuccess("Member deleted.");
    }
  };

  const handleEditSuccess = (updatedUser) => {
    setSelected(updatedUser);
    setMode("idle");
    showSuccess("Member updated successfully ✓");
  };

  const rightTitle = mode === "edit" ? "Edit Member" : "Member Details";

  return (
    <div className="min-h-screen w-full bg-[#faf8f3] p-8">

      {/* ── Header ── */}
      <div className="mb-10">
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-1">Members</p>
        <h1 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">Congregants</h1>
        <div className="w-8 h-0.5 bg-amber-500 mt-3" />
      </div>

      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-coptic text-xs uppercase tracking-widest">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ── Left: list ── */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* Stats */}
          <div className="flex items-center gap-6 pb-5 border-b border-stone-200 flex-wrap">
            <div>
              <p className="font-cormorant text-3xl font-light text-stone-800">{allUsers.length}</p>
              <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Total Members</p>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <p className="font-cormorant text-3xl font-light text-stone-800">{filtered.length}</p>
              <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Showing</p>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <p className="font-cormorant text-3xl font-light text-stone-800">{allGroups.length}</p>
              <p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Roles</p>
            </div>
          </div>

          {/* Search + group filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300">
                <IconSearch />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or username…"
                className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full"
              />
            </div>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors shrink-0"
            >
              <option value="all">All Roles</option>
              {allGroups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* User list */}
          {filtered.length > 0 ? (
            <div className="flex flex-col divide-y divide-stone-100 border border-stone-100 bg-white">
              {filtered.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  allProfiles={allProfiles}
                  onSelect={(u) => { setSelected(u); setMode("idle"); }}
                  isSelected={selected?.id === user.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 gap-3">
              <div className="w-8 h-px bg-amber-500/40" />
              <p className="text-xs uppercase tracking-[0.25em] text-stone-300">
                {search || groupFilter !== "all" ? "No members match your filters" : "No members yet"}
              </p>
              <div className="w-8 h-px bg-amber-500/40" />
            </div>
          )}
        </div>

        {/* ── Right: detail / edit ── */}
        <div className="xl:col-span-1">
          {selected ? (
            <>
              <SectionHeading>{rightTitle}</SectionHeading>
              {mode === "edit" ? (
                <EditUserForm
                  user={selected}
                  allProfiles={allProfiles}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setMode("idle")}
                />
              ) : (
                <UserDetail
                  user={selected}
                  allProfiles={allProfiles}
                  onClose={() => { setSelected(null); setMode("idle"); }}
                  onEdit={() => setMode("edit")}
                  onDelete={handleDelete}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-stone-200 gap-3">
              <p className="text-xs uppercase tracking-widest text-stone-300 font-coptic text-center">
                Select a member<br />to view their details
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default UsersDashboard;