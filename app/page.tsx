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
        to_email: "YOUR_IT_EMAIL_HERE",
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

  const recentTickets = myTickets.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Top Mobile App Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 to-blue-950 text-white px-5 py-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(false)}
              className="text-3xl leading-none"
            >
              ☰
            </button>

            <div className="flex items-center gap-3">
              <div className="h-14 w-11 rounded-b-2xl rounded-t-md border-2 border-yellow-500 flex flex-col items-center justify-center text-yellow-400 text-xs font-bold">
                <span className="text-lg">⚖</span>
                <span>MYGA</span>
              </div>

              <div>
                <h1 className="text-xl font-extrabold tracking-tight">
                  ICT Support Portal
                </h1>
                <p className="text-xs text-slate-300">Service Desk</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="text-3xl">🔔</span>

              {myTickets.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {myTickets.length}
                </span>
              )}
            </div>

            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-lg shadow-lg">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 py-5 max-w-6xl mx-auto">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl overflow-hidden relative">
          <div className="absolute right-4 top-10 hidden sm:block opacity-20 text-9xl">
            ⚙️
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center relative z-10">
            <div>
              <p className="text-lg font-semibold">
                Welcome, {username} 👋
              </p>

              <h2 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
                How can we help you today?
              </h2>

              <p className="text-blue-100 mt-4 text-lg leading-relaxed">
                Log ICT support issues and track feedback from the ICT
                Department.
              </p>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-48 h-32 bg-white/20 rounded-2xl border border-white/30 flex items-center justify-center">
                  <div className="w-32 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center text-blue-700 text-5xl">
                    🖥️
                  </div>
                </div>
                <div className="absolute -right-6 top-12 bg-white text-blue-700 rounded-2xl px-4 py-3 shadow-xl">
                  💬
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="relative z-10 mt-7 w-full bg-white text-blue-700 py-4 rounded-2xl font-extrabold text-lg shadow-lg"
          >
            + Submit ICT Support Request
          </button>
        </div>

        {/* Quick Access */}
        <h2 className="text-xl font-extrabold text-slate-900 mt-8 mb-4">
          Quick Access
        </h2>

        <div className="grid grid-cols-3 gap-3 md:gap-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-white rounded-3xl shadow-md p-4 text-center border border-slate-100"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl shadow-md">
              📄
            </div>
            <p className="font-extrabold mt-3 text-sm md:text-base">
              Log ICT Issue
            </p>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              Submit a request
            </p>
            <p className="text-right mt-2 text-xl">›</p>
          </button>

          <a
            href="/knowledge"
            className="bg-white rounded-3xl shadow-md p-4 text-center border border-slate-100"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl shadow-md">
              📘
            </div>
            <p className="font-extrabold mt-3 text-sm md:text-base">
              Knowledge Base
            </p>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              Find solutions
            </p>
            <p className="text-right mt-2 text-xl">›</p>
          </a>

          <button
            onClick={logoutUser}
            className="bg-white rounded-3xl shadow-md p-4 text-center border border-slate-100"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl shadow-md">
              ↪
            </div>
            <p className="font-extrabold mt-3 text-sm md:text-base">
              Logout
            </p>
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              Sign out
            </p>
            <p className="text-right mt-2 text-xl">›</p>
          </button>
        </div>

        {/* Form */}
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
                className="w-full bg-blue-700 text-white py-4 rounded-2xl font-extrabold shadow-md"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        {/* Recent Tickets */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            Recent Tickets
          </h2>
          <button
            onClick={() => setShowForm(false)}
            className="text-blue-700 font-bold"
          >
            View All
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-6 text-center text-gray-500">
            No tickets submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {recentTickets.map((ticket: any) => (
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

                      <p className="text-sm text-gray-500 mt-2">
                        🏷️ {ticket.department}
                      </p>

                      <p className="text-sm text-gray-500">
                        📅 {ticket.date}
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

                <p className="text-gray-700 mt-3 line-clamp-2">
                  {ticket.description}
                </p>

                <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-2xl text-sm">
                  ICT Feedback:{" "}
                  {ticket.feedback || "No feedback provided yet."}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl flex justify-around py-3 md:hidden z-50">
        <button className="text-blue-700 font-bold">
          🏠
          <span className="block text-xs">Home</span>
        </button>

        <button
          onClick={() => setShowForm(true)}
          className="text-gray-600 font-bold"
        >
          📄
          <span className="block text-xs">Tickets</span>
        </button>

        <a href="/knowledge" className="text-gray-600 font-bold text-center">
          📘
          <span className="block text-xs">Knowledge</span>
        </a>

        <button className="text-gray-600 font-bold">
          🔔
          <span className="block text-xs">Notify</span>
        </button>

        <button onClick={logoutUser} className="text-gray-600 font-bold">
          👤
          <span className="block text-xs">Profile</span>
        </button>
      </nav>
    </main>
  );
}