"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    setMessage(
      error
        ? error.message
        : "Check your email for the verification link."
    );

    setLoading(false);
  }

  async function login() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setMessage(
      error ? error.message : "Login successful!"
    );

    setLoading(false);
  }

  return (
    <main style={{
      background: "#07110d",
      color: "white",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "Arial"
    }}>
      <h1 style={{ color: "#22c55e" }}>
        AI SURVIVOR $
      </h1>

      <h2>Welcome</h2>
      <p>Create your account or sign in.</p>

      <input
        placeholder="Email address"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={inputStyle}
      />

      <button onClick={register} disabled={loading} style={buttonStyle}>
        Create Account
      </button>

      <button onClick={login} disabled={loading} style={buttonStyle}>
        Sign In
      </button>

      <p>{message}</p>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "14px",
  margin: "15px 0",
  borderRadius: "8px"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "12px",
  background: "#22c55e",
  color: "#07110d",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold"
};
