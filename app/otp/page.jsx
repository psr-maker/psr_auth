"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OTPPage() {
  const router = useRouter();
  const search = useSearchParams();
  const email = search.get("email");

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendCount, setResendCount] = useState(0);

  const intervalRef = useRef(null);

  // ✅ Start timer function
  const startTimer = (seconds) => {
    clearInterval(intervalRef.current); // clear previous interval if any
    setTimer(seconds);
    setResendDisabled(true);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start initial timer on mount
  useEffect(() => {
    startTimer(60);
    return () => clearInterval(intervalRef.current);
  }, []);

  // ✅ Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (res.status === 200) router.push("/dashboard");
    else setMessage(data.message);
  };

  // ✅ Handle Resend OTP
  const handleResend = async () => {
    if (resendCount >= 3) {
      setMessage("Resend limit reached");
      return;
    }

    const res = await fetch("/api/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.status === 200) {
      setResendCount((prev) => prev + 1);
      startTimer(60); // 🔹 restart timer on resend
    }
  };

  const formatTime = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify OTP</h2>
        <p style={styles.sub}>OTP sent to <strong>{email}</strong></p>
        <p style={{ textAlign: "center", marginBottom: "15px" }}>
          Expires in: <b>{formatTime()}</b>
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Verify OTP</button>
        </form>

        <button
          style={{ ...styles.resend, opacity: resendDisabled ? 0.5 : 1 }}
          disabled={resendDisabled}
          onClick={handleResend}
        >
          Resend OTP ({3 - resendCount} left)
        </button>

        {message && <p style={styles.error}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f1f1f1",
  },
  card: {
    width: "350px",
    padding: "25px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
  },
  title: { textAlign: "center", fontSize: "22px", marginBottom: "10px" },
  sub: { textAlign: "center", color: "#555", marginBottom: "10px" },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "black",
    color: "white",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  resend: {
    marginTop: "10px",
    width: "100%",
    padding: "12px",
    background: "gray",
    color: "white",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  error: { marginTop: "15px", color: "red", textAlign: "center" },
};
