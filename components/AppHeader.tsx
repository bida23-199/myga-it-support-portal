"use client";

import { useState } from "react";
import { getUserRole, getUsername, logoutUser } from "../lib/auth";

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const username = getUsername();
  const role = getUserRole();
  const isIT = role === "IT Officer" || role === "Administrator";

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 to-blue-950 text-white px-5 py-5 shadow-xl">
        <div className="flex items-center justify-between">
          <button onClick={() => setMenuOpen(true)} className="text-3xl">
            ☰
          </button>

          <div className="flex items-center gap-3">
            <div className="h-14 w-11 rounded-b-2xl rounded-t-md border-2 border-yellow-500 flex flex-col items-center justify-center text-yellow-400 text-xs font-bold">
              <span className="text-lg">⚖</span>
              <span>MYGA</span>
            </div>

            <div>
              <h1 className="text-xl font-extrabold">ICT Support Portal</h1>
              <p className="text-xs text-slate-300">MYGA Service Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href={isIT ? "/status" : "/"} className="relative text-3xl">
              🔔
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                !
              </span>
            </a>

            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-lg">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="bg-blue-950 text-white w-72 min-h-screen p-5 shadow-2xl">
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full bg-blue-800 p-3 rounded-xl font-bold mb-4"
            >
              ✕ Close Menu
            </button>

            <ul className="space-y-3">
              <li>
                <a href="/" className="block hover:bg-blue-800 p-3 rounded-xl">
                  Client Portal
                </a>
              </li>

              <li>
                <a href="/knowledge" className="block hover:bg-blue-800 p-3 rounded-xl">
                  Knowledge Base
                </a>
              </li>

              {isIT && (
                <>
                  <li>
                    <a href="/admin" className="block hover:bg-blue-800 p-3 rounded-xl">
                      Admin Dashboard
                    </a>
                  </li>

                  <li>
                    <a href="/tickets" className="block hover:bg-blue-800 p-3 rounded-xl">
                      Ticket Records
                    </a>
                  </li>

                  <li>
                    <a href="/status" className="block hover:bg-blue-800 p-3 rounded-xl">
                      System Status
                    </a>
                  </li>
                </>
              )}

              <li>
                <button
                  onClick={logoutUser}
                  className="w-full text-left hover:bg-blue-800 p-3 rounded-xl"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}