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
        <Link href="/register" className="get-started">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to Our Landing Page</h1>
      </div>
    </div>
  );
}
