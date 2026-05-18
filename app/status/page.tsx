"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { isLoggedIn, getUserRole } from "../../lib/auth";
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
      const ticketData = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setTickets(ticketData);
    });

    return () => unsubscribe();
  }, []);

  const pending = tickets.filter((t) => t.status === "Pending").length;
  const progress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;
  const critical = tickets.filter((t) => t.priority === "Critical").length;

  const systems = [
    {
      name: "GABS System",
      status: "Operational",
      color: "green",
      icon: "💰",
      description: "Finance and accounting system is available.",
    },
    {
      name: "Email / Outlook",
      status: "Operational",
      color: "green",
      icon: "📧",
      description: "Email services are running normally.",
    },
    {
      name: "Network / Wi-Fi",
      status: "Monitoring",
      color: "yellow",
      icon: "🌐",
      description: "Network performance is being monitored.",
    },
    {
      name: "NARMS",
      status: "Operational",
      color: "green",
      icon: "🗂️",
      description: "Records management system is available.",
    },
    {
      name: "Printers",
      status: "Partial Service",
      color: "yellow",
      icon: "🖨️",
      description: "Some shared printers may require ICT support.",
    },
    {
      name: "Avigilon CCTV",
      status: "Operational",
      color: "green",
      icon: "📹",
      description: "Surveillance monitoring service is available.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <AppHeader />

      <section className="px-4 py-5 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
          <p className="text-lg font-semibold">ICT Monitoring</p>

          <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
            System Status
          </h1>

          <p className="text-blue-100 mt-4 text-lg">
            Monitor system availability and ICT support workload.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-3xl shadow-md p-5">
            <p className="text-gray-500">Total Tickets</p>
            <h2 className="text-3xl font-black">{tickets.length}</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-5">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-black text-yellow-600">{pending}</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-5">
            <p className="text-gray-500">In Progress</p>
            <h2 className="text-3xl font-black text-blue-600">{progress}</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-5">
            <p className="text-gray-500">Resolved</p>
            <h2 className="text-3xl font-black text-green-600">{resolved}</h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-5 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Critical Issues</p>
              <h2 className="text-3xl font-black text-red-600">{critical}</h2>
            </div>

            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl">
              🚨
            </div>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 mt-8 mb-4">
          Core Systems
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systems.map((system, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-md p-5 border border-slate-100"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl">
                    {system.icon}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">
                      {system.name}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      {system.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    system.color === "green"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {system.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}