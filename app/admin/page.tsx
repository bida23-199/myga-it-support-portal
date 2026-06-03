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

  const pending = tickets.filter((t) => t.status === "Pending").length;
  const progress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;

  return (
    <>
      {/* DESKTOP VIEW */}
      <main className="hidden sm:flex min-h-screen bg-gray-100">
        <div className="w-64 bg-blue-950 text-white min-h-screen p-5">
          <h2 className="text-2xl font-bold mb-8">MYGA ICT</h2>

          <ul className="space-y-4">
            <li>
              <a href="/admin" className="block bg-blue-800 p-3 rounded-xl">
                Admin Dashboard
              </a>
            </li>

            <li>
              <a href="/tickets" className="block hover:bg-blue-800 p-3 rounded-xl">
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
            <h1 className="text-4xl font-bold">ICT Admin Dashboard</h1>
            <p className="mt-2 text-lg">
              Welcome {username}. Monitor and manage realtime ICT support requests.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl shadow-md">
              <p className="text-gray-500">Total Tickets</p>
              <h2 className="text-3xl font-bold">{tickets.length}</h2>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md">
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-bold text-yellow-600">{pending}</h2>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md">
              <p className="text-gray-500">In Progress</p>
              <h2 className="text-3xl font-bold text-blue-600">{progress}</h2>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md">
              <p className="text-gray-500">Resolved</p>
              <h2 className="text-3xl font-bold text-green-600">{resolved}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Live Ticket Management
            </h2>

            {tickets.length === 0 ? (
              <p className="text-gray-500">No submitted tickets yet.</p>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket: any) => (
                  <div key={ticket.id} className="border rounded-2xl p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl">{ticket.issueType}</h3>

                        <p className="text-gray-500 mt-1">
                          {ticket.fullName} | {ticket.department}
                        </p>

                        <p className="text-gray-500">
                          Office {ticket.officeNumber}
                        </p>

                        <p className="text-gray-700 mt-3">
                          {ticket.description}
                        </p>

                        <p className="text-sm text-gray-400 mt-3">
                          Submitted: {ticket.date}
                        </p>

                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Feedback to Client
                          </label>

                          <textarea
                            defaultValue={ticket.feedback || ""}
                            placeholder="Write feedback or resolution note..."
                            onBlur={(e) =>
                              updateFeedback(ticket.id, e.target.value, ticket)
                            }
                            className="w-full border p-3 rounded-xl"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="space-y-3 min-w-52">
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            updateStatus(ticket.id, e.target.value, ticket)
                          }
                          className="w-full border p-3 rounded-xl"
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
                          className="w-full border p-3 rounded-xl"
                        >
                          <option>Unassigned</option>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PHONE VIEW ONLY */}
      <main className="sm:hidden min-h-screen bg-slate-50 pb-24">
        <AppHeader notificationCount={pending} />

        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
            <p className="text-lg font-semibold">Welcome, {username} 👋</p>

            <h1 className="text-4xl font-black mt-4 leading-tight">
              ICT Admin Dashboard
            </h1>

            <p className="text-blue-100 mt-4">
              Manage ICT tickets, update status, and respond to clients.
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
              <p className="text-gray-500">Resolved</p>
              <h2 className="text-3xl font-black text-green-600">{resolved}</h2>
            </div>
          </div>

          <h2 className="text-xl font-extrabold mt-8 mb-4">
            Live Ticket Management
          </h2>

          <div className="space-y-4">
            {tickets.map((ticket: any) => (
              <div key={ticket.id} className="bg-white rounded-3xl shadow-md p-5">
                <h3 className="font-extrabold text-lg">{ticket.issueType}</h3>

                <p className="text-sm text-gray-500 mt-2">
                  {ticket.fullName} • {ticket.department}
                </p>

                <p className="text-sm text-gray-500">
                  Office {ticket.officeNumber}
                </p>

                <p className="text-gray-700 mt-4">{ticket.description}</p>

                <select
                  value={ticket.status}
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
                  value={ticket.priority}
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
                  defaultValue={ticket.feedback || ""}
                  placeholder="Write feedback to client..."
                  onBlur={(e) =>
                    updateFeedback(ticket.id, e.target.value, ticket)
                  }
                  className="w-full border p-3 rounded-2xl mt-3"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </section>

        <BottomNav />
      </main>
    </>
  );
}