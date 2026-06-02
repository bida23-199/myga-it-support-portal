"use client";

import { useState } from "react";
import { loginUser } from "../../lib/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [agreed, setAgreed] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert("Please enter username and password.");
      return;
    }

    if (!agreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    const result = loginUser(formData.username, formData.password);

    if (!result.success) {
      alert(result.message);
      return;
    }

    const role = result.user?.role;

    if (role === "IT Officer" || role === "Administrator") {
      window.location.replace("/admin");
    } else {
      window.location.replace("/");
    }
  }

  return (
    <main className="min-h-screen bg-blue-950 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-3xl animate-pulse">
            🛡️
          </div>

          <h1 className="text-3xl font-black text-blue-950 mt-4">
            MYGA ICT Login
          </h1>

          <p className="text-gray-500 mt-2">
            Access the ICT Support Portal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-700">
            <h3 className="font-bold mb-2">Terms & Conditions</h3>

            <ul className="list-disc ml-5 space-y-1">
              <li>Unauthorized access to the MYGA ICT Portal is prohibited.</li>
              <li>All login activities and system usage may be monitored.</li>
              <li>Users must not share passwords or login credentials.</li>
              <li>ICT support requests must contain accurate information.</li>
              <li>Misuse of systems may lead to disciplinary action.</li>
            </ul>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />

            <span>
              I have read and agree to the MYGA ICT Portal Terms & Conditions.
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-3 rounded-xl font-bold hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Do not have an account?{" "}
          <a href="/register" className="text-blue-700 font-bold">
            Register here
          </a>
        </p>
      </div>
    </main>
  );
}