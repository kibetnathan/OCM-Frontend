import React, { useState } from "react";
import { NavLink } from "react-router-dom";


function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed w-full top-5 flex justify-center z-2">
      <nav className="w-4/5 flex items-center justify-between rounded bg-black/50 backdrop-blur-sm shadow-lg shadow-black/30 px-6 py-5">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-cormorant font-semibold text-amber-600  flex items-center gap-1">
          <span className="block text-light text-2xl tracking-widest">
          O<span className="text-amber-600">C</span>M
          </span>
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1 rounded-md text-sm font-dm-sans uppercase tracking-wide transition-colors ${
                  isActive ? "bg-white/10 text-amber-600" : "text-stone-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>
          </li>



          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-1 rounded-md text-sm font-dm-sans uppercase tracking-wide transition-colors ${
                  isActive ? "bg-white/10 text-amber-600" : "text-stone-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              About
            </NavLink>
          </li>
        </ul>

        {/* CTA */}
        <a href="#" className="hidden sm:inline-block bg-amber-600 text-black px-4 py-1 text-sm font-dm-sans uppercase tracking-wider hover:bg-khaki transition-colors">
          Get Started
        </a>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-1.5"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className={`block w-5 h-0.5 bg-stone-300 transition-transform ${mobileOpen ? "rotate-45 translate-y-1.5 bg-white" : ""}`} />
          <span className={`block w-5 h-0.5 bg-stone-300 transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-stone-300 transition-transform ${mobileOpen ? "-rotate-45 -translate-y-1.5 bg-white" : ""}`} />
        </button>

        {/* Mobile menu */}
        <div className={`sm:hidden absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-sm rounded-lg shadow-lg flex flex-col p-4 gap-2 transition-all ${
          mobileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}>
          <NavLink to="/" className="px-3 py-2 rounded-md text-sm text-stone-300 hover:bg-white/10 hover:text-white" onClick={() => setMobileOpen(false)}>Home</NavLink>
          <a href="#" className="px-3 py-2 rounded-md text-sm text-stone-300 hover:bg-white/10 hover:text-white">Members</a>
          <a href="#" className="px-3 py-2 rounded-md text-sm text-stone-300 hover:bg-white/10 hover:text-white">Groups</a>
          <a href="#" className="px-3 py-2 rounded-md text-sm text-stone-300 hover:bg-white/10 hover:text-white">Leadership</a>
          <NavLink to="/about" className="px-3 py-2 rounded-md text-sm text-stone-300 hover:bg-white/10 hover:text-white" onClick={() => setMobileOpen(false)}>About</NavLink>
          <a href="#" className="mt-2 bg-amber-600 text-black px-4 py-2 rounded-md text-sm text-center uppercase tracking-wide hover:bg-amber-300">Get Started</a>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;