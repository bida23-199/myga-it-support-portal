"use client";

import { useEffect } from "react";
import { isLoggedIn, getUserRole, logoutUser } from "../../lib/auth";
import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";

export default function KnowledgePage() {
  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.replace("/login");
    }
  }, []);

  const role = getUserRole();
  const isIT = role === "IT Officer" || role === "Administrator";

  const guides = [
    {
      icon: "🔐",
      title: "Password Reset",
      text: "Use CTRL + ALT + DELETE to change your password. Contact ICT if your account is locked.",
    },
    {
      icon: "📧",
      title: "Outlook Email Issues",
      text: "Check your internet connection, restart Outlook, and confirm Outlook is not working offline.",
    },
    {
      icon: "🌐",
      title: "Network / Internet",
      text: "Check your Ethernet cable or Wi-Fi connection. Restart your device before logging a ticket.",
    },
    {
      icon: "🖨️",
      title: "Printer Troubleshooting",
      text: "Check printer power, selected printer, paper, network connection, and restart the printer.",
    },
    {
      icon: "🖥️",
      title: "System Access",
      text: "For GABS, NARMS, YSA, or system access issues, log a ticket with your username and office number.",
    },
    {
      icon: "☎️",
      title: "When to Contact ICT",
      text: "Contact ICT for locked accounts, no network, failed systems, printer problems, or faulty hardware.",
    },
  ];

  return (
    <>
      {/* DESKTOP VIEW */}
      <main className="hidden sm:flex min-h-screen bg-gray-100">
        <div className="w-64 bg-blue-950 text-white min-h-screen p-5">
          <h2 className="text-2xl font-bold mb-8">MYGA ICT</h2>

          <ul className="space-y-4">
            {!isIT && (
              <li>
                <a href="/" className="block hover:bg-blue-800 p-3 rounded-xl">
                  Client Portal
                </a>
              </li>
            )}

            <li>
              <a href="/knowledge" className="block bg-blue-800 p-3 rounded-xl">
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

        <div className="flex-1 p-6">
          <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-lg mb-6">
            <h1 className="text-4xl font-bold">Knowledge Base</h1>
            <p className="mt-2 text-lg">
              Self-service ICT guides for common support issues.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-3">
                  {guide.icon} {guide.title}
                </h2>

                <p className="text-gray-700">{guide.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* PHONE VIEW */}
      <main className="sm:hidden min-h-screen bg-slate-50 pb-24">
        <AppHeader />

        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
            <p className="text-lg font-semibold">Self-Service Support</p>

            <h1 className="text-4xl font-black mt-4 leading-tight">
              Knowledge Base
            </h1>

            <p className="text-blue-100 mt-4">
              Find quick solutions to common ICT support problems.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-6">
            {guides.map((guide, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-md p-5">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl">
                    {guide.icon}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">
                      {guide.title}
                    </h3>

                    <p className="text-gray-600 mt-2">{guide.text}</p>
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