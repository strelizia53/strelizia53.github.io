"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LaunchOfferPage() {
  const [slots, setSlots] = useState(0); // simulate slots taken

  return (
    <main className="launch-offer">
      {/* 1️⃣ HERO SECTION */}
      <section className="hero-offer fade-in">
        <div className="container">
          <h1>
            🚀 <span className="marker">10 Free Websites</span> for Small
            Businesses — Launch Offer 2025
          </h1>

          <p className="subtext">
            Get a custom website built completely free.
            <br />
            You only pay <b>$500/year</b> for hosting, SSL, and full
            maintenance.
            <br />
            <span className="slots">
              (Only {10 - slots} spots left — {slots}/10 claimed)
            </span>
          </p>

          <Link
            href="https://forms.gle/hY6pifQSzkfWsWMNA"
            className="btn btn-primary cta-btn"
          >
            Claim My Spot →
          </Link>

          {/* ✅ New Trust Badge Line */}
          <p className="trust-badge">
            <span>⚡ Delivered in 3–4 days</span> •<span> SSL Secured</span> •
            <span> 100% Ownership Guaranteed</span>
          </p>

          <div className="progress">
            <div className="progress-bar" style={{ width: `${slots * 10}%` }} />
          </div>
        </div>
      </section>

      {/* 2️⃣ WHY THIS OFFER EXISTS */}
      <section className="section fade-in">
        <div className="container narrow">
          <h2>Why This Offer Exists</h2>
          <p>
            I’m launching my <b>2025 Website Care & Growth Plan</b> and taking
            on 10 small businesses to build long-term relationships.
          </p>
          <p>
            You get a professional, fully managed website for a fraction of the
            usual cost — and I get portfolio case studies and testimonials for
            my upcoming agency launch.
          </p>
        </div>
      </section>

      {/* 3️⃣ WHAT YOU GET */}
      <section className="section features fade-in">
        <div className="container narrow">
          <h2>What You Get</h2>
          <ul className="feature-list">
            <li>✅ Custom, responsive website (delivered in 3–4 days)</li>
            <li>✅ Hosting + domain setup</li>
            <li>✅ Free SSL certificate</li>
            <li>✅ Full maintenance & updates for 1 year</li>
            <li>✅ Minor content edits (1 hr/month)</li>
            <li>✅ Priority support within 24 hrs</li>
          </ul>
          <p className="note">💡 Normally costs $1,200+ at most agencies.</p>
        </div>
      </section>

      {/* 4️⃣ EXAMPLES / PROOF */}
      <section className="section showcase fade-in">
        <div className="container narrow">
          <h2>My Work</h2>
          <p>
            Built with modern tech — clean, fast, and mobile-ready. Here’s a
            sneak peek of demo layouts:
          </p>
          <div className="demo-grid">
            <img src="/demo1.png" alt="Demo site 1" />
            <img src="/demo2.png" alt="Demo site 2" />
          </div>
        </div>
      </section>

      {/* 5️⃣ THE PLAN */}
      <section className="section plan fade-in">
        <div className="container narrow">
          <h2>How It Works</h2>
          <ol className="steps">
            <li>
              <b>Step 1:</b> Fill out the form — tell me about your business.
            </li>
            <li>
              <b>Step 2:</b> I build your website in <b>3–4 days</b>.
            </li>
            <li>
              <b>Step 3:</b> You get 1 year of hosting & updates for $500 total.
            </li>
          </ol>
        </div>
      </section>

      {/* 6️⃣ FAQ */}
      <section className="section faq fade-in">
        <div className="container narrow">
          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3>Why is it free?</h3>
            <p>
              This is a limited launch offer to build case studies and long-term
              clients.
            </p>
          </div>

          <div className="faq-item">
            <h3>Do I really own my website?</h3>
            <p>
              Yes. The site and database are fully yours — I just handle the
              technical side.
            </p>
          </div>

          <div className="faq-item">
            <h3>What happens after a year?</h3>
            <p>
              You can renew for another $500 or host it yourself — zero lock-in.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I add e-commerce later?</h3>
            <p>
              Absolutely — your site is fully scalable when you’re ready to
              expand.
            </p>
          </div>
        </div>
      </section>

      {/* 7️⃣ CTA */}
      <section className="section final-cta fade-in">
        <div className="container narrow">
          <h2>⚡ 10 Spots Only — Offer Ends When Filled!</h2>
          <Link
            href="https://forms.gle/hY6pifQSzkfWsWMNA"
            className="btn btn-primary cta-btn"
          >
            Reserve My Free Website →
          </Link>
          <p className="trust-line">
            No hidden fees • Delivered in 3–4 days • You own everything
          </p>
        </div>
      </section>
    </main>
  );
}
