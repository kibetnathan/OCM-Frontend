import React, { useEffect, useRef, useState } from "react";
import useMainStore from "../zustand/mainStore";
import useAuthStore from "../zustand/authStore";

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconHeart = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
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
const IconLink = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);
const IconPhoto = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

// ── Constants ─────────────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "paypal",        label: "PayPal" },
  { value: "stripe",        label: "Stripe" },
  { value: "mobile_money",  label: "Mobile Money" },
  { value: "cash",          label: "Cash" },
  { value: "other",         label: "Other" },
];

const PAYMENT_COLOURS = {
  bank_transfer: "bg-blue-50 border-blue-100 text-blue-600",
  paypal:        "bg-indigo-50 border-indigo-100 text-indigo-600",
  stripe:        "bg-purple-50 border-purple-100 text-purple-600",
  mobile_money:  "bg-green-50 border-green-100 text-green-600",
  cash:          "bg-amber-50 border-amber-100 text-amber-600",
  other:         "bg-stone-50 border-stone-200 text-stone-500",
};

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

function userName(u) {
  return u?.first_name && u?.last_name ? `${u.first_name} ${u.last_name}` : u?.username ?? "—";
}

function paymentLabel(value) {
  return PAYMENT_METHODS.find((m) => m.value === value)?.label ?? value;
}

