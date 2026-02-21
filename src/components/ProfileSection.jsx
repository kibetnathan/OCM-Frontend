import React from "react";
import useProfileStore from "../zustand/profileStore";

function ProfileSection() {
  const profile = useProfileStore((state) => state.profile);

  return (
    <aside>
      <div className="card bg-base-100 w-96 shadow-sm">
        <img
          src={profile?.profile_picture || "/images/default-profile.jpg"}
          alt="Profile"
          className="object-cover h-48 w-full rounded-xl"
        />
        <div className="card-body items-center text-center">
          <h2 className="card-title">Card Title</h2>
          <p>
            A card component has a figure, a body part, and inside body there
            are title and actions parts
          </p>
          <div className="card-actions">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ProfileSection;
