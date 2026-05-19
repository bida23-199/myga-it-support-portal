"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { isLoggedIn, getUserRole, logoutUser } from "../../lib/auth";
import { collection, onSnapshot } from "firebase/firestore";
import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");

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

  const filteredTickets =
    filter === "All" ? tickets : tickets.filter((t) => t.status === filter);

  const counts = {
    all: tickets.length,
    pending: tickets.filter((t) => t.status === "Pending").length,
    progress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  };

  return (
    <>
      <main className="hidden md:flex min-h-screen bg-gray-100">
        <div className="w-64 bg-blue-950 text-white min-h-screen p-5">
          <h2 className="text-2xl font-bold mb-8">MYGA ICT</h2>
          <ul className="space-y-4">
            <li><a href="/admin" className="block hover:bg-blue-800 p-3 rounded-xl">Admin Dashboard</a></li>
            <li><a href="/tickets" className="block bg-blue-800 p-3 rounded-xl">Ticket Records</a></li>
            <li><a href="/status" className="block hover:bg-blue-800 p-3 rounded-xl">System Status</a></li>
            <li><a href="/knowledge" className="block hover:bg-blue-800 p-3 rounded-xl">Knowledge Base</a></li>
            <li><button onClick={logoutUser} className="w-full text-left hover:bg-blue-800 p-3 rounded-xl">Logout</button></li>
          </ul>
        </div>

        <div className="flex-1 p-6">
          <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-lg mb-6">
            <h1 className="text-4xl font-bold">IT Ticket Records</h1>
            <p className="mt-2 text-lg">All submitted ICT support requests.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[
              ["All", counts.all, "text-gray-900"],
              ["Pending", counts.pending, "text-yellow-600"],
              ["In Progress", counts.progress, "text-blue-600"],
              ["Resolved", counts.resolved, "text-green-600"],
            ].map((c) => (
              <button key={c[0]} onClick={() => setFilter(c[0] as string)} className="bg-white p-5 rounded-2xl shadow-md text-left">
                <p className="text-gray-500">{c[0]}</p>
                <h2 className={`text-3xl font-bold ${c[2]}`}>{c[1]}</h2>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 shadow-md text-gray-500">No ticket records available.</div>
            ) : (
              filteredTickets.map((ticket: any) => (
                <div key={ticket.id} className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-bold">{ticket.issueType}</h2>
                  <p className="text-gray-500 mt-1">{ticket.fullName} | {ticket.department} | Office {ticket.officeNumber}</p>
                  <p className="text-gray-500">Status: {ticket.status} | Priority: {ticket.priority}</p>
                  <p className="mt-3 text-gray-700">{ticket.description}</p>
                  <div className="mt-3 bg-blue-50 text-blue-800 p-3 rounded-xl text-sm">
                    Feedback: {ticket.feedback || "No feedback yet."}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Submitted: {ticket.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <main className="md:hidden min-h-screen bg-slate-50 pb-24">
        <AppHeader notificationCount={counts.pending} />
        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
            <p className="text-lg font-semibold">IT Officer View</p>
            <h1 className="text-4xl font-black mt-4">Ticket Records</h1>
            <p className="text-blue-100 mt-4">All ICT requests in realtime.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {[
              ["All", counts.all],
              ["Pending", counts.pending],
              ["In Progress", counts.progress],
              ["Resolved", counts.resolved],
            ].map((c) => (
              <button key={c[0]} onClick={() => setFilter(c[0] as string)} className="bg-white rounded-3xl shadow-md p-5 text-left">
                <p className="text-gray-500">{c[0]}</p>
                <h2 className="text-3xl font-black">{c[1]}</h2>
              </button>
            ))}
          </div>

          <h2 className="text-xl font-extrabold mt-8 mb-4">{filter} Tickets</h2>

          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 shadow-md text-gray-500">No records available.</div>
            ) : (
              filteredTickets.map((ticket: any) => (
                <div key={ticket.id} className="bg-white rounded-3xl shadow-md p-5">
                  <h3 className="font-extrabold text-lg">{ticket.issueType}</h3>
                  <p className="text-sm text-gray-500 mt-2">{ticket.fullName} • {ticket.department}</p>
                  <p className="text-sm text-gray-500">Office {ticket.officeNumber}</p>
                  <p className="mt-3">{ticket.description}</p>
                  <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">{ticket.status}</span>
                </div>
              ))
            )}
          </div>
        </section>
        <BottomNav />
      </main>
    </>
  );
}