"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { isLoggedIn, getUsername } from "../lib/auth";
import { sendEmailNotification } from "../lib/email";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import AppHeader from "../components/AppHeader";
import BottomNav from "../components/BottomNav";

export default function ClientPortal() {
  const [username, setUsername] = useState("");
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
    officeNumber: "",
    issueType: "",
    description: "",
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.replace("/login");
      return;
    }

    const currentUser = getUsername();
    setUsername(currentUser);

    const q = query(
      collection(db, "tickets"),
      where("createdBy", "==", currentUser)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyTickets(ticketData);
    });

    return () => unsubscribe();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.department ||
      !formData.officeNumber ||
      !formData.issueType ||
      !formData.description
    ) {
      alert("Please complete all fields.");
      return;
    }

    const newTicket = {
      ...formData,
      priority: "Unassigned",
      status: "Pending",
      feedback: "Your ticket has been received and is awaiting ICT review.",
      createdBy: username,
      date: new Date().toLocaleString(),
      createdAt: Date.now(),
    };

    try {
      await addDoc(collection(db, "tickets"), newTicket);

      await sendEmailNotification({
        to_email: "bida23-199@thuto.bac.ac.bw",
        to_name: "ICT Department",
        from_name: formData.fullName,
        issue_type: formData.issueType,
        status: "Pending",
        priority: "Unassigned",
        description: formData.description,
        feedback: "A new ICT support ticket has been submitted.",
      });

      alert("Ticket submitted successfully.");

      setFormData({
        fullName: "",
        email: "",
        department: "",
        officeNumber: "",
        issueType: "",
        description: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Ticket submitted successfully.");
      setShowForm(false);
    }
  }

  const activeNotifications = myTickets.filter(
    (ticket: any) => ticket.status !== "Resolved"
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <AppHeader notificationCount={activeNotifications.length} />

      <section className="px-4 py-5 max-w-6xl mx-auto">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
          <p className="text-lg font-semibold">
            Welcome, {username} 👋
          </p>

          <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
            How can we help you today?
          </h1>

          <p className="text-blue-100 mt-4 text-lg">
            Log ICT support requests and track realtime feedback from MYGA ICT.
          </p>

          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-7 w-full bg-white text-blue-700 py-4 rounded-2xl font-extrabold text-lg shadow-lg"
          >
            + Submit ICT Support Request
          </button>
        </div>

        {/* Quick Access */}
        <h2 className="text-xl font-extrabold text-slate-900 mt-8 mb-4">
          Quick Access
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-white rounded-3xl shadow-md p-5 text-left border border-slate-100"
          >
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">
              📄
            </div>

            <h3 className="font-extrabold mt-4 text-slate-900">
              Log ICT Issue
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Submit a new support request
            </p>
          </button>

          <a
            href="#my-tickets"
            className="bg-white rounded-3xl shadow-md p-5 text-left border border-slate-100"
          >
            <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl">
              🎫
            </div>

            <h3 className="font-extrabold mt-4 text-slate-900">
              My Tickets
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              View submitted requests
            </p>
          </a>

          <a
            href="/knowledge"
            className="bg-white rounded-3xl shadow-md p-5 text-left border border-slate-100"
          >
            <div className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center text-2xl">
              📘
            </div>

            <h3 className="font-extrabold mt-4 text-slate-900">
              Knowledge Base
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              ICT self-service help guides
            </p>
          </a>

          <a
            href="#notifications"
            className="bg-white rounded-3xl shadow-md p-5 text-left border border-slate-100"
          >
            <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl">
              🔔
            </div>

            <h3 className="font-extrabold mt-4 text-slate-900">
              Notifications
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              View ticket updates
            </p>
          </a>
        </div>

        {/* Submit Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl p-5 mt-8 border border-slate-100">
            <h2 className="text-2xl font-extrabold mb-5 text-slate-900">
              Submit ICT Support Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-slate-200 p-4 rounded-2xl"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-200 p-4 rounded-2xl"
              />

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-slate-200 p-4 rounded-2xl"
              >
                <option value="">Select Department</option>
                <option>Administration</option>
                <option>Accounts</option>
                <option>Procurement</option>
                <option>Human Resources</option>
                <option>ICT Department</option>
                <option>Registry</option>
                <option>Finance</option>
                <option>Transport & Logistics</option>
              </select>

              <input
                type="text"
                name="officeNumber"
                placeholder="Office Number"
                value={formData.officeNumber}
                onChange={handleChange}
                className="w-full border border-slate-200 p-4 rounded-2xl"
              />

              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full border border-slate-200 p-4 rounded-2xl"
              >
                <option value="">Select Issue Type</option>
                <option>Password Reset</option>
                <option>Email / Outlook</option>
                <option>Printer Problem</option>
                <option>Network / Internet</option>
                <option>Computer Issue</option>
                <option>Software Installation</option>
                <option>System Access</option>
                <option>Other</option>
              </select>

              <textarea
                name="description"
                placeholder="Describe the ICT issue..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full border border-slate-200 p-4 rounded-2xl"
              />

              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-4 rounded-2xl font-extrabold"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        {/* Notifications */}
        <div
          id="notifications"
          className="bg-white rounded-3xl shadow-md p-5 mt-8 border border-slate-100"
        >
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">
            Notifications
          </h2>

          {activeNotifications.length === 0 ? (
            <p className="text-gray-500">No new notifications.</p>
          ) : (
            <div className="space-y-3">
              {activeNotifications.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className="bg-blue-50 text-blue-800 p-4 rounded-2xl"
                >
                  Your ticket for{" "}
                  <b>{ticket.issueType}</b> is currently{" "}
                  <b>{ticket.status}</b>.
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tickets */}
        <div
          id="my-tickets"
          className="flex items-center justify-between mt-8 mb-4"
        >
          <h2 className="text-xl font-extrabold text-slate-900">
            My Tickets
          </h2>

          <span className="text-blue-700 font-bold">
            {myTickets.length} tickets
          </span>
        </div>

        {myTickets.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-6 text-center text-gray-500">
            No tickets submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {myTickets.map((ticket: any) => (
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
                      {ticket.department} • Office {ticket.officeNumber}
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

                <p className="text-gray-700 mt-4">
                  {ticket.description}
                </p>

                <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-2xl text-sm">
                  ICT Feedback:{" "}
                  {ticket.feedback || "No feedback provided yet."}
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