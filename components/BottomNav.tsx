"use client";

import { getUserRole, logoutUser } from "../lib/auth";

export default function BottomNav() {
  const role = getUserRole();
  const isIT = role === "IT Officer" || role === "Administrator";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl flex justify-around py-3 md:hidden z-40">
      <a href={isIT ? "/admin" : "/"} className="text-blue-700 font-bold text-center">
        🏠
        <span className="block text-xs">Home</span>
      </a>

      <a href={isIT ? "/tickets" : "/"} className="text-gray-600 font-bold text-center">
        📄
        <span className="block text-xs">Tickets</span>
      </a>

      <a href="/knowledge" className="text-gray-600 font-bold text-center">
        📘
        <span className="block text-xs">Knowledge</span>
      </a>

      <a href={isIT ? "/status" : "/"} className="text-gray-600 font-bold text-center">
        🔔
        <span className="block text-xs">Notify</span>
      </a>

      <button onClick={logoutUser} className="text-gray-600 font-bold">
        👤
        <span className="block text-xs">Logout</span>
      </button>
    </nav>
  );
}