import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const LinkItem = ({ to, children, icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-md transition-all duration-200 text-sm 
        ${
          isActive
            ? "bg-amber-600/20 text-amber-600"
            : "text-stone-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {icon}
      <span className="ml-3">{children}</span>
    </NavLink>
  );

  return (
    <aside className="hidden w-64 bg-black/70 backdrop-blur-md md:block min-h-screen border-r border-white/5">
      {/* Logo */}
      <div className="py-4 text-2xl uppercase tracking-widest text-center bg-black/80 border-b border-white/5 mb-6">
        <NavLink
          to="/"
          className="text-white font-cormorant tracking-widest hover:text-amber-600 transition-colors"
        >
          Logo
        </NavLink>
      </div>

      <nav className="text-sm text-gray-300 px-2">
        <ul className="flex flex-col gap-1">
          {/* Dashboard */}
          <li className="px-2">
            <LinkItem
              to="/"
              icon={
                <svg className="w-4 h-4" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              }
            >
              Dashboard
            </LinkItem>
          </li>

          <li className="px-4 py-2 text-xs uppercase tracking-wider text-stone-500 font-bold mt-4">
            User Management
          </li>

          <li className="px-2">
            <LinkItem
              to="/users"
              icon={
                <svg className="w-4 h-4" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
                </svg>
              }
            >
              Users
            </LinkItem>
          </li>

          <li className="px-2">
            <LinkItem
              to="/roles"
              icon={
                <svg className="w-4 h-4" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                </svg>
              }
            >
              Roles
            </LinkItem>
          </li>

          <li className="px-4 py-2 text-xs uppercase tracking-wider text-stone-500 font-bold mt-4">
            Product Management
          </li>

          <li className="px-2">
            <LinkItem
              to="/products"
              icon={
                <svg className="w-4 h-4" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878" />
                </svg>
              }
            >
              Products
            </LinkItem>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;