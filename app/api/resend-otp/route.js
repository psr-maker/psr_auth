import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    const [rows] = await db.query(
      `SELECT * FROM OTP_verification WHERE Email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "No OTP request found" }), {
        status: 400,
      });
    }

    const record = rows[0];

    // 🔹 Use Resend_count instead of Attempts_count
    const resendCount = record.Resend_count || 0;
    if (resendCount >= 3) {
      return new Response(JSON.stringify({ message: "Resend limit reached" }), {
        status: 403,
      });
    }

    // 🔄 Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_hash = await bcrypt.hash(otp, 10);
    const expires_at = new Date(Date.now() + 1 * 60 * 1000); // 1 min for testing

    // 🔥 Replace old OTP & increase Resend_count
    await db.query(
      `UPDATE OTP_verification 
       SET OTP_hash = ?, Expires_at = ?,  Resend_count = Resend_count + 1
       WHERE Email = ?`,
      [otp_hash, expires_at, email]
    );

    // 📩 Send email
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
      subject: "Your New OTP Code",
      text: `Your new OTP code is ${otp}. It will expire in 1 minute.`,
    });

    return new Response(
      JSON.stringify({ message: "New OTP sent", expires_at }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Resend error" }), {
      status: 500,
    });
  }
}
