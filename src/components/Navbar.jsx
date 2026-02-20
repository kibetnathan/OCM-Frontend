import React from "react";

function Navbar() {
  return (
    <div className="fixed w-full flex items-center justify-center z-1 top-5">
      <nav className=" navbar w-[80%] rounded-2xl bg-[#151515]/50 backdrop-blur-sm shadow-lg shadow-black/30">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">OCM</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Link</a>
            </li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li>
                    <a>Link 1</a>
                  </li>
                  <li>
                    <a>Link 2</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
