import React from "react";
import useProfileStore from "../zustand/profileStore";
import useAuthStore from "../zustand/authStore";
import { useEffect } from "react";

function ProfileSection() {
    const token = useAuthStore.getState().token;
    useEffect(() => {
        if (token) useProfileStore.getState().fetchProfile();
    }, [token]);
    const profile = useProfileStore((state) => state.profile);
    
  const user = useAuthStore((state) => state.user);
  const fullName = user ? (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : "Guest User") : "Guest User";
  if (!profile) return <p>Loading profile...</p>;
  console.log("User data:", user);
  return (
    <aside className="fixed right-0 top-0 h-full min-w-74 bg-[#0f0f0d] border-l border-white/6">
      <div className="card w-70 p-10 h-[50vh] shadow-sm flex flex-col bg-ivory text-stone-900 items-center m-2">
        <img
          src={profile?.profile_pic || "/images/defaultavatar.jpg"}
          alt="Profile"
          className="object-cover h-25 w-25 rounded-full border-none p-0 shadow-[0px_0px_15px] shadow-khaki"
        />
        <div className="card-body items-center text-center">
          <h2 className="card-title font-cormorant text-2xl font-medium">{fullName}</h2>
          <h2 className="card-title font-coptic text-sm font-light text-stone-600">@{user.username}</h2>
          <span>
            Campus: {profile?.campus || "N/A"} <br />
            School: {profile?.school || "N/A"} <br />
            Workplace: {profile?.workplace || "N/A"} <br />
            Role: {user?.groups?.join(", ") || "N/A"}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default ProfileSection;
