"use client";

import { useEffect } from "react";
import { isLoggedIn } from "../../lib/auth";
import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";

export default function KnowledgePage() {
  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.replace("/login");
    }
  }, []);

  const guides = [
    {
      title: "Password Reset Guide",
      icon: "🔐",
      text: "Use CTRL + ALT + DELETE to change your password. Contact ICT if your account is locked.",
    },
    {
      title: "Outlook Email Issues",
      icon: "📧",
      text: "Check internet, restart Outlook, confirm it is not offline, then contact ICT if the issue continues.",
    },
    {
      title: "Network / Internet",
      icon: "🌐",
      text: "Check Ethernet cable or Wi-Fi connection. Restart your device before logging a ticket.",
    },
    {
      title: "Printer Troubleshooting",
      icon: "🖨️",
      text: "Check printer power, connection, selected printer, and restart the printer if jobs are stuck.",
    },
    {
      title: "System Access",
      icon: "🖥️",
      text: "For GABS, NARMS, YSA or other system access issues, log a ticket with your username and office number.",
    },
    {
      title: "When to Contact ICT",
      icon: "☎️",
      text: "Contact ICT for locked accounts, failed systems, network problems, printer issues, or faulty hardware.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <AppHeader />

      <section className="px-4 py-5 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
          <p className="text-lg font-semibold">Self-Service Support</p>

          <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
            Knowledge Base
          </h1>

          <p className="text-blue-100 mt-4 text-lg">
            Find quick solutions to common ICT support issues.
          </p>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 mt-8 mb-4">
          ICT Help Guides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-md p-5 border border-slate-100"
            >
              <div className="flex items-start gap-4">
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
  );
}