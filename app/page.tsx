"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { isLoggedIn, getUsername, logoutUser } from "../lib/auth";
import { sendEmailNotification } from "../lib/email";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

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

  return (
    <main className="min-h-screen bg-slate-100 pb-24">
      {/* Mobile App Header */}
      <div className="bg-slate-950 text-white px-5 py-5 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button className="text-3xl">☰</button>

          <div>
            <h1 className="text-lg font-bold">ICT Support Portal</h1>
            <p className="text-xs text-slate-300">MYGA Service Desk</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-2xl">🔔</span>
            {myTickets.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {myTickets.length}
              </span>
            )}
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </div>

      <div className="p-5 max-w-5xl mx-auto">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-900 text-white rounded-3xl p-6 shadow-xl">
          <p className="text-lg font-semibold">Welcome, {username} 👋</p>

          <h2 className="text-4xl font-extrabold mt-4 leading-tight">
            How can we help you today?
          </h2>

          <p className="text-blue-100 mt-4 text-lg">
            Log ICT support issues and track feedback from the ICT Department.
          </p>

          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-6 w-full bg-white text-blue-700 py-4 rounded-2xl font-bold shadow-md"
          >
            + Submit ICT Support Request
          </button>
        </div>

        {/* Quick Access */}
        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          Quick Access
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-white rounded-3xl shadow-md p-4 text-center"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">
              📄
            </div>
            <p className="font-bold mt-3 text-sm">Log Issue</p>
            <p className="text-xs text-gray-500 mt-1">New request</p>
          </button>

          <a
            href="/knowledge"
            className="bg-white rounded-3xl shadow-md p-4 text-center"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl">
              📘
            </div>
            <p className="font-bold mt-3 text-sm">Knowledge</p>
            <p className="text-xs text-gray-500 mt-1">Guides</p>
          </a>

          <button
            onClick={logoutUser}
            className="bg-white rounded-3xl shadow-md p-4 text-center"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl">
              ↪
            </div>
            <p className="font-bold mt-3 text-sm">Logout</p>
            <p className="text-xs text-gray-500 mt-1">Sign out</p>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-lg p-5 mt-8">
            <h2 className="text-2xl font-bold mb-5">
              Submit ICT Support Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-4 rounded-2xl"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-4 rounded-2xl"
              />

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border p-4 rounded-2xl"
              >
                <option value="">Select Department</option>
                <option>Administration</option>
                <option>Accounts</option>
                <option>Procurement</option>
                <option>Human Resources</option>
                <option>ICT Department</option>
                <option>Internal Audit</option>
                <option>Registry</option>
                <option>Youth Development</option>
                <option>Gender Affairs</option>
                <option>Corporate Services</option>
                <option>Finance</option>
                <option>Transport & Logistics</option>
                <option>Planning</option>
                <option>Legal Services</option>
                <option>Office of the Permanent Secretary</option>
                <option>Minister's Office</option>
              </select>

              <input
                type="text"
                name="officeNumber"
                placeholder="Office Number"
                value={formData.officeNumber}
                onChange={handleChange}
                className="w-full border p-4 rounded-2xl"
              />

              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full border p-4 rounded-2xl"
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
                className="w-full border p-4 rounded-2xl"
              />

              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        {/* Recent Tickets */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Tickets</h2>
          <p className="text-blue-700 font-semibold">View All</p>
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
                className="bg-white rounded-3xl shadow-md p-5"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {ticket.issueType}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      {ticket.department} • Office {ticket.officeNumber}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
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

                <p className="text-gray-700 mt-3 line-clamp-2">
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
      </div>

      {/* Bottom Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t flex justify-around py-3 md:hidden">
        <button className="text-blue-700 font-semibold">
          🏠
          <span className="block text-xs">Home</span>
        </button>

        <button
          onClick={() => setShowForm(true)}
          className="text-gray-600 font-semibold"
        >
          📄
          <span className="block text-xs">Ticket</span>
        </button>

        <a href="/knowledge" className="text-gray-600 font-semibold text-center">
          📘
          <span className="block text-xs">Knowledge</span>
        </a>

        <button onClick={logoutUser} className="text-gray-600 font-semibold">
          👤
          <span className="block text-xs">Logout</span>
        </button>
      </div>
    </main>
  );
}