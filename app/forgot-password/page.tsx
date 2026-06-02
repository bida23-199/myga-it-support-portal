"use client";

import { useState } from "react";
import { resetPassword } from "../../lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      alert("Please complete all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const result = resetPassword(email, newPassword);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert(result.message);
    window.location.replace("/login");
  }

  return (
    <main className="min-h-screen bg-blue-950 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-3xl">
            🔐
          </div>

          <h1 className="text-3xl font-black text-blue-950 mt-4">
            Forgot Password
          </h1>

          <p className="text-gray-500 mt-2">
            Reset your MYGA ICT Portal password.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Registered Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-3 rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-3 rounded-xl font-bold hover:bg-blue-800"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-700 font-bold">
            Login here
          </a>
        </p>
      </div>
    </main>
  );
}