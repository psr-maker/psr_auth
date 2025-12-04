"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // To track success or error message

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setStatus(""); // Reset status before making the request

    // Send registration data to the backend
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (res.ok) {
      // If registration is successful
      setStatus({ type: "success", message: data.message });
    } else {
      // If registration failed
      setStatus({ type: "error", message: data.message });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Register</button>
      </form>

      {/* Show success or error message */}
      {status && (
        <p style={{ color: status.type === "success" ? "green" : "red" }}>
          {status.message}
        </p>
      )}
    </div>
  );
}
