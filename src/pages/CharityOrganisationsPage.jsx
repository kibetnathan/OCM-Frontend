import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import useMainStore from "../zustand/mainStore";
import PaymentComponent from "../components/PaymentComponent";

const IconHeart = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const IconLink = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const IconBanknotes = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

function OrgListCard({ org, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(org)}
      className={`w-full text-left transition-all duration-150 border-l-2 ${
        isSelected
          ? "border-amber-500 bg-amber-600/10"
          : "border-transparent hover:border-amber-500/40 hover:bg-white/3"
      }`}
    >
      {org.banner && (
        <div className="w-full h-20 overflow-hidden">
          <img src={org.banner} alt={org.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="px-4 py-3">
        <h3 className="font-cormorant text-base font-semibold text-stone-100 leading-tight truncate">
          {org.name}
        </h3>
        {org.description && (
          <p className="text-[0.7rem] text-stone-400 mt-0.5 line-clamp-2 leading-relaxed">
            {org.description}
          </p>
        )}
        <p className="text-[0.6rem] uppercase tracking-widest text-stone-500 mt-2 font-coptic">
          {org.members?.length ?? 0} member{(org.members?.length ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>
    </button>
  );
}

function OrgDetailCard({ org }) {
  const [joinSent, setJoinSent] = useState(false);

  const memberCount = org.members?.length ?? 0;
  const joinedDate = org.created_at
    ? new Date(org.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col bg-white border border-stone-200 shadow-sm">
      {/* Banner */}
      {org.banner ? (
        <div className="w-full h-56 overflow-hidden shrink-0 border-b border-stone-200">
          <img src={org.banner} alt={org.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-36 shrink-0 bg-gradient-to-br from-amber-50 to-stone-100 border-b border-stone-200 flex items-center justify-center">
          <IconHeart className="w-8 h-8 text-amber-300" />
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-1">
          <p className="font-coptic text-[0.6rem] uppercase tracking-[0.25em] text-amber-600 mb-2">
            Charity Organisation
          </p>
          <h2 className="font-cormorant text-4xl font-semibold text-stone-800 leading-tight">
            {org.name}
          </h2>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-5 mt-4 mb-6 pb-6 border-b border-stone-100">
          <span className="flex items-center gap-1.5 text-stone-500 text-sm">
            <IconUsers />
            <span>
              <span className="font-medium text-stone-700">{memberCount}</span>{" "}
              {memberCount !== 1 ? "members" : "member"}
            </span>
          </span>
          {joinedDate && (
            <span className="flex items-center gap-1.5 text-stone-400 text-sm">
              <IconCalendar />
              Established {joinedDate}
            </span>
          )}
        </div>

        {/* Description */}
        {org.description && (
          <div className="mb-6">
            <p className="font-coptic text-[0.6rem] uppercase tracking-widest text-stone-400 mb-2">
              About
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">{org.description}</p>
          </div>
        )}

        {/* Payment method */}
        {org.payment_method && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100">
            <p className="font-coptic text-[0.6rem] uppercase tracking-widest text-amber-700 mb-2 flex items-center gap-1.5">
              <IconBanknotes />
              How to Donate
            </p>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {org.payment_method}
            </p>
          </div>
        )}

        {/* Donation link */}
        {org.donation_link && (
          <div className="mb-8">
            <a
              href={org.donation_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-400 text-amber-700 hover:bg-amber-50 text-[0.75rem] uppercase tracking-[0.12em] font-coptic transition-colors"
            >
              <IconLink />
              Donate Online
            </a>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-stone-100 mb-6" />

        {/* Join button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setJoinSent(true)}
            disabled={joinSent}
            className={`flex items-center gap-2 px-7 py-3 text-[0.75rem] uppercase tracking-[0.15em] font-coptic transition-all duration-200 ${
              joinSent
                ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-default"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            <IconHeart className="w-4 h-4" />
            {joinSent ? "Request Sent" : "Request to Join"}
          </button>
          {joinSent && (
            <p className="text-[0.7rem] text-stone-400 font-coptic">
              Your request has been submitted.
            </p>
          )}
        <div className="flex items-center gap-4">
            <button
            className={`flex items-center gap-2 px-7 py-3 text-[0.75rem] uppercase tracking-[0.15em] font-coptic transition-all duration-200 
                bg-amber-500 hover:bg-amber-600 text-white
                `}
                >
            <IconBanknotes className="w-4 h-4" />
            Click To Donate
          </button>
          <PaymentComponent/>
        </div>
        </div>
      </div>
    </div>
  );
}

function CharityOrganisationsPage() {
  const fetchCharityOrganisations = useMainStore((s) => s.fetchCharityOrganisations);
  const charityOrgs = useMainStore((s) => s.charity_organisations);
  const loading = useMainStore((s) => s.loading);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchCharityOrganisations();
  }, [fetchCharityOrganisations]);

  const orgs = charityOrgs?.results ?? (Array.isArray(charityOrgs) ? charityOrgs : []);
  const effectiveSelected = selected ?? (orgs.length > 0 ? orgs[0] : null);

  return (
    <div className="flex flex-row bg-[#0f0f0d] w-full min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col w-full min-h-screen overflow-hidden">
        {/* Page header */}
        <div className="px-8 py-6 border-b border-white/6 shrink-0">
          <p className="font-coptic text-[0.6rem] uppercase tracking-[0.25em] text-stone-500 mb-1">
            Outreach
          </p>
          <h1 className="font-cormorant text-2xl font-semibold text-stone-100">
            Charity Organisations
          </h1>
        </div>

        {loading && orgs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-coptic text-[0.65rem] uppercase tracking-[0.25em] text-stone-600">
              Loading...
            </p>
          </div>
        ) : orgs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-stone-500 italic">No charity organisations found.</p>
          </div>
        ) : (
          <div className="flex flex-row flex-1 overflow-hidden">
            {/* Left list — ~1/3 */}
            <div className="w-80 shrink-0 border-r border-white/6 overflow-y-auto divide-y divide-white/4">
              {orgs.map((org) => (
                <OrgListCard
                  key={org.id}
                  org={org}
                  isSelected={effectiveSelected?.id === org.id}
                  onSelect={setSelected}
                />
              ))}
            </div>

            {/* Right detail — ~2/3 */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#f7f5f0]">
              {effectiveSelected ? (
                <OrgDetailCard key={effectiveSelected.id} org={effectiveSelected} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-stone-500 italic">
                    Select an organisation to view details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharityOrganisationsPage;
