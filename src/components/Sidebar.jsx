import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../zustand/authStore";
import useMainStore from "../zustand/mainStore";
import { useNavigate } from "react-router-dom";

const LEADER_ROLES = ["Pastor", "Jr Leader", "Leader", "Staff"];

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 text-xs tracking-widest uppercase transition-all duration-200 border-l-2 ${
    isActive
      ? "bg-amber-600/15 text-amber-500 border-amber-500"
      : "text-stone-400 hover:bg-white/5 hover:text-stone-100 border-transparent"
  }`;

const subLinkClass = ({ isActive }) =>
  `flex items-center gap-2.5 pl-9 pr-4 py-2 text-[0.65rem] tracking-widest uppercase transition-all duration-150 border-l-2 ${
    isActive
      ? "text-amber-400 border-amber-500/60 bg-amber-600/10"
      : "text-stone-500 hover:text-stone-200 border-transparent hover:bg-white/[0.03]"
  }`;

const SectionLabel = ({ children }) => (
  <li className="px-4 pt-6 pb-1 text-[0.6rem] uppercase tracking-[0.25em] text-stone-600 font-medium">
    {children}
  </li>
);

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-3 h-3 ml-auto transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function ExpandableSection({ icon, label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <li>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs tracking-widest uppercase transition-all duration-200 border-l-2 border-transparent ${
          open
            ? "text-stone-200 bg-white/4"
            : "text-stone-400 hover:bg-white/5 hover:text-stone-100"
        }`}
      >
        {icon}
        {label}
        <ChevronIcon open={open} />
      </button>
      {open && (
        <ul className="flex flex-col mt-0.5 border-l border-white/6 ml-4">
          {children}
        </ul>
      )}
    </li>
  );
}

function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };
  const user = useAuthStore((state) => state.user);
  const fellowships = useMainStore((state) => state.fellowships?.results) || [];

  const userGroups = user?.groups || [];
  const isLeader = userGroups.some((g) => LEADER_ROLES.includes(g));
  const myFellowships = fellowships.filter((g) =>
    g.members?.includes(user?.id),
  );

  return (
    <aside className="sticky top-0 hidden md:flex flex-col w-95 h-screen bg-[#0f0f0d] border-r border-white/6">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-white/6 shrink-0">
        <NavLink
          to="/"
          className="font-cormorant text-2xl font-semibold tracking-[0.15em] text-stone-100 hover:text-amber-400 transition-colors"
        >
          O<span className="text-amber-500">C</span>M
        </NavLink>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {/* ── Feed ── */}
          <li>
            <NavLink to="/feed" className={navLinkClass}>
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-4.5 5.25h4.5m-4.5-2.25h4.5M4.5 3h15a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3Z"
                />
              </svg>
              Feed
            </NavLink>
          </li>

          {/* ── Dashboard — leader roles only ── */}
          {isLeader && (
            <>
              <SectionLabel>Dashboard</SectionLabel>

              <li>
                <NavLink to="/dashboard" end className={navLinkClass}>
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                    />
                  </svg>
                  Overview
                </NavLink>
              </li>

              <ExpandableSection
                defaultOpen
                label="Groups"
                icon={
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                }
              >
                <li>
                  <NavLink
                    to="/dashboard/groups/fellowship"
                    className={subLinkClass}
                  >
                    Fellowship Groups
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/groups/courses"
                    className={subLinkClass}
                  >
                    Courses
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/groups/departments"
                    className={subLinkClass}
                  >
                    Serving Departments
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/groups/services"
                    className={subLinkClass}
                  >
                    Services & Equipment
                  </NavLink>
                </li>
              </ExpandableSection>

              <ExpandableSection
                label="Manage Users"
                icon={
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z"
                    />
                  </svg>
                }
              >
                <li>
                  <NavLink to="/dashboard/users" className={subLinkClass}>
                    All Members
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/users/roles" className={subLinkClass}>
                    Roles
                  </NavLink>
                </li>
              </ExpandableSection>
            </>
          )}

          {/* ── Messaging ── */}
          <SectionLabel>Messaging</SectionLabel>

          <ExpandableSection
            defaultOpen
            label="Channels"
            icon={
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            }
          >
            <li>
              <NavLink to="/messages/general" className={subLinkClass}>
                # General
              </NavLink>
            </li>
            {myFellowships.length > 0 ? (
              myFellowships.map((group) => (
                <li key={group.id}>
                  <NavLink
                    to={`/messages/group/${group.id}`}
                    className={subLinkClass}
                  >
                    # {group.name}
                  </NavLink>
                </li>
              ))
            ) : (
              <li className="pl-9 pr-4 py-2 text-[0.6rem] tracking-widest text-stone-700 uppercase">
                No channels yet
              </li>
            )}
          </ExpandableSection>
        </ul>
      </nav>

      {/* Footer */}
          <button
      onClick={handleLogout}
      className="flex items-center gap-3 w-full px-4 py-2.5 text-left font-coptic text-[0.6rem] uppercase tracking-widest text-stone-600 hover:text-red-400 hover:bg-white/5 transition-colors group"
    >
      <svg
        className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
        fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
      </svg>
      Sign Out
    </button>
      <div className="px-5 py-4 border-t border-white/6 shrink-0">
        <p className="text-[0.6rem] tracking-widest uppercase text-amber-600/70">
          Powered by Mavuno Church
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
