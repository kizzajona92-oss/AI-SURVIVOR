"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [active, setActive] = useState("My Businesses");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function start() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
      setLoading(false);
    }

    start();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadBusinesses();
  }, [user]);

  async function loadBusinesses() {
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Could not load businesses: " + error.message);
    } else {
      setBusinesses(data || []);
    }
  }

  async function addBusiness(e) {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Please sign in first.");
      return;
    }

    if (!name.trim()) {
      setMessage("Enter a business name.");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("businesses")
      .insert({
        owner_id: user.id,
        name: name.trim(),
        status: "planned",
        notes: notes.trim()
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      setMessage("Saving failed: " + error.message);
    } else {
      setBusinesses((old) => [data, ...old]);
      setName("");
      setNotes("");
      setMessage("Business saved successfully!");
    }
  }

  const sections = [
    "AI Business Opportunities",
    "My Businesses",
    "AI Agents",
    "Transactions",
    "Approval Centre",
    "Activity History"
  ];

  if (loading) {
    return <main style={styles.page}>Loading AI SURVIVOR...</main>;
  }

  return (
    <main style={styles.page}>
      <h1 style={{ color: "#36d98a" }}>AI SURVIVOR $</h1>
      <p>Your intelligent business platform.</p>

      <div style={styles.capital}>
        <p>Starting Capital</p>
        <h2>UGX 0</h2>
      </div>

      {!user && (
        <div style={styles.panel}>
          <h2>Sign in required</h2>
          <p>Sign in before saving and viewing your private businesses.</p>
          <a href="/login" style={styles.link}>Go to Login</a>
        </div>
      )}

      <h2>My Dashboard</h2>

      <div style={styles.grid}>
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => {
              setActive(section);
              setMessage("");
            }}
            style={styles.button}
          >
            {section} →
          </button>
        ))}
      </div>

      <section style={styles.panel}>
        <h2>{active}</h2>

        {active === "My Businesses" && (
          <>
            {user ? (
              <>
                <h3>Add a Business</h3>

                <form onSubmit={addBusiness}>
                  <input
                    style={styles.input}
                    placeholder="Business name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <textarea
                    style={styles.input}
                    placeholder="Business description or notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <button
                    type="submit"
                    disabled={saving}
                    style={styles.save}
                  >
                    {saving ? "Saving..." : "Save Business"}
                  </button>
                </form>

                <h3>Saved Businesses ({businesses.length})</h3>

                {businesses.length === 0 ? (
                  <p>No businesses saved yet.</p>
                ) : (
                  businesses.map((business) => (
                    <div key={business.id} style={styles.business}>
                      <strong>{business.name}</strong>
                      <p>Status: {business.status}</p>
                      <p>{business.notes}</p>
                    </div>
                  ))
                )}
              </>
            ) : (
              <p>Please sign in to manage businesses.</p>
            )}
          </>
        )}

        {active !== "My Businesses" && (
          <p>This section will be developed in the next stages.</p>
        )}

        {message && <p style={{ color: "#36d98a" }}>{message}</p>}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#07110d",
    color: "white",
    padding: "24px",
    fontFamily: "Arial, sans-serif"
  },
  capital: {
    background: "#10251b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "24px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px"
  },
  button: {
    background: "#123323",
    color: "white",
    border: "1px solid #28734d",
    borderRadius: "10px",
    padding: "18px",
    cursor: "pointer"
  },
  panel: {
    marginTop: "24px",
    background: "#10251b",
    padding: "20px",
    borderRadius: "12px"
  },
  input: {
    display: "block",
    width: "100%",
    padding: "13px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #28734d",
    background: "#07110d",
    color: "white"
  },
  save: {
    padding: "13px 20px",
    background: "#36d98a",
    color: "#07110d",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  business: {
    background: "#123323",
    padding: "14px",
    borderRadius: "8px",
    marginTop: "12px"
  },
  link: {
    color: "#36d98a"
  }
};
