"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  isLoggedIn,
  getUserRole,
  getUsername,
  logoutUser,
} from "../../lib/auth";

import { sendEmailNotification } from "../../lib/email";

export default function AdminPage() {
  const [menuOpen, setMenuOpen] = useState(false);
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

    const unsubscribe = onSnapshot(
      collection(db, "tickets"),
      (snapshot) => {
        const ticketData = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setTickets(ticketData);
      }
    );

    return () => unsubscribe();
  }, []);

  async function updateStatus(
    id: string,
    status: string,
    ticket: any
  ) {
    await updateDoc(doc(db, "tickets", id), {
      status,
    });

    await sendEmailNotification({
      to_email: ticket.email,
      to_name: ticket.fullName,
      from_name: "MYGA ICT Department",
      issue_type: ticket.issueType,
      status: status,
      priority: ticket.priority,
      description: ticket.description,
      feedback:
        ticket.feedback ||
        "Your ICT support ticket status has been updated.",
    });
  }

  async function updatePriority(
    id: string,
    priority: string
  ) {
    await updateDoc(doc(db, "tickets", id), {
      priority,
    });
  }

  async function updateFeedback(
    id: string,
    feedback: string,
    ticket: any
  ) {
    await updateDoc(doc(db, "tickets", id), {
      feedback,
    });

    await sendEmailNotification({
      to_email: ticket.email,
      to_name: ticket.fullName,
      from_name: "MYGA ICT Department",
      issue_type: ticket.issueType,
      status: ticket.status,
      priority: ticket.priority,
      description: ticket.description,
      feedback: feedback,
    });
  }

  return (
    <main className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <div className="w-64 bg-blue-950 text-white min-h-screen p-5">

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-full bg-blue-800 p-3 rounded-xl font-bold mb-4"
        >
          ☰ Menu
        </button>

        {menuOpen && (
          <ul className="space-y-3">

            <li>
              <a
                href="/admin"
                className="block bg-blue-800 p-3 rounded-xl"
              >
                Admin Dashboard
              </a>
            </li>

            <li>
              <a
                href="/tickets"
                className="block hover:bg-blue-800 p-3 rounded-xl"
              >
                Ticket Records
              </a>
            </li>

            <li>
              <a
                href="/status"
                className="block hover:bg-blue-800 p-3 rounded-xl"
              >
                System Status
              </a>
            </li>

            <li>
              <a
                href="/knowledge"
                className="block hover:bg-blue-800 p-3 rounded-xl"
              >
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
        )}

      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">

        <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-lg mb-6">

          <h1 className="text-4xl font-bold">
            ICT Admin Dashboard
          </h1>

          <p className="mt-2 text-lg">
            Welcome {username}. Monitor and manage realtime ICT support requests.
          </p>

        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-5 rounded-2xl shadow-md">
            <p className="text-gray-500">Total Tickets</p>
            <h2 className="text-3xl font-bold">
              {tickets.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-600">
              {
                tickets.filter(
                  (ticket: any) => ticket.status === "Pending"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md">
            <p className="text-gray-500">In Progress</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {
                tickets.filter(
                  (ticket: any) => ticket.status === "In Progress"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md">
            <p className="text-gray-500">Resolved</p>
            <h2 className="text-3xl font-bold text-green-600">
              {
                tickets.filter(
                  (ticket: any) => ticket.status === "Resolved"
                ).length
              }
            </h2>
          </div>

        </div>

        {/* Ticket Management */}
        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-2xl font-semibold mb-4">
            Live Ticket Management
          </h2>

          {tickets.length === 0 ? (

            <p className="text-gray-500">
              No submitted tickets yet.
            </p>

          ) : (

            <div className="space-y-4">

              {tickets.map((ticket: any) => (

                <div
                  key={ticket.id}
                  className="border rounded-2xl p-5"
                >

                  <div className="flex justify-between items-start gap-4">

                    <div className="flex-1">

                      <h3 className="font-bold text-xl">
                        {ticket.issueType}
                      </h3>

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
                          placeholder="Write feedback or resolution note for the client..."
                          onBlur={(e) =>
                            updateFeedback(
                              ticket.id,
                              e.target.value,
                              ticket
                            )
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
                          updateStatus(
                            ticket.id,
                            e.target.value,
                            ticket
                          )
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
                          updatePriority(
                            ticket.id,
                            e.target.value
                          )
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
  );
}