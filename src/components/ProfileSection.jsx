import React, { useEffect } from "react";
import useProfileStore from "../zustand/profileStore";
import useAuthStore from "../zustand/authStore";
import useMainStore from "../zustand/mainStore";

function ProfileSection() {
  const token = useAuthStore.getState().token;

  useEffect(() => {
    if (token) useProfileStore.getState().fetchProfile();
  }, [token]);

  useEffect(() => {
    if (token) useMainStore.getState().fetchFellowships();
  }, [token]);

  const profile = useProfileStore((state) => state.profile);
  const fellowship_group = useMainStore((state) => state.fellowships.results);
  const user = useAuthStore((state) => state.user);

  const fullName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : "Guest User";

  if (!profile)
    return (
      <aside className="sticky right-0 top-0 h-screen w-100 bg-[#0f0f0d] border-l border-white/6 flex items-center justify-center">
        <p className="text-xs tracking-widest uppercase text-stone-600 animate-pulse">
          Loading…
        </p>
      </aside>
    );

  const profileFields = [
    { label: "Campus", value: profile?.campus },
    { label: "School", value: profile?.school },
    { label: "Workplace", value: profile?.workplace },
    { label: "Role", value: user?.groups?.join(", ") },
  ];

  const myGroups = fellowship_group?.filter((g) =>
    g.members?.includes(user?.id)
  );

  return (
    <aside className="sticky right-0 top-0 h-screen w-100 bg-[#0f0f0d] border-l border-white/6 flex flex-col overflow-y-auto">

      {/* ── Profile Card ── */}
      <div className="flex flex-col items-center px-6 pt-10 pb-7 border-b border-white/6">

        {/* Avatar */}
        <div className="relative mb-5">
          <img
            src={profile?.profile_pic || "/images/defaultavatar.jpg"}
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

        {/* Divider */}
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
      <div className="flex flex-col flex-1 px-6 py-6">
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

      {/* ── Footer ── */}
      <div className="px-6 py-4 border-t border-white/6">
        <p className="text-[0.55rem] tracking-[0.25em] uppercase text-stone-700">
          Open Church Management
        </p>
      </div>

    </aside>
  );
}

export default ProfileSection;