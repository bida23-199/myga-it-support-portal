"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { isLoggedIn, getUserRole } from "../../lib/auth";
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
      const ticketData = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setTickets(ticketData);
    });

    return () => unsubscribe();
  }, []);

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filter);

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <AppHeader />

      <section className="px-4 py-5 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
          <p className="text-lg font-semibold">IT Officer View</p>

          <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
            Ticket Records
          </h1>

          <p className="text-blue-100 mt-4 text-lg">
            View all submitted ICT support requests in realtime.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <button
            onClick={() => setFilter("All")}
            className="bg-white rounded-3xl shadow-md p-5 text-left"
          >
            <p className="text-gray-500">All Tickets</p>
            <h2 className="text-3xl font-black">{tickets.length}</h2>
          </button>

          <button
            onClick={() => setFilter("Pending")}
            className="bg-white rounded-3xl shadow-md p-5 text-left"
          >
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-black text-yellow-600">
              {tickets.filter((t) => t.status === "Pending").length}
            </h2>
          </button>

          <button
            onClick={() => setFilter("In Progress")}
            className="bg-white rounded-3xl shadow-md p-5 text-left"
          >
            <p className="text-gray-500">In Progress</p>
            <h2 className="text-3xl font-black text-blue-600">
              {tickets.filter((t) => t.status === "In Progress").length}
            </h2>
          </button>

          <button
            onClick={() => setFilter("Resolved")}
            className="bg-white rounded-3xl shadow-md p-5 text-left"
          >
            <p className="text-gray-500">Resolved</p>
            <h2 className="text-3xl font-black text-green-600">
              {tickets.filter((t) => t.status === "Resolved").length}
            </h2>
          </button>
        </div>

        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            {filter} Tickets
          </h2>

          <span className="text-blue-700 font-bold">
            {filteredTickets.length} records
          </span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-6 text-center text-gray-500">
            No ticket records available.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket: any) => (
              <div
                key={ticket.id}
                className="bg-white rounded-3xl shadow-md p-5 border border-slate-100"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">
                      {ticket.issueType}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      {ticket.fullName} • {ticket.department}
                    </p>

                    <p className="text-sm text-gray-500">
                      Office {ticket.officeNumber}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      ticket.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="text-gray-700 mt-4">{ticket.description}</p>

                <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-2xl text-sm">
                  Feedback: {ticket.feedback || "No feedback provided yet."}
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Submitted: {ticket.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}