"use client";

import { useId, useState } from "react";
import Link from "next/link";

type FormState =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function ContactPage() {
  const emailId = useId();
  const nameId = useId();
  const msgId = useId();

  const [state, setState] = useState<FormState>({ type: "idle" });
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied">(
    "idle"
  );

  async function handleCopyEmail() {
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText("rushaidkhan53@gmail.com");
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
      setCopyState("idle");
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot
    if ((data.get("company") as string)?.trim()) return;

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const emailOk = /.+@.+\..+/.test(email);
    if (!name || !emailOk || message.length < 10) {
      setState({
        type: "error",
        message:
          "Please provide your name, a valid email, and a message (10+ characters).",
      });
      return;
    }

    setState({ type: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to send");

      form.reset();
      setState({
        type: "success",
        message: "Thanks! I’ve received your message and will get back soon.",
      });
    } catch (err: unknown) {
      let errorMessage = "Something went wrong. Please try again in a moment.";
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message?: string }).message === "string"
      ) {
        errorMessage = (err as { message: string }).message;
      }
      setState({
        type: "error",
        message: errorMessage,
      });
    }
  }

  return (
    <section className="container fade-in">
      <div className="contact-hero">
        <h1>Contact</h1>
        <p>
          Have a question, idea, or opportunity? Send a message here—or reach me
          directly via email or socials.
        </p>
      </div>

      <div className="contact-grid">
        {/* Left column: quick contact cards */}
        <div className="contact-cards">
          <div className="contact-card">
            <h3>Email</h3>
            <p>Prefer your own client? Use a direct link.</p>
            <div className="contact-actions">
              <a
                className="btn btn-primary"
                href="mailto:rushaidkhan53@gmail.com?subject=Hi%20there"
              >
                Open Email
              </a>
              <button
                className="btn btn-outline"
                onClick={handleCopyEmail}
                type="button"
                disabled={copyState === "copying"}
                aria-label="Copy email address"
                title="Copy email"
              >
                {copyState === "copying"
                  ? "Copying..."
                  : copyState === "copied"
                  ? "Copied!"
                  : "Copy Address"}
              </button>
            </div>
          </div>

          <div className="contact-card">
            <h3>Social</h3>
            <p>Let’s connect.</p>
            <div className="contact-actions">
              <Link
                className="btn btn-outline"
                href="https://github.com/strelizia53"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
              <Link
                className="btn btn-outline"
                href="https://linkedin.com/in/rushaid-khan"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        {/* Right column: form */}
        <form className="form" onSubmit={onSubmit} noValidate>
          {/* honeypot, keep it off-screen */}
          <input
            type="text"
            name="company"
            style={{ position: "absolute", left: "-10000px" }}
            tabIndex={-1}
            aria-hidden
          />

          <div className="form-row">
            <div className="field">
              <label htmlFor={nameId} className="label">
                Name
              </label>
              <input
                id={nameId}
                name="name"
                className="input"
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </div>

            <div className="field">
              <label htmlFor={emailId} className="label">
                Email
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                className="input"
                placeholder="jane@doe.dev"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor={msgId} className="label">
              Message
            </label>
            <textarea
              id={msgId}
              name="message"
              className="textarea"
              placeholder="Tell me a bit about your project or question…"
              minLength={10}
              required
            />
            <p className="form-help">I usually reply within 1–2 days.</p>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={state.type === "submitting"}
            >
              {state.type === "submitting" ? "Sending…" : "Send Message"}
            </button>
            <a
              className="btn btn-outline"
              href="mailto:rushaidkhan53@gmail.com?subject=Hi%20there"
            >
              Use Email Client
            </a>
          </div>

          <div
            aria-live="polite"
            className={`status${state.type === "error" ? " error" : ""}`}
            style={{ display: state.type === "idle" ? "none" : "block" }}
          >
            {state.type === "success" || state.type === "error"
              ? state.message
              : "Sending…"}
          </div>
        </form>
      </div>
    </section>
  );
}
