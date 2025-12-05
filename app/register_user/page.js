"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/register_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.status === 200) {
      router.push(`/otp?email=${email}`);
    } else {
      setMessage(data.message);
    }
  };

  return (
      <div style={{ 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f2f2f2"
    }}>

    
    <form onSubmit={handleRegister}
      style={{
          width: "350px",
          padding: "20px",
          borderRadius: "8px",
          background: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}>
        
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>

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
            border: "1px solid #ccc"
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
            border: "1px solid #ccc"
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
            cursor: "pointer"
          }}>
          Register
        </button>

        {message && (
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
