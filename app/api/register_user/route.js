import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    // Check if email exists
    const [existing] = await db.query("SELECT * FROM Users WHERE Email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      return Response.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (verified = 0)
    const [result] = await db.query(
      "INSERT INTO Users (Email, Password, is_verified) VALUES (?, ?, 0)",
      [email, hashedPassword]
    );

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_hash = await bcrypt.hash(otp, 10);
    const expires_at = new Date(Date.now() + 1 * 60 * 1000);

    // Save OTP
    await db.query(
      `REPLACE INTO OTP_verification (Email, OTP_hash, Expires_at, Attempts_count,Resend_count)
       VALUES (?, ?, ?, 0, 0)`,
      [email, otp_hash, expires_at]
    );

    // Email OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 1 minutes.`,
    });

    return Response.json(
      { message: "OTP sent", userId: result.insertId },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
