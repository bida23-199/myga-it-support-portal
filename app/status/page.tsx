"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { isLoggedIn, getUserRole, logoutUser } from "../../lib/auth";
import { collection, onSnapshot } from "firebase/firestore";
import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";

export default function StatusPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.replace("/login");
      return;
    }

    const role = getUserRole();
    if (role !== "IT Officer" && role !== "Administrator") {
      window.location.replace("/");
      return;
    }

    const unsubscribe = onSnapshot(collection(db, "tickets"), (snapshot) => {
      setTickets(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });

    return () => unsubscribe();
  }, []);

  const pending = tickets.filter((t) => t.status === "Pending").length;
  const progress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;
  const critical = tickets.filter((t) => t.priority === "Critical").length;

  const systems = [
    ["💰", "GABS System", "Operational", "Finance and accounting system is available.", "green"],
    ["📧", "Email / Outlook", "Operational", "Email services are running normally.", "green"],
    ["🌐", "Network / Wi-Fi", "Monitoring", "Network performance is being monitored.", "yellow"],
    ["🗂️", "NARMS", "Operational", "Records management system is available.", "green"],
    ["🖨️", "Printers", "Partial Service", "Some shared printers may need ICT support.", "yellow"],
    ["📹", "Avigilon CCTV", "Operational", "Surveillance monitoring service is available.", "green"],
  ];

  return (
    <>
      <main className="hidden md:flex min-h-screen bg-gray-100">
        <div className="w-64 bg-blue-950 text-white min-h-screen p-5">
          <h2 className="text-2xl font-bold mb-8">MYGA ICT</h2>
          <ul className="space-y-4">
            <li><a href="/admin" className="block hover:bg-blue-800 p-3 rounded-xl">Admin Dashboard</a></li>
            <li><a href="/tickets" className="block hover:bg-blue-800 p-3 rounded-xl">Ticket Records</a></li>
            <li><a href="/status" className="block bg-blue-800 p-3 rounded-xl">System Status</a></li>
            <li><a href="/knowledge" className="block hover:bg-blue-800 p-3 rounded-xl">Knowledge Base</a></li>
            <li><button onClick={logoutUser} className="w-full text-left hover:bg-blue-800 p-3 rounded-xl">Logout</button></li>
          </ul>
        </div>

        <div className="flex-1 p-6">
          <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-lg mb-6">
            <h1 className="text-4xl font-bold">ICT System Status</h1>
            <p className="mt-2 text-lg">System availability and support workload.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[
              ["Total Tickets", tickets.length, "text-gray-900"],
              ["Pending", pending, "text-yellow-600"],
              ["In Progress", progress, "text-blue-600"],
              ["Resolved", resolved, "text-green-600"],
            ].map((c) => (
              <div key={c[0]} className="bg-white rounded-2xl shadow-md p-5">
                <p className="text-gray-500">{c[0]}</p>
                <h2 className={`text-3xl font-bold ${c[2]}`}>{c[1]}</h2>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
            <p className="text-gray-500">Critical Issues</p>
            <h2 className="text-3xl font-bold text-red-600">{critical}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {systems.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{s[0]} {s[1]}</h3>
                    <p className="text-gray-600 mt-2">{s[3]}</p>
                  </div>
                  <span className={`h-fit px-3 py-1 rounded-full text-sm font-bold ${s[4] === "green" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {s[2]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <main className="md:hidden min-h-screen bg-slate-50 pb-24">
        <AppHeader notificationCount={pending} />
        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
            <p className="text-lg font-semibold">ICT Monitoring</p>
            <h1 className="text-4xl font-black mt-4">System Status</h1>
            <p className="text-blue-100 mt-4">Monitor systems and workload.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {[
              ["Total", tickets.length],
              ["Pending", pending],
              ["Progress", progress],
              ["Critical", critical],
            ].map((c) => (
              <div key={c[0]} className="bg-white rounded-3xl shadow-md p-5">
                <p className="text-gray-500">{c[0]}</p>
                <h2 className="text-3xl font-black">{c[1]}</h2>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-extrabold mt-8 mb-4">Core Systems</h2>

          <div className="space-y-4">
            {systems.map((s, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-md p-5">
                <h3 className="font-extrabold text-lg">{s[0]} {s[1]}</h3>
                <p className="text-gray-600 mt-2">{s[3]}</p>
                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-bold ${s[4] === "green" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {s[2]}
                </span>
              </div>
            ))}
          </div>
        </section>
        <BottomNav />
      </main>
    </>
  );
}