"use client";

import { useEffect, useState } from "react";
import { getUserRole, getUsername, logoutUser } from "../lib/auth";

export default function AppHeader({
  notificationCount = 0,
}: {
  notificationCount?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setMounted(true);
    setUsername(getUsername());
    setRole(getUserRole());
  }, []);

  const isIT = role === "IT Officer" || role === "Administrator";

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 to-blue-950 text-white px-5 py-5 shadow-xl">
        <div className="flex items-center justify-between">
          <button className="text-3xl">☰</button>

          <div className="flex items-center gap-3">
            <div className="h-14 w-11 rounded-b-2xl rounded-t-md border-2 border-yellow-500 flex flex-col items-center justify-center text-yellow-400 text-xs font-bold">
              <span className="text-lg">⚖</span>
              <span>MYGA</span>
            </div>

            <div>
              <h1 className="text-xl font-extrabold">
                ICT Support Portal
              </h1>

              <p className="text-xs text-slate-300">
                MYGA Service Desk
              </p>
            </div>
          </div>

          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-lg">
            U
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 to-blue-950 text-white px-5 py-5 shadow-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-3xl"
          >
            ☰
          </button>

          <div className="flex items-center gap-3">
            <div className="h-14 w-11 rounded-b-2xl rounded-t-md border-2 border-yellow-500 flex flex-col items-center justify-center text-yellow-400 text-xs font-bold">
              <span className="text-lg">⚖</span>
              <span>MYGA</span>
            </div>

            <div>
              <h1 className="text-xl font-extrabold">
                ICT Support Portal
              </h1>

              <p className="text-xs text-slate-300">
                {isIT
                  ? "Admin Service Desk"
                  : "Client Service Desk"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={isIT ? "/admin" : "/#notifications"}
              className="relative text-3xl"
            >
              🔔

              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                  {notificationCount}
                </span>
              )}
            </a>

            <button
              onClick={() => setProfileOpen(true)}
              className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-lg shadow-lg"
            >
              {username?.charAt(0)?.toUpperCase() || "U"}
            </button>
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
              {!isIT && (
                <>
                  <li>
                    <a
                      href="/"
                      className="block hover:bg-blue-800 p-3 rounded-xl"
                    >
                      Log ICT Issue
                    </a>
                  </li>

                  <li>
                    <a
                      href="/#my-tickets"
                      className="block hover:bg-blue-800 p-3 rounded-xl"
                    >
                      My Tickets
                    </a>
                  </li>

                  <li>
                    <a
                      href="/knowledge"
                      className="block hover:bg-blue-800 p-3 rounded-xl"
                    >
                      Knowledge Base
                    </a>
                  </li>

                  <li>
                    <a
                      href="/#notifications"
                      className="block hover:bg-blue-800 p-3 rounded-xl"
                    >
                      Notifications
                    </a>
                  </li>
                </>
              )}

              {isIT && (
                <>
                  <li>
                    <a
                      href="/admin"
                      className="block hover:bg-blue-800 p-3 rounded-xl"
                    >
                      Admin Dashboard
                    </a>
                  </li>

                  <li>
                    <a
                      href="/tickets"
                      className="block hover:bg-blue-800 p-3 rounded-xl"
                    >
                      Ticket Records
                    </a>
                  </li>

                  <li>
                    <a
                      href="/status"
                      className="block hover:bg-blue-800 p-3 rounded-xl"
                    >
                      System Status
                    </a>
                  </li>

                  <li>
                    <a
                      href="/knowledge"
                      className="block hover:bg-blue-800 p-3 rounded-xl"
                    >
                      Knowledge Base
                    </a>
                  </li>
                </>
              )}

              <li>
                <button
                  onClick={() => {
                    setProfileOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left hover:bg-blue-800 p-3 rounded-xl"
                >
                  Profile
                </button>
              </li>

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

      {profileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-black">
                {username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>

            <h2 className="text-center text-2xl font-black mt-4 text-slate-900">
              {username || "User"}
            </h2>

            <p className="text-center text-gray-500 mt-1">
              {role || "Client/User"}
            </p>

            <div className="bg-slate-100 rounded-2xl p-4 mt-5 text-sm text-gray-700">
              <p>
                <b>Portal:</b> MYGA ICT Support Portal
              </p>

              <p>
                <b>Access:</b>{" "}
                {isIT ? "IT Officer/Admin" : "Client/User"}
              </p>
            </div>

            <button
              onClick={() => setProfileOpen(false)}
              className="w-full bg-blue-700 text-white py-3 rounded-2xl mt-5 font-bold"
            >
              Close
            </button>

            <button
              onClick={logoutUser}
              className="w-full bg-red-100 text-red-700 py-3 rounded-2xl mt-3 font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}