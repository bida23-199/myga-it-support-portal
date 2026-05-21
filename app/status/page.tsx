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
      const ticketData = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setTickets(ticketData);
    });

    return () => unsubscribe();
  }, []);

  const pending = tickets.filter((ticket: any) => ticket.status === "Pending").length;
  const progress = tickets.filter((ticket: any) => ticket.status === "In Progress").length;
  const resolved = tickets.filter((ticket: any) => ticket.status === "Resolved").length;
  const critical = tickets.filter((ticket: any) => ticket.priority === "Critical").length;

  const systems = [
    {
      icon: "💰",
      name: "GABS System",
      status: "Operational",
      colour: "green",
      description: "Finance and accounting system is available.",
    },
    {
      icon: "📧",
      name: "Email / Outlook",
      status: "Operational",
      colour: "green",
      description: "Email services are running normally.",
    },
    {
      icon: "🌐",
      name: "Network / Wi-Fi",
      status: "Monitoring",
      colour: "yellow",
      description: "Network performance is being monitored.",
    },
    {
      icon: "🗂️",
      name: "NARMS",
      status: "Operational",
      colour: "green",
      description: "Records management system is available.",
    },
    {
      icon: "🖨️",
      name: "Printers",
      status: "Partial Service",
      colour: "yellow",
      description: "Some shared printers may require ICT support.",
    },
    {
      icon: "📹",
      name: "Avigilon CCTV",
      status: "Operational",
      colour: "green",
      description: "Surveillance monitoring service is available.",
    },
  ];

  return (
    <>
      {/* DESKTOP VIEW */}
      <main className="hidden sm:flex min-h-screen bg-gray-100">
        <div className="w-64 bg-blue-950 text-white min-h-screen p-5">
          <h2 className="text-2xl font-bold mb-8">MYGA ICT</h2>

          <ul className="space-y-4">
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
              <a href="/status" className="block bg-blue-800 p-3 rounded-xl">
                System Status
              </a>
            </li>

            <li>
              <a href="/knowledge" className="block hover:bg-blue-800 p-3 rounded-xl">
                Knowledge Base
              </a>
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

        <div className="flex-1 p-6">
          <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-lg mb-6">
            <h1 className="text-4xl font-bold">ICT System Status</h1>
            <p className="mt-2 text-lg">
              Monitor ICT infrastructure and support workload.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-md p-5">
              <p className="text-gray-500">Total Tickets</p>
              <h2 className="text-3xl font-bold">{tickets.length}</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-5">
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-bold text-yellow-600">{pending}</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-5">
              <p className="text-gray-500">In Progress</p>
              <h2 className="text-3xl font-bold text-blue-600">{progress}</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-5">
              <p className="text-gray-500">Resolved</p>
              <h2 className="text-3xl font-bold text-green-600">{resolved}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Critical Issues</p>
                <h2 className="text-3xl font-bold text-red-600">{critical}</h2>
              </div>

              <div className="text-4xl">🚨</div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Core Systems</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {systems.map((system, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg">
                      {system.icon} {system.name}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      {system.description}
                    </p>
                  </div>

                  <span
                    className={`h-fit px-3 py-1 rounded-full text-sm font-bold ${
                      system.colour === "green"
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
        </div>
      </main>

      {/* PHONE VIEW */}
      <main className="sm:hidden min-h-screen bg-slate-50 pb-24">
        <AppHeader notificationCount={pending} />

        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
            <p className="text-lg font-semibold">ICT Monitoring</p>

            <h1 className="text-4xl font-black mt-4 leading-tight">
              System Status
            </h1>

            <p className="text-blue-100 mt-4">
              Monitor ICT systems and support workload.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-3xl shadow-md p-5">
              <p className="text-gray-500">Total</p>
              <h2 className="text-3xl font-black">{tickets.length}</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-5">
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-black text-yellow-600">{pending}</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-5">
              <p className="text-gray-500">Progress</p>
              <h2 className="text-3xl font-black text-blue-600">{progress}</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-5">
              <p className="text-gray-500">Critical</p>
              <h2 className="text-3xl font-black text-red-600">{critical}</h2>
            </div>
          </div>

          <h2 className="text-xl font-extrabold mt-8 mb-4">Core Systems</h2>

          <div className="space-y-4">
            {systems.map((system, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-md p-5">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl">
                    {system.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-extrabold text-lg text-slate-900">
                      {system.name}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      {system.description}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-bold ${
                        system.colour === "green"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {system.status}
                    </span>
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