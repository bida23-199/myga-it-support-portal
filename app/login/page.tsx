"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {
    setError("");

    if (!username || !password || !role) {
      setError("Please complete all login fields.");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the Terms & Conditions.");
      return;
    }

    if (password !== "myga123") {
      setError("Wrong password. Try again.");
      setPassword("");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);

    if (role === "IT Officer" || role === "Administrator") {
      window.location.replace("/admin");
    } else {
      window.location.replace("/");
    }
  }

  return (
    <main className="min-h-screen bg-blue-950 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="floatingShield flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-4xl shadow-2xl">
              🛡️
            </div>
          </div>

          <h1 className="text-3xl font-bold text-blue-900">
            ICT Service Desk Portal
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Ministry of Youth and Gender Affairs
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 mt-6">
            {error}
          </div>
        )}

        <div className="space-y-4 mt-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-3 rounded-xl"
          >
            <option value="">Select Role</option>
            <option value="Client/User">Client/User</option>
            <option value="IT Officer">IT Officer</option>
            <option value="Administrator">Administrator</option>
          </select>

          <div className="bg-gray-100 p-4 rounded-xl text-sm text-gray-600">
            <p className="font-semibold mb-2 text-gray-800">
              Terms & Conditions
            </p>

            <ul className="list-disc pl-5 space-y-1">
              <li>Unauthorized access to the MYGA ICT Portal is prohibited.</li>
              <li>All login activities and system usage may be monitored.</li>
              <li>Users must not share passwords or login credentials.</li>
              <li>ICT support requests must contain accurate information.</li>
              <li>Users must protect institutional and government data.</li>
              <li>Misuse of systems may lead to disciplinary action.</li>
            </ul>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />

            <p className="text-sm text-gray-600">
              I have read and agree to the MYGA ICT Portal Terms & Conditions.
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800"
          >
            Login
          </button>
        </div>
      </div>

      <style jsx>{`
        .floatingShield {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </main>
  );
}