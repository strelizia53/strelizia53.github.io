"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  FiMail,
  FiArrowRight,
  FiCode,
  FiLayout,
  FiTrendingUp,
  FiServer,
  FiCheck,
  FiStar,
  FiZap,
  FiClock,
  FiShield,
} from "react-icons/fi";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = ref.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function Home() {
  const pageRef = useScrollReveal();

  return (
    <div ref={pageRef}>
      {/* ===== HERO SECTION ===== */}
      <section className="lp-hero">
        <div className="lp-hero-grid" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge reveal">
            <span className="lp-hero-badge-dot" />
            Available for Projects
          </div>

          <h1 className="lp-hero-title reveal reveal-delay-1">
            I Build Digital Experiences{" "}
            <span className="gradient-text">That Convert</span>
          </h1>

          <p className="lp-hero-subtitle reveal reveal-delay-2">
            Full-stack developer specializing in high-performance web
            applications that drive real business results. From pixel-perfect UIs
            to scalable architectures — I deliver solutions that move the needle.
          </p>

          <div className="lp-hero-actions reveal reveal-delay-3">
            <Link href="/contact" className="lp-btn lp-btn-primary">
              Work With Me <FiArrowRight />
            </Link>
            <Link href="/projects" className="lp-btn lp-btn-outline">
              View Projects
            </Link>
          </div>

          <div className="lp-hero-stats reveal reveal-delay-4">
            <div className="lp-hero-stat">
              <span className="lp-hero-stat-number">15+</span>
              <span className="lp-hero-stat-label">Projects Delivered</span>
            </div>
            <div className="lp-hero-stat">
              <span className="lp-hero-stat-number">3+</span>
              <span className="lp-hero-stat-label">Years Experience</span>
            </div>
            <div className="lp-hero-stat">
              <span className="lp-hero-stat-number">100%</span>
              <span className="lp-hero-stat-label">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ===== ABOUT SECTION ===== */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-about-grid">
            <div className="lp-about-visual reveal">
              <div className="lp-about-image-wrapper">
                <div className="lp-about-image-placeholder">
                  <FiCode size={64} />
                </div>
              </div>
              <div className="lp-about-float-card">
                <span>3+</span>
                <small>Years Building for the Web</small>
              </div>
            </div>

            <div className="lp-about-text">
              <div className="lp-section-label reveal">About Me</div>
              <h2 className="reveal reveal-delay-1">
                Turning Complex Problems Into Elegant Solutions
              </h2>
              <p className="reveal reveal-delay-2">
                I&apos;m <strong>Rushaid Khan</strong>, a full-stack developer
                with a passion for building modern, performant web applications
                that don&apos;t just look great — they <strong>perform</strong>.
              </p>
              <p className="reveal reveal-delay-3">
                Every project I take on is driven by measurable outcomes. Whether
                it&apos;s optimizing load times, improving conversion rates, or
                architecting scalable systems, I focus on delivering real value.
              </p>

              <div className="lp-expertise-grid reveal reveal-delay-4">
                <div className="lp-expertise-card">
                  <div className="lp-expertise-icon">
                    <FiLayout />
                  </div>
                  <h4>Frontend Development</h4>
                  <p>React, Next.js, TypeScript — pixel-perfect UIs</p>
                </div>
                <div className="lp-expertise-card">
                  <div className="lp-expertise-icon">
                    <FiServer />
                  </div>
                  <h4>Backend & APIs</h4>
                  <p>Node.js, Python, Firebase — scalable architectures</p>
                </div>
                <div className="lp-expertise-card">
                  <div className="lp-expertise-icon">
                    <FiTrendingUp />
                  </div>
                  <h4>Performance</h4>
                  <p>Core Web Vitals, SEO, speed optimization</p>
                </div>
                <div className="lp-expertise-card">
                  <div className="lp-expertise-icon">
                    <FiZap />
                  </div>
                  <h4>Modern Stack</h4>
                  <p>Latest tools and frameworks, always evolving</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ===== FEATURED WORK ===== */}
      <section className="lp-section lp-section-alt">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-label reveal">Featured Work</div>
            <h2 className="lp-section-title reveal reveal-delay-1">
              Projects That Deliver Results
            </h2>
            <p className="lp-section-subtitle reveal reveal-delay-2">
              A selection of recent work showcasing end-to-end development from
              concept to deployment.
            </p>
          </div>

          <div className="lp-work-grid">
            {[
              {
                emoji: "📊",
                category: "Full-Stack",
                title: "TaskFlow — Realtime Kanban Platform",
                desc: "A collaborative project management tool with real-time updates, drag-and-drop, and optimistic UI for seamless team workflows.",
                metrics: [
                  { value: "Real-time", label: "Sync" },
                  { value: "Sub-100ms", label: "Updates" },
                ],
              },
              {
                emoji: "🛒",
                category: "Full-Stack",
                title: "E-Commerce Dashboard",
                desc: "Admin dashboard with analytics, inventory management, and order processing — built for speed and scale.",
                metrics: [
                  { value: "40%", label: "Faster Loads" },
                  { value: "99.9%", label: "Uptime" },
                ],
              },
              {
                emoji: "🔐",
                category: "API",
                title: "Auth Microservice",
                desc: "Secure authentication API with JWT, refresh tokens, rate limiting, and role-based access control.",
                metrics: [
                  { value: "<50ms", label: "Response" },
                  { value: "Zero", label: "Breaches" },
                ],
              },
            ].map((project, i) => (
              <div
                key={project.title}
                className={`lp-work-card reveal reveal-delay-${i + 1}`}
              >
                <div className="lp-work-card-image">
                  <div className="lp-work-card-image-placeholder">
                    {project.emoji}
                  </div>
                  <div className="lp-work-card-overlay" />
                </div>
                <div className="lp-work-card-body">
                  <div className="lp-work-card-category">
                    {project.category}
                  </div>
                  <h3 className="lp-work-card-title">{project.title}</h3>
                  <p className="lp-work-card-desc">{project.desc}</p>
                  <div className="lp-work-card-metrics">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="lp-work-card-metric">
                        <strong>{m.value}</strong>
                        <small>{m.label}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
            }}
            className="reveal"
          >
            <Link href="/projects" className="lp-btn lp-btn-outline">
              View All Projects <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ===== SKILLS & TOOLS ===== */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-label reveal">Skills & Tools</div>
            <h2 className="lp-section-title reveal reveal-delay-1">
              The Tech Behind the Magic
            </h2>
            <p className="lp-section-subtitle reveal reveal-delay-2">
              A carefully curated toolkit built over years of shipping real
              products.
            </p>
          </div>

          <div className="lp-skills-categories">
            {[
              {
                icon: <FiLayout />,
                title: "Frontend",
                skills: [
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "HTML5/CSS3",
                  "Framer Motion",
                ],
              },
              {
                icon: <FiServer />,
                title: "Backend",
                skills: [
                  "Node.js",
                  "Python",
                  "Firebase",
                  "REST APIs",
                  "PostgreSQL",
                  "MongoDB",
                ],
              },
              {
                icon: <FiCode />,
                title: "Development",
                skills: [
                  "Git",
                  "VS Code",
                  "Vercel",
                  "Docker",
                  "CI/CD",
                  "Testing",
                ],
              },
              {
                icon: <FiTrendingUp />,
                title: "Strategy",
                skills: [
                  "SEO",
                  "Performance",
                  "Analytics",
                  "A/B Testing",
                  "Accessibility",
                  "Responsive Design",
                ],
              },
            ].map((cat, i) => (
              <div
                key={cat.title}
                className={`lp-skill-category reveal reveal-delay-${i + 1}`}
              >
                <div className="lp-skill-category-header">
                  <div className="lp-skill-category-icon">{cat.icon}</div>
                  <h3>{cat.title}</h3>
                </div>
                <div className="lp-skill-list">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="lp-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ===== TESTIMONIALS ===== */}
      <section className="lp-section lp-section-alt">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-label reveal">Testimonials</div>
            <h2 className="lp-section-title reveal reveal-delay-1">
              What People Say
            </h2>
            <p className="lp-section-subtitle reveal reveal-delay-2">
              Trusted by professionals and teams to deliver exceptional results.
            </p>
          </div>

          <div className="lp-testimonials-grid">
            {[
              {
                initials: "AJ",
                name: "Alex Johnson",
                role: "Startup Founder",
                text: "Rushaid delivered our MVP ahead of schedule with incredible attention to detail. The performance of the final product exceeded all our expectations.",
              },
              {
                initials: "SM",
                name: "Sarah Mitchell",
                role: "Product Manager",
                text: "Working with Rushaid was a game-changer. He didn't just build what we asked for — he identified opportunities we hadn't even considered.",
              },
              {
                initials: "DK",
                name: "David Kim",
                role: "Tech Lead",
                text: "Clean code, clear communication, and results that speak for themselves. Rushaid is the kind of developer every team wants on their side.",
              },
            ].map((t, i) => (
              <div
                key={t.name}
                className={`lp-testimonial-card reveal reveal-delay-${i + 1}`}
              >
                <div className="lp-testimonial-stars">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} fill="currentColor" />
                  ))}
                </div>
                <div className="lp-testimonial-quote-icon">&ldquo;</div>
                <p className="lp-testimonial-text">{t.text}</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar">{t.initials}</div>
                  <div className="lp-testimonial-author-info">
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ===== PROCESS SECTION ===== */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-section-label reveal">My Process</div>
            <h2 className="lp-section-title reveal reveal-delay-1">
              How I Work
            </h2>
            <p className="lp-section-subtitle reveal reveal-delay-2">
              A proven 4-step framework that delivers consistent, high-quality
              results.
            </p>
          </div>

          <div className="lp-process-grid">
            {[
              {
                step: 1,
                title: "Discovery",
                desc: "Deep dive into your goals, audience, and requirements to build a clear project roadmap.",
              },
              {
                step: 2,
                title: "Design",
                desc: "Wireframes and prototypes that align with your vision, optimized for conversion and UX.",
              },
              {
                step: 3,
                title: "Develop",
                desc: "Clean, performant code built with modern tools. Regular updates and transparent communication.",
              },
              {
                step: 4,
                title: "Deliver",
                desc: "Thorough testing, deployment, and handoff. Plus ongoing support to ensure long-term success.",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`lp-process-step reveal reveal-delay-${i + 1}`}
              >
                <div className="lp-process-number">{s.step}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ===== CONTACT / CTA SECTION ===== */}
      <section className="lp-cta">
        <div className="lp-cta-content">
          <div className="lp-section-label reveal">Let&apos;s Talk</div>
          <h2 className="lp-cta-title reveal reveal-delay-1">
            Ready to Build Something Extraordinary?
          </h2>
          <p className="lp-cta-subtitle reveal reveal-delay-2">
            Whether you need a new website, a web application, or technical
            consulting — I&apos;m here to help turn your vision into reality.
          </p>

          <div className="lp-cta-actions reveal reveal-delay-3">
            <Link href="/contact" className="lp-btn lp-btn-primary">
              Start a Project <FiArrowRight />
            </Link>
            <a
              href="mailto:rushaidkhan53@gmail.com"
              className="lp-btn lp-btn-outline"
            >
              <FiMail /> rushaidkhan53@gmail.com
            </a>
          </div>

          <div className="lp-cta-trust reveal reveal-delay-4">
            <div className="lp-trust-item">
              <FiClock size={16} />
              <span>Fast Turnaround</span>
            </div>
            <div className="lp-trust-item">
              <FiShield size={16} />
              <span>Secure & Reliable</span>
            </div>
            <div className="lp-trust-item">
              <FiCheck size={16} />
              <span>100% Satisfaction</span>
            </div>
          </div>

          {/* Social Links */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              marginTop: "2.5rem",
            }}
            className="reveal reveal-delay-5"
          >
            <a
              href="https://github.com/strelizia53"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn lp-btn-outline"
              style={{ padding: "0.75rem 1.25rem" }}
              aria-label="GitHub"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://linkedin.com/in/rushaid-khan"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn lp-btn-outline"
              style={{ padding: "0.75rem 1.25rem" }}
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
