import React, { useEffect, useState } from "react";
import useMainStore from "../zustand/mainStore";
import useAuthStore from "../zustand/authStore";

// ── Icons ─────────────────────────────────────────────────────────────────────

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
const IconService = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);
const IconEquipment = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
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

function userName(u) {
  return u?.first_name && u?.last_name ? `${u.first_name} ${u.last_name}` : u?.username ?? "—";
}

// Inline delete confirm button group — reused by both detail panels
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-1 ml-1">
      <span className="font-coptic text-[0.55rem] text-red-400 uppercase tracking-widest">Delete?</span>
      <button onClick={onConfirm} className="p-0.5 text-red-400 hover:text-red-300"><IconCheck /></button>
      <button onClick={onCancel}  className="p-0.5 text-stone-500 hover:text-stone-300"><IconX /></button>
    </div>
  );
}

// ── Service Card ──────────────────────────────────────────────────────────────

function ServiceCard({ service, allUsers, allProfiles, allDepartments, onSelect, isSelected }) {
  const memberList    = allUsers.filter((u) => service.members?.includes(u.id));
  const pastor        = allUsers.find((u) => u.id === service.pastor);
  const pastorProfile = allProfiles.find((p) => p.user?.id === service.pastor);
  const crewDepts     = allDepartments.filter((d) => service.crew?.includes(d.id));

  return (
    <div onClick={() => onSelect(service)}
      className={`flex flex-col bg-white border transition-all duration-200 cursor-pointer hover:border-amber-300 hover:shadow-md ${isSelected ? "border-amber-400 shadow-md" : "border-stone-100"}`}>
      <div className="flex items-start justify-between p-5 border-b border-stone-100">
        <div className="flex-1 min-w-0">
          <h3 className="font-cormorant text-xl font-semibold text-stone-800 leading-tight truncate">{service.name}</h3>
          {service.description && <p className="text-xs text-stone-400 mt-1 line-clamp-2">{service.description}</p>}
        </div>
        <span className="text-[0.6rem] uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 shrink-0 ml-3">
          {memberList.length} {memberList.length === 1 ? "member" : "members"}
        </span>
      </div>
      <div className="px-5 py-3 flex items-center gap-3 border-b border-stone-100">
        <img src={pastorProfile?.profile_pic_url || "/images/defaultavatar.jpg"} alt={pastor?.username || "Pastor"}
          className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/30" />
        <div>
          <p className="text-[0.55rem] uppercase tracking-widest text-stone-400 font-coptic leading-none">Pastor</p>
          <p className="text-xs text-stone-600">{pastor ? userName(pastor) : "—"}</p>
        </div>
      </div>
      <div className="px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {crewDepts.slice(0, 3).map((d) => (
            <span key={d.id} className="text-[0.55rem] uppercase tracking-widest text-stone-500 bg-stone-100 px-1.5 py-0.5 truncate max-w-24">{d.name}</span>
          ))}
          {crewDepts.length > 3 && <span className="text-[0.55rem] text-stone-400">+{crewDepts.length - 3}</span>}
          {crewDepts.length === 0 && <span className="text-[0.55rem] text-stone-300 italic">No crew assigned</span>}
        </div>
        <div className="flex items-center shrink-0">
          {memberList.slice(0, 4).map((m) => {
            const mp = allProfiles.find((p) => p.user?.id === m.id);
            return <img key={m.id} src={mp?.profile_pic_url || "/images/defaultavatar.jpg"} alt={m.username}
              title={userName(m)} className="w-6 h-6 rounded-full object-cover ring-2 ring-white -ml-1.5 first:ml-0" />;
          })}
          {memberList.length > 4 && (
            <span className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[0.5rem] text-stone-500 -ml-1.5">
              +{memberList.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Service Detail ────────────────────────────────────────────────────────────

function ServiceDetail({ service, allUsers, allProfiles, allDepartments, equipment, onClose, onEdit, onDelete }) {
  const memberList    = allUsers.filter((u) => service.members?.includes(u.id));
  const pastor        = allUsers.find((u) => u.id === service.pastor);
  const pastorProfile = allProfiles.find((p) => p.user?.id === service.pastor);
  const crewDepts     = allDepartments.filter((d) => service.crew?.includes(d.id));
  const assignedEquip = equipment.find((e) => e.assigned_service === service.id);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="relative overflow-hidden bg-khaki/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-5">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 mb-1">Service</p>
          <h3 className="font-cormorant text-2xl font-semibold text-light leading-tight truncate">{service.name}</h3>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 ml-2">
          <button onClick={onEdit} title="Edit" className="p-1.5 text-stone-500 hover:text-amber-400 transition-colors"><IconEdit /></button>
          {!confirmDelete
            ? <button onClick={() => setConfirmDelete(true)} title="Delete" className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"><IconTrash /></button>
            : <DeleteConfirm onConfirm={() => onDelete(service.id)} onCancel={() => setConfirmDelete(false)} />
          }
          <button onClick={onClose} className="p-1.5 text-stone-600 hover:text-stone-300 transition-colors ml-0.5"><IconX /></button>
        </div>
      </div>

      {service.description && (
        <p className="text-sm text-stone-100 leading-relaxed relative z-10 border-l-2 border-amber-500/35 pl-3">{service.description}</p>
      )}

      <div className="relative z-10">
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 font-coptic mb-2">Pastor</p>
        <div className="flex items-center gap-3">
          <img src={pastorProfile?.profile_pic_url || "/images/defaultavatar.jpg"} alt={pastor?.username || "Pastor"}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/30" />
          <div>
            <p className="text-sm font-cormorant font-semibold text-light">{pastor ? userName(pastor) : "No pastor assigned"}</p>
            {pastor && <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-500">@{pastor.username}</p>}
          </div>
        </div>
      </div>

      {crewDepts.length > 0 && (
        <div className="relative z-10">
          <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 font-coptic mb-2">Crew Departments</p>
          <div className="flex flex-wrap gap-1.5">
            {crewDepts.map((d) => (
              <span key={d.id} className="text-[0.6rem] uppercase tracking-widest text-stone-400 bg-white/5 border border-white/10 px-2 py-1">{d.name}</span>
            ))}
          </div>
        </div>
      )}

      {assignedEquip && (
        <div className="relative z-10">
          <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 font-coptic mb-2">Assigned Equipment</p>
          <div className="bg-white/5 border border-white/10 px-4 py-3 flex items-center gap-3">
            {assignedEquip.image && <img src={assignedEquip.image} alt={assignedEquip.name} className="w-10 h-10 object-cover shrink-0" />}
            <div>
              <p className="text-sm text-stone-200 font-cormorant font-semibold">{assignedEquip.name}</p>
              <p className="text-[0.6rem] text-stone-500 uppercase tracking-widest font-coptic">Qty: {assignedEquip.quantity}</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 font-coptic mb-2">Members ({memberList.length})</p>
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
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

// ── Equipment Card ────────────────────────────────────────────────────────────

function EquipmentCard({ item, services, departments, onSelect, isSelected }) {
  const assignedService    = services.find((s) => s.id === item.assigned_service);
  const assignedDepartment = departments.find((d) => d.id === item.assigned_department);

  return (
    <div onClick={() => onSelect(item)}
      className={`flex bg-white border transition-all duration-200 cursor-pointer hover:border-amber-300 hover:shadow-md ${isSelected ? "border-amber-400 shadow-md" : "border-stone-100"}`}>
      {item.image && <img src={item.image} alt={item.name} className="w-20 h-full object-cover shrink-0" />}
      <div className="flex flex-col flex-1 min-w-0 p-4 gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-cormorant text-lg font-semibold text-stone-800 leading-tight truncate">{item.name}</h3>
          <span className="text-[0.6rem] uppercase tracking-widest text-stone-500 bg-stone-50 border border-stone-200 px-2 py-1 shrink-0">qty {item.quantity}</span>
        </div>
        {item.description && <p className="text-xs text-stone-400 line-clamp-2">{item.description}</p>}
        <div className="mt-auto pt-2">
          {assignedService && <span className="text-[0.55rem] uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5">{assignedService.name}</span>}
          {assignedDepartment && <span className="text-[0.55rem] uppercase tracking-widest text-stone-500 bg-stone-100 border border-stone-200 px-1.5 py-0.5">{assignedDepartment.name}</span>}
          {!assignedService && !assignedDepartment && <span className="text-[0.55rem] uppercase tracking-widest text-stone-300 italic">Unassigned</span>}
        </div>
      </div>
    </div>
  );
}

// ── Equipment Detail ──────────────────────────────────────────────────────────

function EquipmentDetail({ item, services, departments, onClose, onEdit, onDelete }) {
  const assignedService    = services.find((s) => s.id === item.assigned_service);
  const assignedDepartment = departments.find((d) => d.id === item.assigned_department);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="relative overflow-hidden bg-khaki/70 backdrop-blur-md border border-white/10 rounded-sm shadow-lg shadow-black/20 p-6 flex flex-col gap-5">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 mb-1">Equipment</p>
          <h3 className="font-cormorant text-2xl font-semibold text-stone-100 leading-tight truncate">{item.name}</h3>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 ml-2">
          <button onClick={onEdit} title="Edit" className="p-1.5 text-stone-500 hover:text-amber-400 transition-colors"><IconEdit /></button>
          {!confirmDelete
            ? <button onClick={() => setConfirmDelete(true)} title="Delete" className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"><IconTrash /></button>
            : <DeleteConfirm onConfirm={() => onDelete(item.id)} onCancel={() => setConfirmDelete(false)} />
          }
          <button onClick={onClose} className="p-1.5 text-stone-600 hover:text-stone-300 transition-colors ml-0.5"><IconX /></button>
        </div>
      </div>

      {item.image && <img src={item.image} alt={item.name} className="w-full h-36 object-cover relative z-10 outline-1 outline-light/70 p-px" />}

      {item.description && (
        <p className="text-sm text-stone-100 leading-relaxed relative z-10 border-l-2 border-amber-500/40 pl-3">{item.description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 relative z-10">
        <div className="bg-white/5 border border-white/10 px-3 py-2.5">
          <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-700 mb-1">Quantity</p>
          <p className="font-cormorant text-2xl font-light text-light">{item.quantity}</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-2.5">
          <p className="font-coptic text-[0.55rem] uppercase tracking-widest text-stone-700 mb-1">Assigned To</p>
          <p className="text-xs text-light mt-1">
            {assignedService ? assignedService.name : assignedDepartment ? assignedDepartment.name : "Unassigned"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Crew picker (shared by service forms) ────────────────────────────────────

function CrewPicker({ allDepartments, selected, onChange }) {
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);
  if (!allDepartments.length) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <InputLabel>Crew Departments <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
      <div className="border border-stone-200 divide-y divide-stone-100 max-h-36 overflow-y-auto">
        {allDepartments.map((d) => {
          const checked = selected.includes(d.id);
          return (
            <div key={d.id} onClick={() => toggle(d.id)}
              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${checked ? "bg-amber-50" : "hover:bg-stone-50"}`}>
              <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
              <p className="text-sm text-stone-700">{d.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Member picker (shared) ────────────────────────────────────────────────────

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
      <div className="border border-stone-200 divide-y divide-stone-100 max-h-44 overflow-y-auto">
        {filtered.map((u) => {
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
              <div className={`w-4 h-4 border flex items-center justify-center shrink-0 ${checked ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Shared service fields ─────────────────────────────────────────────────────

function ServiceFields({ name, setName, description, setDescription, pastorId, setPastorId, allUsers, allDepartments, allProfiles, selectedMembers, setSelectedMembers, selectedCrew, setSelectedCrew }) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Service Name *</InputLabel>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Youth Service" required
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Description</InputLabel>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="About this service…"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors resize-none min-h-16 w-full" />
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
      <CrewPicker allDepartments={allDepartments} selected={selectedCrew} onChange={setSelectedCrew} />
      <div className="flex flex-col gap-1.5">
        <InputLabel>Members</InputLabel>
        <MemberPicker allUsers={allUsers} allProfiles={allProfiles} selected={selectedMembers} onChange={setSelectedMembers} />
      </div>
    </>
  );
}

// ── Create Service Form ───────────────────────────────────────────────────────

function CreateServiceForm({ allUsers, allProfiles, allDepartments, onSuccess }) {
  const createService = useMainStore((state) => state.createService);

  const [name,            setName]            = useState("");
  const [description,     setDescription]     = useState("");
  const [pastorId,        setPastorId]        = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedCrew,    setSelectedCrew]    = useState([]);
  const [submitting,      setSubmitting]      = useState(false);
  const [error,           setError]           = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Service name is required.");
    setSubmitting(true);
    const result = await createService({ name, description, pastor: pastorId ? Number(pastorId) : null, members: selectedMembers, crew: selectedCrew });
    setSubmitting(false);
    if (result?.success) { setName(""); setDescription(""); setPastorId(""); setSelectedMembers([]); setSelectedCrew([]); onSuccess?.(); }
    else setError("Failed to create service. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <ServiceFields {...{ name, setName, description, setDescription, pastorId, setPastorId, allUsers, allDepartments, allProfiles, selectedMembers, setSelectedMembers, selectedCrew, setSelectedCrew }} />
      {error && <p className="text-[0.6rem] uppercase tracking-widest text-red-400">{error}</p>}
      <button type="submit" disabled={submitting}
        className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2">
        {submitting ? <span className="animate-pulse">Creating…</span> : <><IconPlus /><span>Create Service</span></>}
      </button>
    </form>
  );
}

// ── Edit Service Form ─────────────────────────────────────────────────────────

function EditServiceForm({ service, allUsers, allProfiles, allDepartments, onSuccess, onCancel }) {
  const updateService = useMainStore((state) => state.updateService);

  const [name,            setName]            = useState(service.name        || "");
  const [description,     setDescription]     = useState(service.description || "");
  const [pastorId,        setPastorId]        = useState(service.pastor      ? String(service.pastor) : "");
  const [selectedMembers, setSelectedMembers] = useState(service.members     || []);
  const [selectedCrew,    setSelectedCrew]    = useState(service.crew        || []);
  const [submitting,      setSubmitting]      = useState(false);
  const [error,           setError]           = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Service name is required.");
    setSubmitting(true);
    const result = await updateService(service.id, { name, description, pastor: pastorId ? Number(pastorId) : null, members: selectedMembers, crew: selectedCrew });
    setSubmitting(false);
    if (result?.success) onSuccess?.(result.service);
    else setError("Failed to update service. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <ServiceFields {...{ name, setName, description, setDescription, pastorId, setPastorId, allUsers, allDepartments, allProfiles, selectedMembers, setSelectedMembers, selectedCrew, setSelectedCrew }} />
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

// ── Shared equipment fields ───────────────────────────────────────────────────

function EquipmentFields({ name, setName, description, setDescription, quantity, setQuantity, assignTo, setAssignTo, assignedService, setAssignedService, assignedDepartment, setAssignedDepartment, services, departments, showImageField = false, image, setImage }) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Name *</InputLabel>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Yamaha Sound Desk" required
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Description</InputLabel>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details about this equipment…"
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors resize-none min-h-16 w-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <InputLabel>Quantity</InputLabel>
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
          className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors w-full" />
      </div>
      {showImageField && (
        <div className="flex flex-col gap-1.5">
          <InputLabel>Image <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
            className="text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-[0.6rem] file:font-coptic file:uppercase file:tracking-widest file:bg-stone-700 file:text-stone-200 hover:file:bg-stone-600 file:transition-colors file:cursor-pointer" />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <InputLabel>Assign To <span className="text-stone-300 normal-case tracking-normal">(optional)</span></InputLabel>
        <div className="flex gap-3">
          {["none", "service", "department"].map((opt) => (
            <button key={opt} type="button" onClick={() => setAssignTo(opt)}
              className={`flex-1 py-2 text-[0.6rem] uppercase tracking-widest font-coptic border transition-colors ${assignTo === opt ? "bg-amber-500 border-amber-500 text-white" : "bg-white border-stone-200 text-stone-500 hover:border-amber-300"}`}>
              {opt === "none" ? "None" : opt === "service" ? "Service" : "Department"}
            </button>
          ))}
        </div>
        {assignTo === "service" && (
          <select value={assignedService} onChange={(e) => setAssignedService(e.target.value)}
            className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors w-full mt-1">
            <option value="">Select a service…</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        )}
        {assignTo === "department" && (
          <select value={assignedDepartment} onChange={(e) => setAssignedDepartment(e.target.value)}
            className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none px-3 py-2.5 text-sm text-stone-700 transition-colors w-full mt-1">
            <option value="">Select a department…</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        )}
      </div>
    </>
  );
}

// ── Create Equipment Form ─────────────────────────────────────────────────────

function CreateEquipmentForm({ services, departments, onSuccess }) {
  const createEquipment = useMainStore((state) => state.createEquipment);

  const [name,               setName]               = useState("");
  const [description,        setDescription]        = useState("");
  const [quantity,           setQuantity]           = useState(1);
  const [image,              setImage]              = useState(null);
  const [assignTo,           setAssignTo]           = useState("none");
  const [assignedService,    setAssignedService]    = useState("");
  const [assignedDepartment, setAssignedDepartment] = useState("");
  const [submitting,         setSubmitting]         = useState(false);
  const [error,              setError]              = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Equipment name is required.");
    setSubmitting(true);
    let result;
    if (image) {
      const fd = new FormData();
      fd.append("name", name); fd.append("description", description); fd.append("quantity", quantity); fd.append("image", image);
      fd.append("assigned_service",    assignTo === "service"    ? assignedService    : "");
      fd.append("assigned_department", assignTo === "department" ? assignedDepartment : "");
      result = await createEquipment(fd);
    } else {
      result = await createEquipment({ name, description, quantity,
        assigned_service:    assignTo === "service"    && assignedService    ? Number(assignedService)    : null,
        assigned_department: assignTo === "department" && assignedDepartment ? Number(assignedDepartment) : null,
      });
    }
    setSubmitting(false);
    if (result?.success) { setName(""); setDescription(""); setQuantity(1); setImage(null); setAssignTo("none"); setAssignedService(""); setAssignedDepartment(""); onSuccess?.(); }
    else setError("Failed to add equipment. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <EquipmentFields {...{ name, setName, description, setDescription, quantity, setQuantity, assignTo, setAssignTo, assignedService, setAssignedService, assignedDepartment, setAssignedDepartment, services, departments, showImageField: true, image, setImage }} />
      {error && <p className="text-[0.6rem] uppercase tracking-widest text-red-400">{error}</p>}
      <button type="submit" disabled={submitting}
        className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-coptic text-[0.65rem] uppercase tracking-widest py-3 transition-colors flex items-center justify-center gap-2">
        {submitting ? <span className="animate-pulse">Adding…</span> : <><IconPlus /><span>Add Equipment</span></>}
      </button>
    </form>
  );
}

// ── Edit Equipment Form ───────────────────────────────────────────────────────

function EditEquipmentForm({ item, services, departments, onSuccess, onCancel }) {
  const updateEquipment = useMainStore((state) => state.updateEquipment);

  const initAssignTo = item.assigned_service ? "service" : item.assigned_department ? "department" : "none";

  const [name,               setName]               = useState(item.name        || "");
  const [description,        setDescription]        = useState(item.description || "");
  const [quantity,           setQuantity]           = useState(item.quantity    ?? 1);
  const [assignTo,           setAssignTo]           = useState(initAssignTo);
  const [assignedService,    setAssignedService]    = useState(item.assigned_service    ? String(item.assigned_service)    : "");
  const [assignedDepartment, setAssignedDepartment] = useState(item.assigned_department ? String(item.assigned_department) : "");
  const [submitting,         setSubmitting]         = useState(false);
  const [error,              setError]              = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Equipment name is required.");
    setSubmitting(true);
    const result = await updateEquipment(item.id, { name, description, quantity: Number(quantity),
      assigned_service:    assignTo === "service"    && assignedService    ? Number(assignedService)    : null,
      assigned_department: assignTo === "department" && assignedDepartment ? Number(assignedDepartment) : null,
    });
    setSubmitting(false);
    if (result?.success) onSuccess?.(result.item);
    else setError("Failed to update equipment. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <EquipmentFields {...{ name, setName, description, setDescription, quantity, setQuantity, assignTo, setAssignTo, assignedService, setAssignedService, assignedDepartment, setAssignedDepartment, services, departments, showImageField: false }} />
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

function ServicesDashboard() {
  const token = useAuthStore((state) => state.token);

  const services    = useMainStore((state) => state.services);
  const equipment   = useMainStore((state) => state.equipment)   || [];
  const departments = useMainStore((state) => state.departments) || [];
  const allUsers    = useMainStore((state) => state.users)       || [];
  const allProfiles = useMainStore((state) => state.profiles)    || [];

  const fetchServices    = useMainStore((state) => state.fetchServices);
  const fetchEquipment   = useMainStore((state) => state.fetchEquipment);
  const fetchDepartments = useMainStore((state) => state.fetchDepartments);
  const fetchUsers       = useMainStore((state) => state.fetchUsers);
  const fetchProfiles    = useMainStore((state) => state.fetchProfiles);
  const deleteService    = useMainStore((state) => state.deleteService);
  const deleteEquipment  = useMainStore((state) => state.deleteEquipment);

  const serviceList = services?.results ?? (Array.isArray(services) ? services : []);
  const deptList    = departments?.results ?? (Array.isArray(departments) ? departments : []);

  const [tab,        setTab]        = useState("services"); // "services" | "equipment"
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null);
  const [mode,       setMode]       = useState("idle"); // "idle" | "create" | "edit"
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchServices(); fetchEquipment(); fetchDepartments(); fetchUsers(); fetchProfiles();
  }, [token, fetchServices, fetchEquipment, fetchDepartments, fetchUsers, fetchProfiles]);

  const switchTab = (t) => { setTab(t); setSelected(null); setMode("idle"); setSearch(""); };

  const filteredServices  = serviceList.filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()));
  const filteredEquipment = equipment.filter((e) => e.name?.toLowerCase().includes(search.toLowerCase()));

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 3000); };

  const handleServiceDelete = async (id) => {
    const result = await deleteService(id);
    if (result?.success) { setSelected(null); setMode("idle"); showSuccess("Service deleted."); }
  };

  const handleEquipmentDelete = async (id) => {
    const result = await deleteEquipment(id);
    if (result?.success) { setSelected(null); setMode("idle"); showSuccess("Equipment deleted."); }
  };

  const handleServiceEditSuccess = (updated) => { setSelected(updated); setMode("idle"); showSuccess("Service updated successfully ✓"); };
  const handleEquipmentEditSuccess = (updated) => { setSelected(updated); setMode("idle"); showSuccess("Equipment updated successfully ✓"); };

  const totalServiceMembers = serviceList.reduce((acc, s) => acc + (s.members?.length ?? 0), 0);
  const unassignedEquip     = equipment.filter((e) => !e.assigned_service && !e.assigned_department).length;

  const rightTitle = mode === "create"
    ? (tab === "services" ? "New Service" : "Add Equipment")
    : mode === "edit"
    ? (tab === "services" ? "Edit Service" : "Edit Equipment")
    : (tab === "services" ? "Service Details" : "Equipment Details");

  return (
    <div className="min-h-screen w-full bg-[#faf8f3] p-8">

      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-stone-400 mb-1">Church</p>
          <h1 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">Services & Equipment</h1>
          <div className="w-8 h-0.5 bg-amber-500 mt-3" />
        </div>
        <button onClick={() => { setMode(mode === "create" ? "idle" : "create"); setSelected(null); }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-coptic text-[0.65rem] uppercase tracking-widest px-4 py-3 transition-colors">
          <IconPlus />
          {mode === "create" ? "Cancel" : tab === "services" ? "New Service" : "Add Equipment"}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 font-coptic text-xs uppercase tracking-widest">
          {successMsg}
        </div>
      )}

      <div className="flex border-b border-stone-200 mb-8">
        {[
          { key: "services",  label: "Services",  icon: <IconService /> },
          { key: "equipment", label: "Equipment", icon: <IconEquipment /> },
        ].map(({ key, label, icon }) => (
          <button key={key} onClick={() => switchTab(key)}
            className={`flex items-center gap-2 px-5 py-3 font-coptic text-[0.65rem] uppercase tracking-widest border-b-2 transition-colors -mb-px ${tab === key ? "border-amber-500 text-amber-600" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2 flex flex-col gap-5">
          <div className="flex items-center gap-6 pb-5 border-b border-stone-200 flex-wrap">
            {tab === "services" ? (
              <>
                <div><p className="font-cormorant text-3xl font-light text-stone-800">{services?.count ?? serviceList.length}</p><p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Services</p></div>
                <div className="w-px h-8 bg-stone-200" />
                <div><p className="font-cormorant text-3xl font-light text-stone-800">{totalServiceMembers}</p><p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Total Members</p></div>
                <div className="w-px h-8 bg-stone-200" />
                <div><p className="font-cormorant text-3xl font-light text-stone-800">{serviceList.filter((s) => s.pastor).length}</p><p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">With Pastors</p></div>
              </>
            ) : (
              <>
                <div><p className="font-cormorant text-3xl font-light text-stone-800">{equipment.length}</p><p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Items</p></div>
                <div className="w-px h-8 bg-stone-200" />
                <div><p className="font-cormorant text-3xl font-light text-stone-800">{equipment.reduce((acc, e) => acc + (e.quantity ?? 0), 0)}</p><p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Total Qty</p></div>
                <div className="w-px h-8 bg-stone-200" />
                <div><p className="font-cormorant text-3xl font-light text-stone-800">{unassignedEquip}</p><p className="text-[0.6rem] uppercase tracking-widest text-stone-400 font-coptic">Unassigned</p></div>
              </>
            )}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"><IconSearch /></span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === "services" ? "Search services…" : "Search equipment…"}
              className="bg-white border border-stone-200 focus:border-amber-400 focus:outline-none pl-9 pr-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 transition-colors w-full" />
          </div>

          {tab === "services" ? (
            filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredServices.map((s) => (
                  <ServiceCard key={s.id} service={s} allUsers={allUsers} allProfiles={allProfiles} allDepartments={deptList}
                    onSelect={(svc) => { setSelected(svc); setMode("idle"); }} isSelected={selected?.id === s.id} />
                ))}
              </div>
            ) : <EmptyState message={search ? "No services match your search" : "No services yet"} />
          ) : (
            filteredEquipment.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filteredEquipment.map((item) => (
                  <EquipmentCard key={item.id} item={item} services={serviceList} departments={deptList}
                    onSelect={(e) => { setSelected(e); setMode("idle"); }} isSelected={selected?.id === item.id} />
                ))}
              </div>
            ) : <EmptyState message={search ? "No equipment matches your search" : "No equipment added yet"} />
          )}
        </div>

        <div className="xl:col-span-1">
          {mode !== "idle" || selected ? (
            <>
              <SectionHeading>{rightTitle}</SectionHeading>

              {/* ── Services panel ── */}
              {tab === "services" && mode === "create" && (
                <CreateServiceForm allUsers={allUsers} allProfiles={allProfiles} allDepartments={deptList}
                  onSuccess={() => { setMode("idle"); showSuccess("Service created successfully ✓"); }} />
              )}
              {tab === "services" && mode === "edit" && selected && (
                <EditServiceForm service={selected} allUsers={allUsers} allProfiles={allProfiles} allDepartments={deptList}
                  onSuccess={handleServiceEditSuccess} onCancel={() => setMode("idle")} />
              )}
              {tab === "services" && mode === "idle" && selected && (
                <ServiceDetail service={selected} allUsers={allUsers} allProfiles={allProfiles}
                  allDepartments={deptList} equipment={equipment}
                  onClose={() => setSelected(null)}
                  onEdit={() => setMode("edit")}
                  onDelete={handleServiceDelete} />
              )}

              {/* ── Equipment panel ── */}
              {tab === "equipment" && mode === "create" && (
                <CreateEquipmentForm services={serviceList} departments={deptList}
                  onSuccess={() => { setMode("idle"); showSuccess("Equipment added successfully ✓"); }} />
              )}
              {tab === "equipment" && mode === "edit" && selected && (
                <EditEquipmentForm item={selected} services={serviceList} departments={deptList}
                  onSuccess={handleEquipmentEditSuccess} onCancel={() => setMode("idle")} />
              )}
              {tab === "equipment" && mode === "idle" && selected && (
                <EquipmentDetail item={selected} services={serviceList} departments={deptList}
                  onClose={() => setSelected(null)}
                  onEdit={() => setMode("edit")}
                  onDelete={handleEquipmentDelete} />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-stone-200 gap-3">
              {tab === "services" ? <IconService /> : <IconEquipment />}
              <p className="text-xs uppercase tracking-widest text-stone-300 font-coptic text-center">
                {tab === "services" ? "Select a service to view details\nor create a new one" : "Select an item to view details\nor add new equipment"}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center py-20 gap-3">
      <div className="w-8 h-px bg-amber-500/40" />
      <p className="text-xs uppercase tracking-[0.25em] text-stone-300">{message}</p>
      <div className="w-8 h-px bg-amber-500/40" />
    </div>
  );
}

export default ServicesDashboard;