"use client";

import { useEffect, useState } from "react";
import { isLoggedIn, getUserRole, logoutUser } from "../../lib/auth";

export default function KnowledgePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.replace("/login");
      return;
    }

    setRole(getUserRole());
  }, []);

  const isIT = role === "IT Officer" || role === "Administrator";

  return (
    <main className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-blue-950 text-white min-h-screen p-5">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full bg-blue-800 p-3 rounded-xl font-bold mb-4"
        >
          ☰ Menu
        </button>

        {menuOpen && (
          <ul className="space-y-3">
            <li><a href="/" className="block hover:bg-blue-800 p-3 rounded-xl">Client Portal</a></li>
            <li><a href="/knowledge" className="block bg-blue-800 p-3 rounded-xl">Knowledge Base</a></li>

            {isIT && (
              <>
                <li><a href="/admin" className="block hover:bg-blue-800 p-3 rounded-xl">Admin Dashboard</a></li>
                <li><a href="/tickets" className="block hover:bg-blue-800 p-3 rounded-xl">Ticket Records</a></li>
                <li><a href="/status" className="block hover:bg-blue-800 p-3 rounded-xl">System Status</a></li>
              </>
            )}

            <li>
              <button onClick={logoutUser} className="w-full text-left hover:bg-blue-800 p-3 rounded-xl">
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className="flex-1 p-6">
        <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-lg mb-6">
          <h1 className="text-4xl font-bold">Knowledge Base</h1>
          <p className="mt-2 text-lg">Self-service ICT guides</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            ["Password Reset Guide", "Use CTRL + ALT + DELETE to change password. Contact ICT if locked out."],
            ["Outlook Troubleshooting", "Check internet, restart Outlook, ensure it is not offline, then contact ICT if needed."],
            ["Network Connection", "Check Ethernet cable, restart device, test another port, then report to ICT."],
            ["Printer Troubleshooting", "Check power, network connection, selected printer, and restart printer."],
            ["Creating URL Shortcuts", "Right-click desktop, select New > Shortcut, paste URL, name it, finish."],
            ["When to Contact ICT", "Disabled account, no network, GABS/NARMS/YSA failure, printer not detected, faulty hardware."],
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-3">{item[0]}</h2>
              <p className="text-gray-700">{item[1]}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}