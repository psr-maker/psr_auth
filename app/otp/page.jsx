"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OTPPage() {
  const router = useRouter();
  const search = useSearchParams();

  const email = search.get("email");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (res.status === 200) {
      router.push("/dashboard");
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
    <div style={{
      width: "350px",
      padding: "25px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 0 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "15px",
        fontSize: "22px"
      }}>
        Verify OTP
      </h2>

      <p style={{
        textAlign: "center",
        marginBottom: "20px",
        color: "#555",
        fontSize: "13px"
      }}>
        OTP sent to <strong>{email}</strong>
      </p>

      <form onSubmit={handleVerify}>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            outline: "none",
            marginBottom: "15px"
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "0.3s"
          }}
        >
          Verify OTP
        </button>

      </form>

      {message && (
        <p style={{
          marginTop: "15px",
          textAlign: "center",
          color: "red"
        }}>
          {message}
        </p>
      )}
    </div>
  </div>
);

}
