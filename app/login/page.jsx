"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Save token in localStorage
      localStorage.setItem("token", data.token);
      router.push("/dashboard"); // Redirect to dashboard
    } else {
      setError(data.message);
    }
  };

  return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f2f2f2",
    }}
  >
    <form
      onSubmit={handleLogin}
      style={{
        width: "350px",
        padding: "20px",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </form>
  </div>
);

}
