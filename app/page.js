"use client";

import { useState } from "react";

const sections = [
  {
    name: "AI Business Opportunities",
    description: "Explore business ideas that AI can help evaluate for Uganda."
  },
  {
    name: "My Businesses",
    description: "View and manage the businesses you create."
  },
  {
    name: "AI Agents",
    description: "Manage the AI assistants assigned to your business tasks."
  },
  {
    name: "Transactions",
    description: "View recorded income and expenses."
  },
  {
    name: "Approval Centre",
    description: "Review actions that require your approval."
  },
  {
    name: "Activity History",
    description: "View a record of activity on your account."
  }
];

export default function Home() {
  const [active, setActive] = useState(null);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#07110d",
      color: "white",
      padding: "24px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ color: "#36d98a" }}>AI SURVIVOR $</h1>
      <p>Welcome to your AI business platform.</p>

      <div style={{
        background: "#10251b",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "24px"
      }}>
        <p>Starting Capital</p>
        <h2>UGX 0</h2>
      </div>

      <h2>My Dashboard</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px"
      }}>
        {sections.map((section) => (
          <button
            key={section.name}
            onClick={() => setActive(section)}
            style={{
              background: "#123323",
              color: "white",
              border: "1px solid #28734d",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "left",
              cursor: "pointer",
              minHeight: "90px"
            }}
          >
            <strong>{section.name}</strong>
            <p style={{ color: "#b9d8c7", marginBottom: 0 }}>
              Open section →
            </p>
          </button>
        ))}
      </div>

      {active && (
        <section style={{
          marginTop: "24px",
          background: "#10251b",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #28734d"
        }}>
          <h2>{active.name}</h2>
          <p>{active.description}</p>
          <button
            onClick={() => setActive(null)}
            style={{
              background: "#36d98a",
              color: "#07110d",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </section>
      )}
    </main>
  );
}
