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
      : tickets.filter((ticket: any) => ticket.status === filter);

  const pending = tickets.filter((ticket: any) => ticket.status === "Pending").length;
  const progress = tickets.filter((ticket: any) => ticket.status === "In Progress").length;
  const resolved = tickets.filter((ticket: any) => ticket.status === "Resolved").length;

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
              <a href="/tickets" className="block bg-blue-800 p-3 rounded-xl">
                Ticket Records
              </a>
            </li>

            <li>
              <a href="/status" className="block hover:bg-blue-800 p-3 rounded-xl">
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
            <h1 className="text-4xl font-bold">IT Ticket Records</h1>
            <p className="mt-2 text-lg">
              View all submitted ICT support requests.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setFilter("All")}
              className="bg-white p-5 rounded-2xl shadow-md text-left"
            >
              <p className="text-gray-500">All Tickets</p>
              <h2 className="text-3xl font-bold">{tickets.length}</h2>
            </button>

            <button
              onClick={() => setFilter("Pending")}
              className="bg-white p-5 rounded-2xl shadow-md text-left"
            >
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-bold text-yellow-600">{pending}</h2>
            </button>

            <button
              onClick={() => setFilter("In Progress")}
              className="bg-white p-5 rounded-2xl shadow-md text-left"
            >
              <p className="text-gray-500">In Progress</p>
              <h2 className="text-3xl font-bold text-blue-600">{progress}</h2>
            </button>

            <button
              onClick={() => setFilter("Resolved")}
              className="bg-white p-5 rounded-2xl shadow-md text-left"
            >
              <p className="text-gray-500">Resolved</p>
              <h2 className="text-3xl font-bold text-green-600">{resolved}</h2>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {filter} Ticket Records
            </h2>

            {filteredTickets.length === 0 ? (
              <p className="text-gray-500">No ticket records available.</p>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket: any) => (
                  <div key={ticket.id} className="border rounded-xl p-4">
                    <h3 className="font-bold text-lg">{ticket.issueType}</h3>

                    <p className="text-gray-500 mt-1">
                      {ticket.fullName} | {ticket.department} | Office{" "}
                      {ticket.officeNumber}
                    </p>

                    <p className="text-gray-500">
                      Status: {ticket.status} | Priority: {ticket.priority}
                    </p>

                    <p className="mt-3 text-gray-700">{ticket.description}</p>

                    <div className="mt-3 bg-blue-50 text-blue-800 p-3 rounded-xl text-sm">
                      Feedback: {ticket.feedback || "No feedback provided yet."}
                    </div>

                    <p className="text-sm text-gray-400 mt-2">
                      Submitted: {ticket.date}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PHONE VIEW */}
      <main className="sm:hidden min-h-screen bg-slate-50 pb-24">
        <AppHeader notificationCount={pending} />

        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
            <p className="text-lg font-semibold">IT Officer View</p>

            <h1 className="text-4xl font-black mt-4 leading-tight">
              Ticket Records
            </h1>

            <p className="text-blue-100 mt-4">
              View submitted ICT support requests in realtime.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setFilter("All")}
              className="bg-white rounded-3xl shadow-md p-5 text-left"
            >
              <p className="text-gray-500">All</p>
              <h2 className="text-3xl font-black">{tickets.length}</h2>
            </button>

            <button
              onClick={() => setFilter("Pending")}
              className="bg-white rounded-3xl shadow-md p-5 text-left"
            >
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-black text-yellow-600">{pending}</h2>
            </button>

            <button
              onClick={() => setFilter("In Progress")}
              className="bg-white rounded-3xl shadow-md p-5 text-left"
            >
              <p className="text-gray-500">Progress</p>
              <h2 className="text-3xl font-black text-blue-600">{progress}</h2>
            </button>

            <button
              onClick={() => setFilter("Resolved")}
              className="bg-white rounded-3xl shadow-md p-5 text-left"
            >
              <p className="text-gray-500">Resolved</p>
              <h2 className="text-3xl font-black text-green-600">{resolved}</h2>
            </button>
          </div>

          <h2 className="text-xl font-extrabold mt-8 mb-4">
            {filter} Tickets
          </h2>

          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-md p-6 text-gray-500">
              No records available.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket: any) => (
                <div key={ticket.id} className="bg-white rounded-3xl shadow-md p-5">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-lg">
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
                      className={`h-fit px-3 py-1 rounded-full text-sm font-bold ${
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
    </>
  );
}