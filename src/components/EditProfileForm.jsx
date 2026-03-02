import React, { useState, useRef } from "react";
import useProfileStore from "../zustand/profileStore";
import useAuthStore from "../zustand/authStore";

const IconX = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconCamera = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

function InputLabel({ children }) {
  return (
    <label className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500">
      {children}
    </label>
  );
}

// ── Inner form ────────────────────────────────────────────────────────────────
// Receives profile as props and initialises state directly — no useEffect.
// The outer shell gives this a new key every time the panel opens, so it
// remounts fresh with clean state rather than trying to reset via effects.

function ProfileFormInner({ profile, user, updateProfile, onClose }) {
  const [fields, setFields] = useState({
    campus:      profile?.campus       || "",
    school:      profile?.school       || "",
    workplace:   profile?.workplace    || "",
    phoneNumber: profile?.phone_number || "",
    DoB:         profile?.DoB          || "",
  });

  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [error,        setError]        = useState(null);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    // Clear input value so picking the same file again still fires onChange
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.append("campus",       fields.campus);
    formData.append("school",       fields.school);
    formData.append("workplace",    fields.workplace);
    formData.append("phone_number", fields.phoneNumber);
    if (fields.DoB) formData.append("DoB", fields.DoB);
    if (imageFile)  formData.append("profile_pic", imageFile);

    const result = await updateProfile(formData);
    setSubmitting(false);

    if (result?.success) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 1200);
    } else {
      setError("Failed to update profile. Please try again.");
    }
  };

  const avatarSrc = imagePreview || profile?.profile_pic_url || "/images/defaultavatar.jpg";

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-[#0f0f0d] border-l border-white/10 z-50 flex flex-col overflow-y-auto shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] shrink-0">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 font-coptic">Account</p>
          <h2 className="font-cormorant text-xl font-semibold text-stone-100 leading-tight">Edit Profile</h2>
        </div>
        <button onClick={onClose} className="text-stone-600 hover:text-stone-300 transition-colors p-1">
          <IconX />
        </button>
      </div>

      {/* Avatar picker */}
      <div className="flex flex-col items-center px-6 py-6 border-b border-white/[0.07] shrink-0">
        <div className="relative group">
          <img
            src={avatarSrc}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-500/30"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <IconCamera />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 font-coptic text-[0.6rem] uppercase tracking-widest text-stone-500 hover:text-amber-400 transition-colors"
        >
          Change Photo
        </button>
        {imageFile && (
          <p className="mt-1 font-coptic text-[0.55rem] uppercase tracking-widest text-amber-500 text-center truncate w-full px-2">
            {imageFile.name}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6 flex-1">

        {/* Read-only */}
        <div className="flex flex-col gap-1.5">
          <InputLabel>Username</InputLabel>
          <p className="px-3 py-2.5 text-sm text-stone-500 bg-white/[0.03] border border-white/[0.06]">
            @{user?.username}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <InputLabel>Email</InputLabel>
          <p className="px-3 py-2.5 text-sm text-stone-500 bg-white/[0.03] border border-white/[0.06]">
            {user?.email || "—"}
          </p>
        </div>

        <div className="h-px bg-white/[0.07]" />

        {/* Editable */}
        {[
          { key: "campus",      label: "Campus",         type: "text", placeholder: "e.g. Hill City" },
          { key: "phoneNumber", label: "Phone Number",   type: "tel",  placeholder: "+254 700 000 000" },
          { key: "DoB",         label: "Date of Birth",  type: "date", placeholder: "" },
          { key: "school",      label: "School",         type: "text", placeholder: "Your school or university" },
          { key: "workplace",   label: "Workplace",      type: "text", placeholder: "Where do you work?" },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <InputLabel>{label}</InputLabel>
            <input
              type={type}
              value={fields[key]}
              onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="bg-white/5 border border-white/10 focus:border-amber-400/60 focus:outline-none px-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 transition-colors"
            />
          </div>
        ))}

        {error && (
          <p className="text-[0.6rem] uppercase tracking-widest text-red-400 font-coptic">{error}</p>
        )}

        <button
          type="submit" disabled={submitting}
          className="mt-auto bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center"
        >
          {submitting ? <span className="animate-pulse">Saving…</span> : success ? "Saved ✓" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

// ── Outer shell ───────────────────────────────────────────────────────────────
// Reads from stores and only mounts the inner form when open is true.
// The key prop on ProfileFormInner guarantees a fresh remount on each open.

function EditProfileForm({ open, onClose }) {
  const profile       = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const user          = useAuthStore((state) => state.user);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <ProfileFormInner
        key="edit-profile-form"
        profile={profile}
        user={user}
        updateProfile={updateProfile}
        onClose={onClose}
      />
    </>
  );
}

export default EditProfileForm;