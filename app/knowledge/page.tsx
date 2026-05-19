"use client";

import { useEffect } from "react";
import { isLoggedIn, getUserRole, logoutUser } from "../../lib/auth";
import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";

export default function KnowledgePage() {
  useEffect(() => {
    if (!isLoggedIn()) window.location.replace("/login");
  }, []);

  const isIT =
    getUserRole() === "IT Officer" || getUserRole() === "Administrator";

  const guides = [
    ["🔐", "Password Reset", "Use CTRL + ALT + DELETE to change password. Contact ICT if locked out."],
    ["📧", "Outlook Email", "Check internet, restart Outlook, and confirm it is not offline."],
    ["🌐", "Network / Wi-Fi", "Check cable, Wi-Fi, restart device, then log a ticket if unresolved."],
    ["🖨️", "Printer Issues", "Check power, selected printer, connection, and restart printer."],
    ["🖥️", "System Access", "For GABS, NARMS, YSA access issues, log a ticket with details."],
    ["☎️", "When to Contact ICT", "Contact ICT for locked accounts, system failure, network or hardware issues."],
  ];

  return (
    <>
      <main className="hidden md:flex min-h-screen bg-gray-100">
        <div className="w-64 bg-blue-950 text-white min-h-screen p-5">
          <h2 className="text-2xl font-bold mb-8">MYGA ICT</h2>
          <ul className="space-y-4">
            <li><a href="/" className="block hover:bg-blue-800 p-3 rounded-xl">Client Portal</a></li>
            <li><a href="/knowledge" className="block bg-blue-800 p-3 rounded-xl">Knowledge Base</a></li>
            {isIT && (
              <>
                <li><a href="/admin" className="block hover:bg-blue-800 p-3 rounded-xl">Admin Dashboard</a></li>
                <li><a href="/tickets" className="block hover:bg-blue-800 p-3 rounded-xl">Ticket Records</a></li>
                <li><a href="/status" className="block hover:bg-blue-800 p-3 rounded-xl">System Status</a></li>
              </>
            )}
            <li><button onClick={logoutUser} className="w-full text-left hover:bg-blue-800 p-3 rounded-xl">Logout</button></li>
          </ul>
        </div>

        <div className="flex-1 p-6">
          <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-lg mb-6">
            <h1 className="text-4xl font-bold">Knowledge Base</h1>
            <p className="mt-2 text-lg">Self-service ICT guides for common support issues.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((g, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-3">{g[0]} {g[1]}</h2>
                <p className="text-gray-700">{g[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <main className="md:hidden min-h-screen bg-slate-50 pb-24">
        <AppHeader />
        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
            <p className="text-lg font-semibold">Self-Service Support</p>
            <h1 className="text-4xl font-black mt-4">Knowledge Base</h1>
            <p className="text-blue-100 mt-4">Quick ICT help guides for users.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            {guides.map((g, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-md p-5">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl">{g[0]}</div>
                  <div>
                    <h3 className="font-extrabold text-lg">{g[1]}</h3>
                    <p className="text-gray-600 mt-2">{g[2]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <BottomNav />
      </main>
    </>
  );
}