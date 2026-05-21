"use client";

import { useEffect, useState } from "react";
import { getUserRole, logoutUser } from "../lib/auth";

export default function BottomNav() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    setMounted(true);
    setRole(getUserRole());
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl flex justify-around py-3 sm:hidden z-40">
        <a href="/" className="text-blue-700 font-bold text-center">
          🏠
          <span className="block text-xs">Home</span>
        </a>

        <a href="/" className="text-gray-600 font-bold text-center">
          📄
          <span className="block text-xs">Tickets</span>
        </a>

        <a href="/knowledge" className="text-gray-600 font-bold text-center">
          📘
          <span className="block text-xs">Knowledge</span>
        </a>

        <a href="/" className="text-gray-600 font-bold text-center">
          🔔
          <span className="block text-xs">Alerts</span>
        </a>

        <button className="text-gray-600 font-bold">
          👤
          <span className="block text-xs">Logout</span>
        </button>
      </nav>
    );
  }

  const isIT = role === "IT Officer" || role === "Administrator";

  if (isIT) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl flex justify-around py-3 sm:hidden z-40">
        <a href="/admin" className="text-blue-700 font-bold text-center">
          🏠
          <span className="block text-xs">Home</span>
        </a>

        <a href="/tickets" className="text-gray-600 font-bold text-center">
          📄
          <span className="block text-xs">Tickets</span>
        </a>

        <a href="/status" className="text-gray-600 font-bold text-center">
          📡
          <span className="block text-xs">Status</span>
        </a>

        <a href="/knowledge" className="text-gray-600 font-bold text-center">
          📘
          <span className="block text-xs">Knowledge</span>
        </a>

        <button onClick={logoutUser} className="text-gray-600 font-bold">
          👤
          <span className="block text-xs">Logout</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl flex justify-around py-3 sm:hidden z-40">
      <a href="/" className="text-blue-700 font-bold text-center">
        🏠
        <span className="block text-xs">Home</span>
      </a>

      <a href="/#my-tickets" className="text-gray-600 font-bold text-center">
        📄
        <span className="block text-xs">My Tickets</span>
      </a>

      <a href="/knowledge" className="text-gray-600 font-bold text-center">
        📘
        <span className="block text-xs">Knowledge</span>
      </a>

      <a href="/#notifications" className="text-gray-600 font-bold text-center">
        🔔
        <span className="block text-xs">Alerts</span>
      </a>

      <button onClick={logoutUser} className="text-gray-600 font-bold">
        👤
        <span className="block text-xs">Logout</span>
      </button>
    </nav>
  );
}