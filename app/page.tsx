"use client";
import { sendEmailNotification } from "../lib/email";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { isLoggedIn, getUsername, logoutUser } from "../lib/auth";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export default function ClientPortal() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [myTickets, setMyTickets] = useState<any[]>([]);

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

      alert("Ticket submitted successfully. ICT has been notified.");

      setFormData({
        fullName: "",
        email: "",
        department: "",
        officeNumber: "",
        issueType: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert("Ticket saved, but email notification may have failed.");
    }
  }

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
        )}
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
                    Department: {ticket.department} | Office:{" "}
                    {ticket.officeNumber}
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
  );
}