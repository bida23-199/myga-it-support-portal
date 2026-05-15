"use client";

import { useEffect, useState } from "react";

export default function KnowledgeBasePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("role");

    if (loggedIn !== "true") {
      window.location.href = "/login";
      return;
    }

    setRole(userRole || "");
  }, []);

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  const isIT = role === "IT Officer" || role === "Administrator";

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
              <a href="/" className="block hover:bg-blue-800 p-3 rounded-xl">
                Client Portal
              </a>
            </li>

            <li>
              <a href="/knowledge-base">
  Knowledge Base
</a>
            </li>

            {isIT && (
              <>
                <li>
                  <a
                    href="/admin"
                    className="block hover:bg-blue-800 p-3 rounded-xl"
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
              </>
            )}

            <li>
              <button
                onClick={logout}
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
          <h1 className="text-4xl font-bold">Knowledge Base</h1>
          <p className="mt-2 text-lg">
            Self-service ICT guides for common support issues
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-3">
              Password Reset Guide
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Confirm that the user is on the domain login screen.</li>
              <li>Press CTRL + ALT + DELETE.</li>
              <li>Select Change Password if the user remembers the old password.</li>
              <li>If locked out, contact IT for account unlock/reset.</li>
              <li>Do not share passwords with other users.</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-3">
              Outlook Email Troubleshooting
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Check internet connectivity first.</li>
              <li>Close and reopen Outlook.</li>
              <li>Check if Outlook is working offline.</li>
              <li>Restart the computer if synchronization delays continue.</li>
              <li>Contact IT for profile repair or mailbox reconfiguration.</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-3">
              Network / Internet Connection
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Check if the Ethernet cable is connected properly.</li>
              <li>Check if the network light is blinking on the computer.</li>
              <li>Restart the network adapter or computer.</li>
              <li>Try connecting to another working network port.</li>
              <li>Report the issue to IT if connectivity is still unavailable.</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-3">
              Printer Troubleshooting
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Check if the printer is powered on.</li>
              <li>Ensure the printer is connected to the network.</li>
              <li>Confirm that the correct printer is selected.</li>
              <li>Restart the printer if jobs are stuck.</li>
              <li>Contact IT if the printer driver needs reinstallation.</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-3">
              Creating URL Shortcuts
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Right-click on the desktop.</li>
              <li>Select New, then Shortcut.</li>
              <li>Paste the system URL, such as GABS or internal portal link.</li>
              <li>Name the shortcut clearly.</li>
              <li>Click Finish.</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-3">
              When to Contact IT
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Account is disabled or locked.</li>
              <li>Computer cannot connect to the network.</li>
              <li>GABS, NARMS, or YSA system cannot open.</li>
              <li>Printer cannot be detected.</li>
              <li>Hardware such as keyboard, mouse, or monitor is faulty.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/"
            className="inline-block bg-blue-700 text-white px-5 py-3 rounded-xl hover:bg-blue-800"
          >
            Back to Client Portal
          </a>
        </div>
      </div>
    </main>
  );
}