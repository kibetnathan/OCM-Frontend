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

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="font-cormorant text-2xl font-semibold text-stone-800 shrink-0">{children}</h2>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
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
        src={userProfile?.profile_pic || "/images/defaultavatar.jpg"}
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

function UserDetail({ user, allProfiles, allUsers, onClose }) {
  const userProfile  = allProfiles.find((p) => p.user?.id === user.id);

  // Groups the user shares with other members (fellowship, courses etc.)
  // We show their auth groups as roles here
  const roles = user.groups ?? [];

  return (
    <div className="relative overflow-hidden bg-[#0f0f0d]/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-5">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Close */}
      <div className="flex items-start justify-between relative z-10">
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 font-coptic">Member</p>
        <button onClick={onClose} className="text-stone-600 hover:text-stone-300 transition-colors p-1">
          <IconX />
        </button>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 relative z-10">
        <img
          src={userProfile?.profile_pic || "/images/defaultavatar.jpg"}
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

        {/* Role badges */}
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

      {/* Divider */}
      <div className="h-px bg-white/[0.07] relative z-10" />

      {/* Contact info */}
      <div className="flex flex-col gap-3 relative z-10">
        <p className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">Contact</p>
        <DetailRow icon={<IconMail />}  label="Email"  value={user.email} />
        <DetailRow icon={<IconPhone />} label="Phone"  value={userProfile?.phone_number} />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.07] relative z-10" />

      {/* Personal info */}
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

// ── Main component ────────────────────────────────────────────────────────────

function UsersDashboard() {
  const token = useAuthStore((state) => state.token);

  const allUsers    = useMainStore((state) => state.users)    || [];
  const allProfiles = useMainStore((state) => state.profiles) || [];

  const fetchUsers    = useMainStore((state) => state.fetchUsers);
  const fetchProfiles = useMainStore((state) => state.fetchProfiles);

  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [groupFilter, setGroupFilter] = useState("all");

  useEffect(() => {
    if (!token) return;
    fetchProfiles();
    fetchUsers();
  }, [token, fetchProfiles, fetchUsers]);

  // Collect all unique group names for the filter
  const allGroups = [...new Set(allUsers.flatMap((u) => u.groups ?? []))].sort();

  const filtered = allUsers.filter((u) => {
    const matchSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(search.toLowerCase());
    const matchGroup =
      groupFilter === "all" || u.groups?.includes(groupFilter);
    return matchSearch && matchGroup;
  });

  return (
    <div className="min-h-screen w-full bg-[#faf8f3] p-8">

      {/* ── Header ── */}
      <div className="mb-10">
        <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-1">Members</p>
        <h1 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">Congregants</h1>
        <div className="w-8 h-0.5 bg-amber-500 mt-3" />
      </div>

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
                  onSelect={(u) => setSelected(u)}
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

        {/* ── Right: detail ── */}
        <div className="xl:col-span-1">
          {selected ? (
            <>
              <SectionHeading>Member Details</SectionHeading>
              <UserDetail
                user={selected}
                allProfiles={allProfiles}
                allUsers={allUsers}
                onClose={() => setSelected(null)}
              />
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