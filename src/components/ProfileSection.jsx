import React, { useEffect, useState } from "react";
import useProfileStore from "../zustand/profileStore";
import useAuthStore from "../zustand/authStore";
import useMainStore from "../zustand/mainStore";
import EditProfileForm from "./EditProfileForm";

const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

function ProfileSection() {
  const token = useAuthStore((state) => state.token);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (token) useProfileStore.getState().fetchProfile();
  }, [token]);

  useEffect(() => {
    if (token) useMainStore.getState().fetchFellowships();
  }, [token]);

  const profile          = useProfileStore((state) => state.profile);
  const fellowships      = useMainStore((state) => state.fellowships);
  const user             = useAuthStore((state) => state.user);

  const fellowship_group = fellowships?.results ?? (Array.isArray(fellowships) ? fellowships : []);

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
    { label: "Campus",    value: profile?.campus },
    { label: "School",    value: profile?.school },
    { label: "Workplace", value: profile?.workplace },
    { label: "Role",      value: user?.groups?.join(", ") },
  ];

  const myGroups = fellowship_group?.filter((g) => g.members?.includes(user?.id));

  return (
    <>
      <aside className="sticky right-0 top-0 h-screen w-100 bg-[#0f0f0d] border-l border-white/6 flex flex-col overflow-y-auto">

        {/* ── Profile Card ── */}
        <div className="flex flex-col items-center px-6 pt-10 pb-7 border-b border-white/6">

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
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-left font-coptic text-[0.6rem] uppercase tracking-widest text-stone-600 hover:text-amber-400 hover:cursor-pointer hover:bg-white/5 transition-colors group"
        >
          <IconEdit />
          Edit Profile
        </button>

        <div className="px-6 py-4 border-t border-white/6">
          <p className="text-[0.55rem] tracking-[0.25em] uppercase text-stone-700">
            Open Church Management
          </p>
        </div>

      </aside>

      {/* Slide-in edit panel — outside aside so it overlays the full page */}
      <EditProfileForm open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}

export default ProfileSection;