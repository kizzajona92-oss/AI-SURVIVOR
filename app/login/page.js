
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signup");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });

        if (error) throw error;

        if (data.session) {
          window.location.href = "/";
        } else {
          setMessage(
            "Account created! Check your email and click the verification link before signing in."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) throw error;

        window.location.href = "/";
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.panel}>
        <h1 style={{ color: "#36d98a" }}>AI SURVIVOR $</h1>

        <h2>{mode === "signup" ? "Create Account" : "Welcome Back"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password (at least 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <button
          style={styles.switch}
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setMessage("");
          }}
        >
          {mode === "signup"
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </button>

        <p><a href="/" style={{ color: "#36d98a" }}>Back to Dashboard</a></p>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#07110d",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },
  panel: {
    width: "100%",
    maxWidth: "420px",
    background: "#10251b",
    padding: "25px",
    borderRadius: "14px"
  },
  input: {
    display: "block",
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #28734d",
    background: "#07110d",
    color: "white"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#36d98a",
    color: "#07110d",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold"
  },
  switch: {
    marginTop: "18px",
    background: "transparent",
    color: "#36d98a",
    border: "none",
    cursor: "pointer"
  },
  message: {
    color: "#36d98a",
    overflowWrap: "anywhere"
  }
};
