import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const [result] = await db.query(
      "INSERT INTO Users (Email, Password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    return Response.json(
      { message: "User registered successfully!", userId: result.insertId },
      { status: 200 }
    );

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return Response.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    return Response.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

