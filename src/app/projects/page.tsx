"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Project = {
  title: string;
  description: string;
  year: number;
  category: "Full-Stack" | "Frontend" | "API";
  tags: string[];
  stack: string[];
  links: { demo?: string; code: string };
};

const PROJECTS: Project[] = [
  {
    title: "TaskFlow",
    description:
      "A full-stack task manager with auth, drag-and-drop boards, and real-time updates.",
    year: 2025,
    category: "Full-Stack",
    tags: ["CRUD", "Auth", "Realtime"],
    stack: ["Next.js", "Postgres", "Prisma", "WebSockets"],
    links: { demo: "#", code: "https://github.com/you/taskflow" },
  },
  {
    title: "MovieScope",
    description:
      "Frontend app to search movies, cache results, and bookmark favorites with local persistence.",
    year: 2024,
    category: "Frontend",
    tags: ["Search", "Caching"],
    stack: ["React", "Zustand", "Vite"],
    links: { demo: "#", code: "https://github.com/you/moviescope" },
  },
  {
    title: "DevNotes API",
    description:
      "REST API for notes with JWT auth, pagination, and rate-limiting. Includes OpenAPI docs.",
    year: 2024,
    category: "API",
    tags: ["REST", "JWT", "Docs"],
    stack: ["Node", "Express", "MongoDB", "Swagger"],
    links: { code: "https://github.com/you/devnotes-api" },
  },
  {
    title: "Shoply",
    description:
      "Full-stack mini-storefront with cart, checkout flow, and dashboard analytics.",
    year: 2025,
    category: "Full-Stack",
    tags: ["E-commerce", "Dashboard"],
    stack: ["Next.js", "Stripe", "PlanetScale"],
    links: { demo: "#", code: "https://github.com/you/shoply" },
  },
];

const FILTERS = ["All", "Full-Stack", "Frontend", "API"] as const;
type Filter = (typeof FILTERS)[number];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const items = useMemo(() => {
    const sorted = [...PROJECTS].sort((a, b) => b.year - a.year);
    if (filter === "All") return sorted;
    return sorted.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section className="fade-in">
      <header className="container" style={{ paddingBlock: "8px 0" }}>
        <h1 className="page-title">Projects</h1>
        <p className="page-intro">
          A selection of things I&apos;ve built—spanning full-stack apps, APIs,
          and frontend experiments. Each project links to the source code, and
          most have a live demo.
        </p>

        <div className="toolbar" role="toolbar" aria-label="Project filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className="pill"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="projects-grid">
        {items.map((p) => (
          <article key={p.title} className="card">
            <div className="thumb" aria-hidden="true" />

            <div className="card-header">
              <h3>{p.title}</h3>
              <span className="year">{p.year}</span>
            </div>

            <p>{p.description}</p>

            <div className="tags" aria-label="Tags">
              {p.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="stack" aria-label="Tech stack">
              {p.stack.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>

            <div className="card-actions">
              {p.links.demo && (
                <Link
                  className="link primary"
                  href={p.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                </Link>
              )}
              <Link
                className="link"
                href={p.links.code}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
