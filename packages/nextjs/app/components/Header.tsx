"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 border-b border-base-300">
      <div className="navbar-start">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-xl w-11 shadow-lg">
              <span className="text-2xl font-bold">Z</span>
            </div>
          </div>
          <a href="/" className="btn btn-ghost text-2xl font-bold normal-case">
            ZeroToDapp
          </a>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/subgraph">Subgraph</a>
          </li>
          <li>
            <a
              href="https://www.zerotodapp.xyz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Info
            </a>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <ConnectButton />
      </div>
    </div>
  );
}
