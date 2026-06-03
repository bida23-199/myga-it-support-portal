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
import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";

export default function AdminPage() {
  const [username, setUsername] = useState("");
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

    setUsername(getUsername());

    const unsubscribe = onSnapshot(collection(db, "tickets"), (snapshot) => {
      const ticketData = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...item.data(),
        }))
        .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

      setTickets(ticketData);
    });

    return () => unsubscribe();
  }, []);

  const normalizeStatus = (value: string) =>
    (value || "").toLowerCase().trim();

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter(
          (ticket: any) =>
            normalizeStatus(ticket.status) === normalizeStatus(filter)
        );

  const pending = tickets.filter(
    (t) => normalizeStatus(t.status) === "pending"
  ).length;

  const progress = tickets.filter(
    (t) => normalizeStatus(t.status) === "in progress"
  ).length;

  const resolved = tickets.filter(
    (t) => normalizeStatus(t.status) === "resolved"
  ).length;

  const critical = tickets.filter(
    (t) => (t.priority || "").toLowerCase().trim() === "critical"
  ).length;

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
    <>
      <main className="hidden sm:flex min-h-screen bg-gray-100">
        <div className="w-64 bg-blue-950 text-white min-h-screen p-5">
          <h2 className="text-3xl font-black mb-10">MYGA ICT</h2>

          <ul className="space-y-4">
            <li>
              <a href="/admin" className="block bg-blue-800 p-3 rounded-2xl">
                Dashboard
              </a>
            </li>

            <li>
              <a
                href="/tickets"
                className="block hover:bg-blue-800 p-3 rounded-2xl transition"
              >
                Tickets
              </a>
            </li>

            <li>
              <a
                href="/status"
                className="block hover:bg-blue-800 p-3 rounded-2xl transition"
              >
                System Status
              </a>
            </li>

            <li>
              <a
                href="/knowledge"
                className="block hover:bg-blue-800 p-3 rounded-2xl transition"
              >
                Knowledge Base
              </a>
            </li>

            <li>
              <button
                onClick={logoutUser}
                className="w-full text-left hover:bg-red-700 p-3 rounded-2xl transition"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        <div className="flex-1 p-6">
          <div className="bg-gradient-to-r from-blue-700 to-blue-950 text-white rounded-3xl p-8 shadow-2xl mb-6">
            <p className="text-lg">Welcome back 👋</p>

            <h1 className="text-5xl font-black mt-2">{username}</h1>

            <p className="mt-4 text-blue-100">
              Live ticket dashboard with realtime updates, filtering, and newest tickets first.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-5 mb-8">
            <button
              onClick={() => setFilter("All")}
              className="bg-white p-6 rounded-3xl shadow-md text-left cursor-pointer hover:scale-105 hover:shadow-2xl hover:bg-blue-50 transition-all duration-300"
            >
              <p className="text-gray-500">Total Tickets</p>
              <h2 className="text-4xl font-black mt-2">{tickets.length}</h2>
            </button>

            <button
              onClick={() => setFilter("Pending")}
              className="bg-white p-6 rounded-3xl shadow-md text-left cursor-pointer hover:scale-105 hover:shadow-2xl hover:bg-yellow-50 transition-all duration-300"
            >
              <p className="text-gray-500">Pending</p>
              <h2 className="text-4xl font-black text-yellow-600 mt-2">
                {pending}
              </h2>
            </button>

            <button
              onClick={() => setFilter("In Progress")}
              className="bg-white p-6 rounded-3xl shadow-md text-left cursor-pointer hover:scale-105 hover:shadow-2xl hover:bg-blue-50 transition-all duration-300"
            >
              <p className="text-gray-500">In Progress</p>
              <h2 className="text-4xl font-black text-blue-600 mt-2">
                {progress}
              </h2>
            </button>

            <button
              onClick={() => setFilter("Resolved")}
              className="bg-white p-6 rounded-3xl shadow-md text-left cursor-pointer hover:scale-105 hover:shadow-2xl hover:bg-green-50 transition-all duration-300"
            >
              <p className="text-gray-500">Resolved</p>
              <h2 className="text-4xl font-black text-green-600 mt-2">
                {resolved}
              </h2>
            </button>

            <button
              onClick={() => setFilter("All")}
              className="bg-white p-6 rounded-3xl shadow-md text-left cursor-pointer hover:scale-105 hover:shadow-2xl hover:bg-red-50 transition-all duration-300"
            >
              <p className="text-gray-500">Critical</p>
              <h2 className="text-4xl font-black text-red-600 mt-2">
                {critical}
              </h2>
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black">{filter} Tickets</h2>

              <button
                onClick={() => setFilter("All")}
                className="bg-blue-100 text-blue-700 px-5 py-3 rounded-2xl font-bold hover:bg-blue-200 transition"
              >
                Show All
              </button>
            </div>

            <div className="space-y-5">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  No tickets available.
                </div>
              ) : (
                filteredTickets.map((ticket: any) => (
                  <div
                    key={ticket.id}
                    className="border rounded-3xl p-6 hover:shadow-2xl hover:border-blue-500 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black">
                          {ticket.issueType}
                        </h3>

                        <p className="text-gray-500 mt-2">
                          {ticket.fullName} • {ticket.department}
                        </p>

                        <p className="text-gray-500">
                          Office {ticket.officeNumber}
                        </p>

                        <p className="mt-4 text-gray-700">
                          {ticket.description}
                        </p>

                        <p className="text-sm text-gray-400 mt-4">
                          Submitted: {ticket.date}
                        </p>

                        <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-2xl text-sm">
                          Current Feedback:{" "}
                          {ticket.feedback || "No feedback provided yet."}
                        </div>
                      </div>

                      <div className="space-y-3 min-w-56">
                        <select
                          value={ticket.status || "Pending"}
                          onChange={(e) =>
                            updateStatus(ticket.id, e.target.value, ticket)
                          }
                          className="w-full border p-3 rounded-2xl"
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>

                        <select
                          value={ticket.priority || "Unassigned"}
                          onChange={(e) =>
                            updatePriority(ticket.id, e.target.value)
                          }
                          className="w-full border p-3 rounded-2xl"
                        >
                          <option>Unassigned</option>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                        </select>

                        <textarea
                          placeholder="Write feedback..."
                          defaultValue={ticket.feedback || ""}
                          onBlur={(e) =>
                            updateFeedback(ticket.id, e.target.value, ticket)
                          }
                          className="w-full border p-3 rounded-2xl"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <main className="sm:hidden min-h-screen bg-slate-50 pb-24">
        <AppHeader notificationCount={pending} />

        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
            <p className="text-lg font-semibold">Welcome back 👋</p>

            <h1 className="text-4xl font-black mt-4">{username}</h1>

            <p className="text-blue-100 mt-4">
              Newest tickets appear first. Use cards below to filter.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setFilter("All")}
              className="bg-white rounded-3xl shadow-md p-5 text-left hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <p className="text-gray-500">Total</p>
              <h2 className="text-3xl font-black">{tickets.length}</h2>
            </button>

            <button
              onClick={() => setFilter("Pending")}
              className="bg-white rounded-3xl shadow-md p-5 text-left hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-black text-yellow-600">{pending}</h2>
            </button>

            <button
              onClick={() => setFilter("In Progress")}
              className="bg-white rounded-3xl shadow-md p-5 text-left hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <p className="text-gray-500">Progress</p>
              <h2 className="text-3xl font-black text-blue-600">{progress}</h2>
            </button>

            <button
              onClick={() => setFilter("Resolved")}
              className="bg-white rounded-3xl shadow-md p-5 text-left hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <p className="text-gray-500">Resolved</p>
              <h2 className="text-3xl font-black text-green-600">{resolved}</h2>
            </button>
          </div>

          <h2 className="text-xl font-extrabold mt-8 mb-4">
            {filter} Tickets
          </h2>

          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-md p-6 text-gray-500">
                No tickets available.
              </div>
            ) : (
              filteredTickets.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-3xl shadow-md p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  <h3 className="font-extrabold text-xl">
                    {ticket.issueType}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {ticket.fullName} • {ticket.department}
                  </p>

                  <p className="text-gray-700 mt-4">{ticket.description}</p>

                  <select
                    value={ticket.status || "Pending"}
                    onChange={(e) =>
                      updateStatus(ticket.id, e.target.value, ticket)
                    }
                    className="w-full border p-3 rounded-2xl mt-4"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>

                  <select
                    value={ticket.priority || "Unassigned"}
                    onChange={(e) =>
                      updatePriority(ticket.id, e.target.value)
                    }
                    className="w-full border p-3 rounded-2xl mt-3"
                  >
                    <option>Unassigned</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>

                  <textarea
                    placeholder="Write feedback..."
                    defaultValue={ticket.feedback || ""}
                    onBlur={(e) =>
                      updateFeedback(ticket.id, e.target.value, ticket)
                    }
                    className="w-full border p-3 rounded-2xl mt-3"
                    rows={3}
                  />
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