// ── Member picker ─────────────────────────────────────────────────────────────

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
          const mp      = allProfiles.find((p) => p.user?.id === u.id);
          const checked = selected.includes(u.id);
          return (
            <div key={u.id} onClick={() => toggle(u.id)}
              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${checked ? "bg-amber-50" : "hover:bg-stone-50"}`}>
              <img src={mp?.profile_pic_url || "/images/defaultavatar.jpg"} alt={u.username} className="w-7 h-7 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-700 truncate">{userName(u)}</p>
                <p className="font-coptic text-[0.55rem] text-stone-400 truncate">@{u.username}</p>
              </div>
              <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
            </div>
          );
        }) : <p className="text-xs text-stone-300 px-3 py-4 text-center italic">No users found</p>}
      </div>
      {selected.length > 0 && (
        <p className="text-[0.6rem] text-stone-400 uppercase tracking-widest">
          {selected.length} member{selected.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}

// ── Charity Card ──────────────────────────────────────────────────────────────

function CharityCard({ org, allUsers, allProfiles, onSelect, isSelected }) {
  const memberList = allUsers.filter((u) => org.members?.includes(u.id));
  const pastor     = allUsers.find((u) => u.id === org.pastor);

  return (
    <div onClick={() => onSelect(org)}
      className={`flex flex-col bg-white border transition-all duration-200 cursor-pointer hover:border-amber-300 hover:shadow-md ${isSelected ? "border-amber-400 shadow-md" : "border-stone-100"}`}>
      {org.banner && (
        <div className="w-full h-28 overflow-hidden border-b border-stone-100">
          <img src={org.banner} alt={org.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-start justify-between p-5 border-b border-stone-100">
        <div className="flex-1 min-w-0">
          <h3 className="font-cormorant text-xl font-semibold text-stone-800 leading-tight truncate">{org.name}</h3>
          {org.description && <p className="text-xs text-stone-400 mt-1 line-clamp-2">{org.description}</p>}
        </div>
        <span className={`text-[0.55rem] uppercase tracking-widest border px-2 py-1 shrink-0 ml-3 ${PAYMENT_COLOURS[org.payment_method] ?? PAYMENT_COLOURS.other}`}>
          {paymentLabel(org.payment_method)}
        </span>
      </div>
      {pastor && (
        <div className="px-5 py-3 flex items-center gap-3 border-b border-stone-100">
          {(() => {
            const pp = allProfiles.find((p) => p.user?.id === pastor.id);
            return (
              <>
                <img src={pp?.profile_pic_url || "/images/defaultavatar.jpg"} alt={pastor.username}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/30" />
                <div>
                  <p className="text-[0.55rem] uppercase tracking-widest text-stone-400 font-coptic leading-none">Pastor</p>
                  <p className="text-xs text-stone-600">{userName(pastor)}</p>
                </div>
              </>
            );
          })()}
        </div>
      )}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {memberList.slice(0, 6).map((m) => {
            const mp = allProfiles.find((p) => p.user?.id === m.id);
            return <img key={m.id} src={mp?.profile_pic_url || "/images/defaultavatar.jpg"} alt={m.username}
              title={userName(m)} className="w-7 h-7 rounded-full object-cover ring-2 ring-white -ml-1.5 first:ml-0" />;
          })}
          {memberList.length > 6 && (
            <span className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[0.55rem] text-stone-500 -ml-1.5">
              +{memberList.length - 6}
            </span>
          )}
          {memberList.length === 0 && <p className="text-xs text-stone-300 italic">No members yet</p>}
        </div>
        {org.donation_link && (
          <span className="flex items-center gap-1 text-[0.55rem] uppercase tracking-widest text-amber-600">
            <IconLink /> Donate
          </span>
        )}
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function CharityDetail({ org, allUsers, allProfiles, onClose, onEdit, onDelete }) {
  const memberList    = allUsers.filter((u) => org.members?.includes(u.id));
  const pastor        = allUsers.find((u) => u.id === org.pastor);
  const pastorProfile = allProfiles.find((p) => p.user?.id === org.pastor);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="relative overflow-hidden bg-khaki/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-5">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {org.banner && (
        <div className="w-full h-32 overflow-hidden rounded-sm -mx-0 -mt-0 border border-white/10">
          <img src={org.banner} alt={org.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[0.8rem] uppercase tracking-[0.25em] text-stone-700 mb-1">Charity Organisation</p>
          <h3 className="font-cormorant text-2xl font-semibold text-light leading-tight truncate">{org.name}</h3>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 ml-2">
          <button onClick={onEdit} title="Edit" className="p-1.5 text-stone-700 hover:text-amber-400 transition-colors">
            <IconEdit />
          </button>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} title="Delete" className="p-1.5 text-stone-700 hover:text-red-400 transition-colors">
              <IconTrash />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-1 ml-1">
              <span className="font-coptic text-[0.55rem] text-red-400 uppercase tracking-widest">Delete?</span>
              <button onClick={() => onDelete(org.id)} className="p-0.5 text-red-400 hover:text-red-300"><IconCheck /></button>
              <button onClick={() => setConfirmDelete(false)} className="p-0.5 text-stone-700 hover:text-stone-300"><IconX /></button>
            </div>
          )}
          <button onClick={onClose} className="p-1.5 text-stone-600 hover:text-stone-300 transition-colors ml-0.5">
            <IconX />
          </button>
        </div>
      </div>

      {org.description && (
        <p className="text-sm text-stone-100 leading-relaxed relative z-10 border-l-2 border-amber-500/35 pl-3">{org.description}</p>
      )}

      <div className="relative z-10 flex flex-wrap gap-3">
        <div>
          <p className="text-[0.6rem] uppercase tracking-widest text-stone-700 font-coptic mb-1">Payment Method</p>
          <span className={`text-[0.6rem] uppercase tracking-widest border px-2 py-1 ${PAYMENT_COLOURS[org.payment_method] ?? PAYMENT_COLOURS.other}`}>
            {paymentLabel(org.payment_method)}
          </span>
        </div>
        {org.donation_link && (
          <div>
            <p className="text-[0.6rem] uppercase tracking-widest text-stone-700 font-coptic mb-1">Donation Link</p>
            <a href={org.donation_link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[0.65rem] text-amber-400 hover:text-amber-300 transition-colors">
              <IconLink /> Open link
            </a>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-700 font-coptic mb-2">Pastor</p>
        <div className="flex items-center gap-3">
          <img src={pastorProfile?.profile_pic_url || "/images/defaultavatar.jpg"} alt={pastor?.username || "Pastor"}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/30" />
          <div>
            <p className="text-sm font-cormorant font-semibold text-light">{pastor ? userName(pastor) : "No pastor assigned"}</p>
            {pastor && <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-700">@{pastor.username}</p>}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-700 font-coptic mb-2">Members ({memberList.length})</p>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {memberList.length > 0 ? memberList.map((m) => {
            const mp = allProfiles.find((p) => p.user?.id === m.id);
            return (
              <div key={m.id} className="flex items-center gap-3">
                <img src={mp?.profile_pic_url || "/images/defaultavatar.jpg"} alt={m.username} className="w-7 h-7 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-stone-100 truncate">{userName(m)}</p>
                  <p className="font-coptic text-[0.55rem] text-stone-600 truncate">@{m.username}</p>
                </div>
              </div>
            );
          }) : <p className="text-xs text-stone-600 italic">No members yet</p>}
        </div>
      </div>
    </div>
  );
}

// ── Shared form fields ────────────────────────────────────────────────────────

function CharityFields({
  name, setName, description, setDescription,
  paymentMethod, setPaymentMethod, donationLink, setDonationLink,
  pastorId, setPastorId, allUsers, allProfiles,
  selectedMembers, setSelectedMembers,
  bannerFile, setBannerFile, existingBanner,
}) {
  const fileInputRef = useRef(null);

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Organisation Name *</InputLabel>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hope Community Fund" required
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Description *</InputLabel>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this organisation do?"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors resize-none min-h-16 w-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Banner Image <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        {existingBanner && !bannerFile && (
          <div className="w-full h-20 border border-stone-200 overflow-hidden mb-1">
            <img src={existingBanner} alt="Current banner" className="w-full h-full object-cover" />
          </div>
        )}
        {bannerFile && (
          <div className="w-full h-20 border border-stone-200 overflow-hidden mb-1">
            <img src={URL.createObjectURL(bannerFile)} alt="New banner" className="w-full h-full object-cover" />
          </div>
        )}
        <button type="button" onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 border border-dashed border-stone-300 hover:border-amber-400 text-stone-400 hover:text-amber-500 text-xs px-3 py-2.5 transition-colors w-full justify-center">
          <IconPhoto />
          {bannerFile ? bannerFile.name : existingBanner ? "Replace banner" : "Upload banner"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} />
        {bannerFile && (
          <button type="button" onClick={() => setBannerFile(null)}
            className="text-[0.6rem] uppercase tracking-widest text-stone-400 hover:text-red-400 transition-colors text-left">
            Remove selection
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Payment Method</InputLabel>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors w-full">
          {PAYMENT_METHODS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Donation Link <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <input type="url" value={donationLink} onChange={(e) => setDonationLink(e.target.value)} placeholder="https://…"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Pastor <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <select value={pastorId} onChange={(e) => setPastorId(e.target.value)}
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors w-full">
          <option value="">No pastor</option>
          {allUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.first_name && u.last_name ? `${u.first_name} ${u.last_name} (@${u.username})` : `@${u.username}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <InputLabel>Members <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <MemberPicker allUsers={allUsers} allProfiles={allProfiles} selected={selectedMembers} onChange={setSelectedMembers} />
      </div>
    </>
  );
}

