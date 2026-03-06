import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleHome = (e) => {
    e.preventDefault();
    navigate(user ? "/feed" : "/");
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `font-coptic text-[0.6rem] uppercase tracking-[0.2em] transition-colors px-3 py-1.5 border-b border-transparent ${
      isActive
        ? "text-amber-500 border-amber-500"
        : "text-stone-400 hover:text-stone-100"
    }`;

  return (
    <div className="fixed w-full top-0 z-50">
      <nav className="w-full flex items-center justify-between bg-[#0f0f0d]/90 backdrop-blur-md border-b border-white/6 px-6 sm:px-10 py-4">

        {/* Logo */}
        <NavLink to="/" className="font-cormorant text-2xl font-semibold tracking-[0.15em] text-stone-100 hover:text-amber-400 transition-colors">
          O<span className="text-amber-500">C</span>M
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-1">
          <li>
            <a href="#" onClick={handleHome} className="font-coptic text-[0.6rem] uppercase tracking-[0.2em] transition-colors px-3 py-1.5 border-b border-transparent text-stone-400 hover:text-stone-100">
              Home
            </a>
          </li>
          <li>
            <a
              href="https://mavunochurch.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-coptic text-[0.6rem] uppercase tracking-[0.2em] transition-colors px-3 py-1.5 border-b border-transparent text-stone-400 hover:text-stone-100 flex items-center gap-1"
            >
              Mavuno Church
              <svg className="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#about" className="font-coptic text-[0.6rem] uppercase tracking-[0.2em] transition-colors px-3 py-1.5 border-b border-transparent text-stone-400 hover:text-stone-100">
              Docs
            </a>
          </li>
        </ul>

        {/* Right side: divider + CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="w-px h-4 bg-white/10" />
          <NavLink
            to="/auth/login"
            className="font-coptic text-[0.6rem] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-100 transition-colors"
          >
            Sign In
          </NavLink>
          <NavLink
            to={user ? "/feed" : "/auth/login"}
            className="bg-amber-500 hover:bg-amber-600 text-black font-coptic text-[0.6rem] uppercase tracking-[0.2em] px-4 py-2 transition-colors"
          >
            {user ? "Go to Feed" : "Get Started"}
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-1.5"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-stone-400 transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
          <span className={`block w-5 h-px bg-stone-400 transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-stone-400 transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`sm:hidden bg-[#0f0f0d]/98 backdrop-blur-md border-b border-white/6 flex flex-col transition-all duration-200 overflow-hidden ${
        mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      }`}>
        <div className="flex flex-col px-6 py-4 gap-1">
          <a
            href="#"
            onClick={handleHome}
            className="font-coptic text-[0.6rem] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-100 py-3 border-b border-white/5 transition-colors"
          >
            Home
          </a>
          <a
            href="https://mavunochurch.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-coptic text-[0.6rem] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-100 py-3 border-b border-white/5 transition-colors flex items-center gap-1.5"
          >
            Mavuno Church
            <svg className="w-2.5 h-2.5 opacity-40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
          <a
            href="#about"
            onClick={() => setMobileOpen(false)}
            className="font-coptic text-[0.6rem] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-100 py-3 border-b border-white/5 transition-colors"
          >
            Docs
          </a>
          <div className="flex gap-3 pt-4">
            <NavLink
              to="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center font-coptic text-[0.6rem] uppercase tracking-[0.2em] text-stone-400 border border-white/10 hover:border-white/20 py-2.5 transition-colors"
            >
              Sign In
            </NavLink>
            <NavLink
              to={user ? "/feed" : "/auth/login"}
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center bg-amber-500 hover:bg-amber-600 text-black font-coptic text-[0.6rem] uppercase tracking-[0.2em] py-2.5 transition-colors"
            >
              {user ? "Go to Feed" : "Get Started"}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;