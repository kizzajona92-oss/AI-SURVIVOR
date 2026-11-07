
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

  const [researchQuestion, setResearchQuestion] = useState(
    "Find legitimate worldwide online income opportunities that require zero or very little starting capital. Check whether someone in Uganda can join and withdraw earnings."
  );
  const [researching, setResearching] = useState(false);
  const [researchAnswer, setResearchAnswer] = useState("");
  const [researchSources, setResearchSources] = useState([]);
  const [researchError, setResearchError] = useState("");

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

  async function runResearch(e) {
    e.preventDefault();
    setResearching(true);
    setResearchError("");
    setResearchAnswer("");
    setResearchSources([]);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: researchQuestion })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Research request failed.");
      }

      setResearchAnswer(
        result.answer || "The AI returned no text. Please try again."
      );
      setResearchSources(result.sources || []);
    } catch (error) {
      setResearchError(
        error.message || "Could not complete research. Please try again."
      );
    } finally {
      setResearching(false);
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

        {active === "AI Business Opportunities" && (
          <div>
            <p>
              Ask AI SURVIVOR to research real online income opportunities
              from websites worldwide. It will look for source links and
              check Uganda eligibility where possible.
            </p>

            <form onSubmit={runResearch}>
              <textarea
                style={{ ...styles.input, minHeight: "130px" }}
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                placeholder="What should AI SURVIVOR research?"
                required
              />

              <button
                type="submit"
                disabled={researching || !researchQuestion.trim()}
                style={styles.save}
              >
                {researching
                  ? "Researching worldwide..."
                  : "Research Opportunities"}
              </button>
            </form>

            {researchError && (
              <p style={{ color: "#ff8b8b", whiteSpace: "pre-wrap" }}>
                {researchError}
              </p>
            )}

            {researchAnswer && (
              <div style={styles.business}>
                <h3>Research Results</h3>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {researchAnswer}
                </p>

                {researchSources.length > 0 && (
                  <>
                    <h3>Web Sources</h3>
                    {researchSources.map((source, index) => (
                      <p key={source.url}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.link}
                        >
                          {index + 1}. {source.title}
                        </a>
                      </p>
                    ))}
                  </>
                )}
              </div>
            )}

            <p style={{ fontSize: "13px", opacity: 0.8 }}>
              Research is informational, not guaranteed income. AI SURVIVOR
              will not register, apply, spend money or contact anyone for you.
            </p>
          </div>
        )}

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

        {active !== "My Businesses" &&
          active !== "AI Business Opportunities" && (
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
