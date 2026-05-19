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

  const activeNotifications = myTickets.filter(
    (ticket: any) => ticket.status !== "Resolved"
  );

  return (
    <>
      {/* DESKTOP VIEW ONLY */}
      <main className="hidden md:flex min-h-screen bg-gray-100">
        <div className="w-64 bg-blue-950 text-white min-h-screen p-5">
          <h2 className="text-2xl font-bold mb-8">MYGA ICT</h2>

          <ul className="space-y-4">
            <li>
              <a href="/" className="block bg-blue-800 p-3 rounded-xl">
                Log ICT Issue
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
        </div>

        <div className="flex-1 p-6">
          <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-lg mb-6">
            <h1 className="text-4xl font-bold">ICT Client Support Portal</h1>
            <p className="mt-2 text-lg">
              Welcome {username}. Log ICT support issues and track feedback from
              the ICT Department.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Submit ICT Support Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
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
                className="w-full border p-3 rounded-xl"
              />

              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
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
                className="w-full border p-3 rounded-xl"
              />

              <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800"
              >
                Submit Ticket
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4">
              My Submitted Tickets & Feedback
            </h2>

            {myTickets.length === 0 ? (
              <p className="text-gray-500">No tickets submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {myTickets.map((ticket: any) => (
                  <div key={ticket.id} className="border rounded-xl p-4">
                    <h3 className="font-bold">{ticket.issueType}</h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {ticket.department} | Office {ticket.officeNumber}
                    </p>

                    <p className="text-sm text-gray-500">
                      Status: {ticket.status} | Priority: {ticket.priority}
                    </p>

                    <p className="mt-2 text-gray-700">{ticket.description}</p>

                    <div className="mt-3 bg-blue-50 text-blue-800 p-3 rounded-xl text-sm">
                      ICT Feedback:{" "}
                      {ticket.feedback || "No feedback provided yet."}
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

      {/* MOBILE VIEW ONLY */}
      <main className="md:hidden min-h-screen bg-slate-50 pb-24">
        <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 to-blue-950 text-white px-5 py-5 shadow-xl">
          <div className="flex items-center justify-between">
            <button className="text-3xl">☰</button>

            <div className="flex items-center gap-3">
              <div className="h-14 w-11 rounded-b-2xl rounded-t-md border-2 border-yellow-500 flex flex-col items-center justify-center text-yellow-400 text-xs font-bold">
                <span className="text-lg">⚖</span>
                <span>MYGA</span>
              </div>

              <div>
                <h1 className="text-xl font-extrabold">ICT Support Portal</h1>
                <p className="text-xs text-slate-300">Client Service Desk</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href="#notifications" className="relative text-3xl">
                🔔
                {activeNotifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                    {activeNotifications.length}
                  </span>
                )}
              </a>

              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-extrabold text-lg">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </header>

        <section className="px-4 py-5">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-white rounded-[28px] p-6 shadow-2xl">
            <p className="text-lg font-semibold">Welcome, {username} 👋</p>

            <h1 className="text-4xl font-black mt-4 leading-tight">
              How can we help you today?
            </h1>

            <p className="text-blue-100 mt-4 text-lg">
              Log ICT issues and track feedback from MYGA ICT.
            </p>

            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-7 w-full bg-white text-blue-700 py-4 rounded-2xl font-extrabold text-lg shadow-lg"
            >
              + Submit ICT Support Request
            </button>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mt-8 mb-4">
            Quick Access
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-white rounded-3xl shadow-md p-5 text-left"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">
                📄
              </div>
              <h3 className="font-extrabold mt-4">Log Issue</h3>
              <p className="text-sm text-gray-500">New support request</p>
            </button>

            <a href="#my-tickets" className="bg-white rounded-3xl shadow-md p-5">
              <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl">
                🎫
              </div>
              <h3 className="font-extrabold mt-4">My Tickets</h3>
              <p className="text-sm text-gray-500">Track requests</p>
            </a>

            <a href="/knowledge" className="bg-white rounded-3xl shadow-md p-5">
              <div className="w-14 h-14 rounded-full bg-yellow-500 text-white flex items-center justify-center text-2xl">
                📘
              </div>
              <h3 className="font-extrabold mt-4">Knowledge</h3>
              <p className="text-sm text-gray-500">Help guides</p>
            </a>

            <a
              href="#notifications"
              className="bg-white rounded-3xl shadow-md p-5"
            >
              <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl">
                🔔
              </div>
              <h3 className="font-extrabold mt-4">Notifications</h3>
              <p className="text-sm text-gray-500">Ticket updates</p>
            </a>
          </div>

          {showForm && (
            <div className="bg-white rounded-3xl shadow-xl p-5 mt-8">
              <h2 className="text-2xl font-extrabold mb-5">
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
                  className="w-full bg-blue-700 text-white py-4 rounded-2xl font-extrabold"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          )}

          <div
            id="notifications"
            className="bg-white rounded-3xl shadow-md p-5 mt-8"
          >
            <h2 className="text-xl font-extrabold mb-4">Notifications</h2>

            {activeNotifications.length === 0 ? (
              <p className="text-gray-500">No new notifications.</p>
            ) : (
              <div className="space-y-3">
                {activeNotifications.map((ticket: any) => (
                  <div
                    key={ticket.id}
                    className="bg-blue-50 text-blue-800 p-4 rounded-2xl"
                  >
                    Your ticket for <b>{ticket.issueType}</b> is currently{" "}
                    <b>{ticket.status}</b>.
                  </div>
                ))}
              </div>
            )}
          </div>

          <div id="my-tickets" className="mt-8 mb-4">
            <h2 className="text-xl font-extrabold">My Tickets</h2>
          </div>

          {myTickets.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-md p-6 text-center text-gray-500">
              No tickets submitted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {myTickets.map((ticket: any) => (
                <div key={ticket.id} className="bg-white rounded-3xl shadow-md p-5">
                  <div className="flex justify-between gap-3">
                    <h3 className="font-extrabold text-lg">
                      {ticket.issueType}
                    </h3>

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

                  <p className="text-sm text-gray-500 mt-2">
                    {ticket.department} • Office {ticket.officeNumber}
                  </p>

                  <p className="text-gray-700 mt-4">{ticket.description}</p>

                  <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-2xl text-sm">
                    ICT Feedback:{" "}
                    {ticket.feedback || "No feedback provided yet."}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl flex justify-around py-3 z-40">
          <a href="/" className="text-blue-700 font-bold text-center">
            🏠
            <span className="block text-xs">Home</span>
          </a>

          <a href="#my-tickets" className="text-gray-600 font-bold text-center">
            📄
            <span className="block text-xs">Tickets</span>
          </a>

          <a href="/knowledge" className="text-gray-600 font-bold text-center">
            📘
            <span className="block text-xs">Knowledge</span>
          </a>

          <a
            href="#notifications"
            className="text-gray-600 font-bold text-center"
          >
            🔔
            <span className="block text-xs">Alerts</span>
          </a>

          <button onClick={logoutUser} className="text-gray-600 font-bold">
            👤
            <span className="block text-xs">Logout</span>
          </button>
        </nav>
      </main>
    </>
  );
}