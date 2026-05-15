"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { isLoggedIn, getUserRole, logoutUser } from "../../lib/auth";
import { collection, onSnapshot } from "firebase/firestore";

export default function StatusPage() {
  const [menuOpen, setMenuOpen] = useState(false);
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
  const critical = tickets.filter((t) => t.priority === "Critical").length;

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
            <li><a href="/admin" className="block hover:bg-blue-800 p-3 rounded-xl">Admin Dashboard</a></li>
            <li><a href="/tickets" className="block hover:bg-blue-800 p-3 rounded-xl">Ticket Records</a></li>
            <li><a href="/status" className="block bg-blue-800 p-3 rounded-xl">System Status</a></li>
            <li><a href="/knowledge" className="block hover:bg-blue-800 p-3 rounded-xl">Knowledge Base</a></li>
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
          <h1 className="text-4xl font-bold">ICT System Status</h1>
          <p className="mt-2 text-lg">System availability and support workload</p>
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
            <p className="text-gray-500">Critical</p>
            <h2 className="text-3xl font-bold text-red-600">{critical}</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-100 text-green-800 p-5 rounded-2xl shadow-md">
            GABS System - Operational
          </div>

          <div className="bg-green-100 text-green-800 p-5 rounded-2xl shadow-md">
            Email / Outlook - Operational
          </div>

          <div className="bg-yellow-100 text-yellow-800 p-5 rounded-2xl shadow-md">
            Network / Wi-Fi - Monitoring
          </div>

          <div className="bg-green-100 text-green-800 p-5 rounded-2xl shadow-md">
            NARMS - Operational
          </div>

          <div className="bg-yellow-100 text-yellow-800 p-5 rounded-2xl shadow-md">
            Printers - Partial Service
          </div>

          <div className="bg-green-100 text-green-800 p-5 rounded-2xl shadow-md">
            Avigilon CCTV - Operational
          </div>
        </div>
      </div>
    </main>
  );
}