import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    const [rows] = await db.query(
      `SELECT * FROM OTP_verification WHERE Email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "OTP not found" }),
        { status: 400 }
      );
    }

    const record = rows[0];

    if (new Date(record.Expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ message: "OTP expired" }),
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(otp, record.OTP_hash);

    if (!isValid) {
      await db.query(
        `UPDATE OTP_verification SET Attempts_count = Attempts_count + 1 WHERE Email = ?`,
        [email]
      );

      return new Response(
        JSON.stringify({ message: "Invalid OTP" }),
        { status: 400 }
      );
    }

    await db.query(
      `UPDATE OTP_verification SET Attempts_count = Attempts_count + 1 WHERE Email = ?`,
      [email]
    );
await db.query(
      `UPDATE Users SET is_verified = 1 WHERE Email = ?`,
      [email]
    );
    return new Response(
      JSON.stringify({ message: "OTP verified successfully" }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "OTP verification error" }), {
      status: 500,
    });
  }
}
