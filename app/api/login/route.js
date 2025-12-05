import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const [users] = await db.query("SELECT * FROM Users WHERE Email = ?", [email]);

    if (users.length === 0) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Optional: Check if verified
    if (user.is_verified === 0) {
      return Response.json(
        { message: "Email not verified" },
        { status: 403 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.ID, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    return Response.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
