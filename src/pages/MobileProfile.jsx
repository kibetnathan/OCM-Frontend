import { useEffect } from "react";
import useProfileStore from "../zustand/profileStore";
import useAuthStore from "../zustand/authStore";
import useMainStore from "../zustand/mainStore";
import Sidebar from "../components/Sidebar";

const IconLogout = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

export default function ProfilePage() {
  const token   = useAuthStore((state) => state.token);
  const user    = useAuthStore((state) => state.user);
  const logout  = useAuthStore((state) => state.logout);

  const profile     = useProfileStore((state) => state.profile);
  const fellowships = useMainStore((state) => state.fellowships);

  useEffect(() => {
    if (token) useProfileStore.getState().fetchProfile();
  }, [token]);

  useEffect(() => {
    if (token) useMainStore.getState().fetchFellowships();
  }, [token]);

  const fellowship_group = fellowships?.results ?? (Array.isArray(fellowships) ? fellowships : []);
  const myGroups = fellowship_group?.filter((g) => g.members?.includes(user?.id));

  const fullName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : "Guest User";

  const profileFields = [
    { label: "Campus",    value: profile?.campus },
    { label: "School",    value: profile?.school },
    { label: "Workplace", value: profile?.workplace },
    { label: "Role",      value: user?.groups?.join(", ") },
  ];

  if (!profile)
    return (
      <div className="md:hidden flex h-screen w-full bg-[#0f0f0d] items-center justify-center">
        <Sidebar/>
        <p className="text-xs tracking-widest uppercase text-stone-600 animate-pulse">
          Loading…
        </p>
      </div>
    );

  return (
    <>
      <div className="md:hidden flex flex-col min-h-screen bg-[#0f0f0d] overflow-y-auto pb-20">
        <Sidebar/>
        {/* ── Profile Card ── */}
        <div className="flex flex-col items-center px-6 pt-14 pb-7 border-b border-white/6">

          {/* Church label */}
          <p className="font-coptic text-[0.55rem] tracking-[0.3em] uppercase text-stone-700 mb-6">
            Open Church Management
          </p>

          {/* Avatar */}
          <div className="relative mb-5">
            <img
              src={profile?.profile_pic_url || "/images/defaultavatar.jpg"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-500/30"
            />
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-amber-500 rounded-full ring-2 ring-[#0f0f0d]" />
          </div>

          {/* Name & username */}
          <h2 className="font-cormorant text-2xl font-semibold text-stone-100 tracking-wide text-center leading-tight">
            {fullName}
          </h2>
          <p className="font-coptic text-xs text-stone-500 tracking-widest mt-1">
            @{user?.username}
          </p>

          <div className="w-8 h-px bg-amber-500/40 my-4" />

          {/* Profile fields */}
          <ul className="w-full flex flex-col gap-2.5">
            {profileFields.map(({ label, value }) => (
              <li key={label} className="flex items-baseline justify-between gap-3">
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-stone-600 shrink-0">
                  {label}
                </span>
                <span className="text-xs text-stone-300 font-light text-right truncate">
                  {value || "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── My Groups ── */}
        <div className="flex flex-col px-6 py-6 border-b border-white/6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-600">
              My Groups
            </span>
            <div className="flex-1 h-px bg-white/6" />
            {myGroups?.length > 0 && (
              <span className="text-[0.6rem] text-amber-500 tabular-nums">
                {myGroups.length}
              </span>
            )}
          </div>

          <ul className="flex flex-col gap-1">
            {myGroups?.length > 0 ? (
              myGroups.map((group) => (
                <li
                  key={group.id}
                  className="font-coptic text-xs text-stone-400 px-3 py-2.5 border-l-2 border-transparent hover:border-amber-500/60 hover:text-stone-100 hover:bg-white/4 transition-all duration-150 cursor-default tracking-wide"
                >
                  {group.name}
                </li>
              ))
            ) : (
              <li className="text-[0.65rem] text-stone-600 tracking-widest uppercase py-2">
                No groups yet
              </li>
            )}
          </ul>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex flex-col mt-auto">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-6 py-4 text-left font-coptic text-[0.6rem] uppercase tracking-widest text-stone-600 hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            <IconLogout />
            Sign Out
          </button>
        </div>

      </div>
    </>
  );
}