"use client";

import { useState } from "react";
import { registerUser } from "../../lib/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Client/User",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role
    ) {
      alert("Please complete all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const result = registerUser({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Account registered successfully. You can now login.");
    window.location.replace("/login");
  }

  return (
    <main className="min-h-screen bg-blue-950 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-3xl">
            🛡️
          </div>

          <h1 className="text-3xl font-black text-blue-950 mt-4">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Register to access the MYGA ICT Support Portal.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          >
            <option>Client/User</option>
            <option>IT Officer</option>
            <option>Administrator</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-3 rounded-xl font-bold hover:bg-blue-800"
          >
            Register Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-blue-700 font-bold">
            Login here
          </a>
        </p>
      </div>
    </main>
  );
}