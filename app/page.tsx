"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav>
        <div className="logo">MyLogo</div>

        <ul>
          <li>Home</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>

        {/* Get Started Link */}
        <Link href="/register_user" className="get-started">
          Get Started
        </Link>
              <Link href="/login" className="get-started">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to Our Landing Page</h1>
      </div>
    </div>
  );
}
