"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import {
  isLoggedIn,
  getUserRole,
  getUsername,
  logoutUser,
} from "../../lib/auth";
import { sendEmailNotification } from "../../lib/email";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

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

    setUsername(getUsername());

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

  const filteredTickets =
    selectedFilter === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.status === selectedFilter);

  async function updateStatus(id: string, status: string, ticket: any) {
    try {
      await updateDoc(doc(db, "tickets", id), { status });

      await sendEmailNotification({
        to_email: ticket.email,
        to_name: ticket.fullName,
        from_name: "MYGA ICT Department",
        issue_type: ticket.issueType,
        status,
        priority: ticket.priority,
        description: ticket.description,
        feedback:
          ticket.feedback ||
          "Your ICT support ticket status has been updated.",
      });

      alert("Status updated and email sent.");
    } catch (error) {
      console.error(error);
      alert("Status updated.");
    }
  }

  async function updatePriority(id: string, priority: string) {
    await updateDoc(doc(db, "tickets", id), { priority });
  }

  async function updateFeedback(id: string, feedback: string, ticket: any) {
    try {
      await updateDoc(doc(db, "tickets", id), { feedback });

      await sendEmailNotification({
        to_email: ticket.email,
        to_name: ticket.fullName,
        from_name: "MYGA ICT Department",
        issue_type: ticket.issueType,
        status: ticket.status,
        priority: ticket.priority,
        description: ticket.description,
        feedback,
      });

      alert("Feedback saved and email sent.");
    } catch (error) {
      console.error(error);
      alert("Feedback saved.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 to-blue-950 text-white px-5 py-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-3xl leading-none">
              ☰
            </a>

            <div className="flex items-center gap-3">
              <div className="h-14 w-11 rounded-b-2xl rounded-t-md border-2 border-yellow-500 flex flex-col items-center justify-center text-yellow-400 text-xs font-bold">
                <span className="text-lg">⚖</span>
                <span>MYGA</span>
              </div>

              <div>
                <h1 className="text-xl font-extrabold tracking-tight">
                  ICT Admin Portal
                </h1>
                <p className="text-xs text-slate-300">Service Desk Control</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="text-3xl">🔔</span>

              {pending > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {pending}
                </span>
              )}
            </div>

            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-lg shadow-lg">
              {username ? username.charAt(0).toUpperCase() : "A"}
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 py-5 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
          <p className="text-lg font-semibold">Welcome, {username} 👋</p>

          <h2 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
            Manage ICT support requests
          </h2>

          <p className="text-blue-100 mt-4 text-lg leading-relaxed">
            Monitor tickets, update priorities, respond to clients, and track
            support progress in realtime.
          </p>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 mt-8 mb-4">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setSelectedFilter("All")}
            className="bg-white rounded-3xl shadow-md p-5 text-left border border-slate-100"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl">
              📊
            </div>
            <p className="text-gray-500 mt-4">Total Tickets</p>
            <h3 className="text-4xl font-black text-slate-900">
              {tickets.length}
            </h3>
          </button>

          <button
            onClick={() => setSelectedFilter("Pending")}
            className="bg-white rounded-3xl shadow-md p-5 text-left border border-slate-100"
          >
            <div className="w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl">
              ⏳
            </div>
            <p className="text-gray-500 mt-4">Pending</p>
            <h3 className="text-4xl font-black text-yellow-600">{pending}</h3>
          </button>

          <button
            onClick={() => setSelectedFilter("In Progress")}
            className="bg-white rounded-3xl shadow-md p-5 text-left border border-slate-100"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl">
              🔧
            </div>
            <p className="text-gray-500 mt-4">In Progress</p>
            <h3 className="text-4xl font-black text-blue-600">{progress}</h3>
          </button>

          <button
            onClick={() => setSelectedFilter("Resolved")}
            className="bg-white rounded-3xl shadow-md p-5 text-left border border-slate-100"
          >
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl">
              ✅
            </div>
            <p className="text-gray-500 mt-4">Resolved</p>
            <h3 className="text-4xl font-black text-green-600">{resolved}</h3>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-5 mt-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Critical Issues</p>
              <h3 className="text-3xl font-black text-red-600">{critical}</h3>
            </div>

            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl">
              🚨
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            Live Ticket Management
          </h2>

          <span className="text-blue-700 font-bold">{selectedFilter}</span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-6 text-center text-gray-500">
            No tickets available.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket: any) => (
              <div
                key={ticket.id}
                className="bg-white rounded-3xl shadow-md p-5 border border-slate-100"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex gap-3">
                    <span
                      className={`mt-2 h-3 w-3 rounded-full ${
                        ticket.status === "Resolved"
                          ? "bg-green-500"
                          : ticket.status === "In Progress"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    />

                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900">
                        {ticket.issueType}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {ticket.fullName} • {ticket.department}
                      </p>

                      <p className="text-sm text-gray-500">
                        Office {ticket.officeNumber}
                      </p>
                    </div>
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

                <p className="text-xs text-gray-400 mt-3">
                  Submitted: {ticket.date}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      updateStatus(ticket.id, e.target.value, ticket)
                    }
                    className="w-full border border-slate-200 p-3 rounded-2xl"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>

                  <select
                    value={ticket.priority}
                    onChange={(e) =>
                      updatePriority(ticket.id, e.target.value)
                    }
                    className="w-full border border-slate-200 p-3 rounded-2xl"
                  >
                    <option>Unassigned</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Feedback to Client
                  </label>

                  <textarea
                    defaultValue={ticket.feedback || ""}
                    placeholder="Write feedback or resolution note..."
                    onBlur={(e) =>
                      updateFeedback(ticket.id, e.target.value, ticket)
                    }
                    className="w-full border border-slate-200 p-3 rounded-2xl"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl flex justify-around py-3 md:hidden z-50">
        <a href="/admin" className="text-blue-700 font-bold text-center">
          🏠
          <span className="block text-xs">Home</span>
        </a>

        <a href="/tickets" className="text-gray-600 font-bold text-center">
          📄
          <span className="block text-xs">Tickets</span>
        </a>

        <a href="/status" className="text-gray-600 font-bold text-center">
          📡
          <span className="block text-xs">Status</span>
        </a>

        <a href="/knowledge" className="text-gray-600 font-bold text-center">
          📘
          <span className="block text-xs">Knowledge</span>
        </a>

        <button onClick={logoutUser} className="text-gray-600 font-bold">
          👤
          <span className="block text-xs">Logout</span>
        </button>
      </nav>
    </main>
  );
}