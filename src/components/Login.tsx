// src/components/Login.tsx
"use client";

import { useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-card-icon">
          <FiLock size={24} />
        </div>
        <h1 className="login-title">Admin Access</h1>
        <p className="login-subtitle">Sign in to manage your portfolio</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="status error" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <FiMail size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FiLock size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
            style={{ width: "100%", marginTop: "var(--space-sm)" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
