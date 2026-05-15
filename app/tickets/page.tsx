"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { isLoggedIn, getUserRole, logoutUser } from "../../lib/auth";
import { collection, onSnapshot } from "firebase/firestore";

export default function TicketsPage() {
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
            <li><a href="/tickets" className="block bg-blue-800 p-3 rounded-xl">Ticket Records</a></li>
            <li><a href="/status" className="block hover:bg-blue-800 p-3 rounded-xl">System Status</a></li>
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
          <h1 className="text-4xl font-bold">IT Ticket Records</h1>
          <p className="mt-2 text-lg">All submitted ICT support requests</p>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">No ticket records available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket: any) => (
              <div key={ticket.id} className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold">{ticket.issueType}</h2>
                <p className="text-gray-500 mt-1">
                  {ticket.fullName} | {ticket.department} | Office {ticket.officeNumber}
                </p>
                <p className="text-gray-500">
                  Status: {ticket.status} | Priority: {ticket.priority}
                </p>
                <p className="mt-3 text-gray-700">{ticket.description}</p>
                <p className="text-sm text-gray-400 mt-2">Submitted: {ticket.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}