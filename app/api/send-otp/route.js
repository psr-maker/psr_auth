import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcrypt.genSalt(10);
    const otp_hash = await bcrypt.hash(otp, salt);

    const expires_at = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      `REPLACE INTO OTP_verification (Email, OTP_hash, Expires_at, Attempts_count) VALUES (?, ?, ?, 0)`,
      [email, otp_hash, expires_at]
    );

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
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    });

    return new Response(JSON.stringify({ message: "OTP sent successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error sending OTP" }), {
      status: 500,
    });
  }
}