// ── Build payload (FormData if banner, else plain object) ─────────────────────

function buildPayload({ name, description, paymentMethod, donationLink, pastorId, selectedMembers, bannerFile }) {
  if (bannerFile) {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("description", description);
    fd.append("payment_method", paymentMethod);
    if (donationLink) fd.append("donation_link", donationLink);
    if (pastorId) fd.append("pastor", pastorId);
    selectedMembers.forEach((id) => fd.append("members", id));
    fd.append("banner", bannerFile);
    return fd;
  }
  return {
    name,
    description,
    payment_method: paymentMethod,
    donation_link:  donationLink || null,
    pastor:         pastorId ? Number(pastorId) : null,
    members:        selectedMembers,
  };
}

// ── Create Form ───────────────────────────────────────────────────────────────

function CreateCharityForm({ allUsers, allProfiles, onSuccess }) {
  const createCharityOrganisation = useMainStore((s) => s.createCharityOrganisation);

  const [name,            setName]            = useState("");
  const [description,     setDescription]     = useState("");
  const [paymentMethod,   setPaymentMethod]   = useState("bank_transfer");
  const [donationLink,    setDonationLink]    = useState("");
  const [pastorId,        setPastorId]        = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [bannerFile,      setBannerFile]      = useState(null);
  const [submitting,      setSubmitting]      = useState(false);
  const [error,           setError]           = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Organisation name is required.");
    if (!description.trim()) return setError("Description is required.");
    setSubmitting(true);
    const payload = buildPayload({ name, description, paymentMethod, donationLink, pastorId, selectedMembers, bannerFile });
    const result = await createCharityOrganisation(payload);
    setSubmitting(false);
    if (result?.success) {
      setName(""); setDescription(""); setPaymentMethod("bank_transfer");
      setDonationLink(""); setPastorId(""); setSelectedMembers([]); setBannerFile(null);
      onSuccess?.();
    } else {
      setError("Failed to create organisation. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <CharityFields {...{ name, setName, description, setDescription, paymentMethod, setPaymentMethod, donationLink, setDonationLink, pastorId, setPastorId, allUsers, allProfiles, selectedMembers, setSelectedMembers, bannerFile, setBannerFile, existingBanner: null }} />
      {error && <p className="text-[0.6rem] uppercase tracking-widest text-red-400">{error}</p>}
      <button type="submit" disabled={submitting}
        className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2">
        {submitting ? <span className="animate-pulse">Creating…</span> : <><IconPlus /><span>Create Organisation</span></>}
      </button>
    </form>
  );
}

// ── Edit Form ─────────────────────────────────────────────────────────────────

function EditCharityForm({ org, allUsers, allProfiles, onSuccess, onCancel }) {
  const updateCharityOrganisation = useMainStore((s) => s.updateCharityOrganisation);

  const [name,            setName]            = useState(org.name            || "");
  const [description,     setDescription]     = useState(org.description     || "");
  const [paymentMethod,   setPaymentMethod]   = useState(org.payment_method  || "bank_transfer");
  const [donationLink,    setDonationLink]    = useState(org.donation_link   || "");
  const [pastorId,        setPastorId]        = useState(org.pastor          ? String(org.pastor) : "");
  const [selectedMembers, setSelectedMembers] = useState(org.members         || []);
  const [bannerFile,      setBannerFile]      = useState(null);
  const [submitting,      setSubmitting]      = useState(false);
  const [error,           setError]           = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Organisation name is required.");
    if (!description.trim()) return setError("Description is required.");
    setSubmitting(true);
    const payload = buildPayload({ name, description, paymentMethod, donationLink, pastorId, selectedMembers, bannerFile });
    const result = await updateCharityOrganisation(org.id, payload);
    setSubmitting(false);
    if (result?.success) onSuccess?.(result.org);
    else setError("Failed to update organisation. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <CharityFields {...{ name, setName, description, setDescription, paymentMethod, setPaymentMethod, donationLink, setDonationLink, pastorId, setPastorId, allUsers, allProfiles, selectedMembers, setSelectedMembers, bannerFile, setBannerFile, existingBanner: org.banner }} />
      {error && <p className="text-[0.6rem] uppercase tracking-widest text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={submitting}
          className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2">
          {submitting ? <span className="animate-pulse">Saving…</span> : <><IconCheck /><span>Save Changes</span></>}
        </button>
        <button type="button" onClick={onCancel}
          className="border border-stone-200 text-stone-700 hover:border-stone-400 font-coptic text-[0.65rem] uppercase tracking-widest px-4 py-3 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function CharityOrganisationDashboard() {
  const token = useAuthStore((s) => s.token);

  const charity_organisations      = useMainStore((s) => s.charity_organisations);
  const allUsers                   = useMainStore((s) => s.users)    || [];
  const allProfiles                = useMainStore((s) => s.profiles) || [];
  const fetchCharityOrganisations  = useMainStore((s) => s.fetchCharityOrganisations);
  const fetchUsers                 = useMainStore((s) => s.fetchUsers);
  const fetchProfiles              = useMainStore((s) => s.fetchProfiles);
  const deleteCharityOrganisation  = useMainStore((s) => s.deleteCharityOrganisation);

  const orgList = charity_organisations?.results ?? (Array.isArray(charity_organisations) ? charity_organisations : []);

  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null);
  const [mode,       setMode]       = useState("idle"); // "idle" | "create" | "edit"
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchCharityOrganisations();
    fetchUsers();
    fetchProfiles();
  }, [token, fetchCharityOrganisations, fetchUsers, fetchProfiles]);

  const filtered     = orgList.filter((o) => o.name?.toLowerCase().includes(search.toLowerCase()));
  const totalMembers = orgList.reduce((acc, o) => acc + (o.members?.length ?? 0), 0);
  const withPastors  = orgList.filter((o) => o.pastor).length;

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 3000); };

  const handleDelete = async (id) => {
    const result = await deleteCharityOrganisation(id);
    if (result?.success) { setSelected(null); setMode("idle"); showSuccess("Organisation deleted."); }
  };

  const handleEditSuccess = (updatedOrg) => {
    setSelected(updatedOrg);
    setMode("idle");
    showSuccess("Organisation updated successfully ✓");
  };

  const rightTitle = mode === "create" ? "New Organisation" : mode === "edit" ? "Edit Organisation" : "Organisation Details";

  return (
    <div className="min-h-screen w-full bg-[#faf8f3] p-8">

      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-1">Outreach</p>
          <h1 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">Charity Organisations</h1>
          <div className="w-8 h-0.5 bg-amber-500 mt-3" />
        </div>
        <button onClick={() => { setMode(mode === "create" ? "idle" : "create"); setSelected(null); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-coptic text-[0.65rem] uppercase tracking-widest px-4 py-3 transition-colors">
          <IconPlus />
          {mode === "create" ? "Cancel" : "New Organisation"}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-coptic text-xs uppercase tracking-widest">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2 flex flex-col gap-5">
          <div className="flex items-center gap-6 pb-5 border-b border-stone-200 flex-wrap">
            {[
              { label: "Organisations",  value: charity_organisations?.count ?? orgList.length },
              { label: "Total Members",  value: totalMembers },
              { label: "With Pastors",   value: withPastors },
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

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"><IconSearch /></span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search organisations…"
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((org) => (
                <CharityCard key={org.id} org={org} allUsers={allUsers} allProfiles={allProfiles}
                  onSelect={(o) => { setSelected(o); setMode("idle"); }}
                  isSelected={selected?.id === org.id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 gap-3">
              <div className="w-8 h-px bg-amber-500/40" />
              <p className="text-xs uppercase tracking-[0.25em] text-stone-300">
                {search ? "No organisations match your search" : "No organisations yet"}
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
                <CreateCharityForm allUsers={allUsers} allProfiles={allProfiles}
                  onSuccess={() => { setMode("idle"); showSuccess("Organisation created successfully ✓"); }} />
              )}
              {mode === "edit" && selected && (
                <EditCharityForm org={selected} allUsers={allUsers} allProfiles={allProfiles}
                  onSuccess={handleEditSuccess} onCancel={() => setMode("idle")} />
              )}
              {mode === "idle" && selected && (
                <CharityDetail org={selected} allUsers={allUsers} allProfiles={allProfiles}
                  onClose={() => setSelected(null)}
                  onEdit={() => setMode("edit")}
                  onDelete={handleDelete} />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-stone-200 gap-3">
              <IconHeart />
              <p className="text-xs uppercase tracking-widest text-stone-300 font-coptic text-center">
                Select an organisation to view details<br />or create a new one
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CharityOrganisationDashboard;
