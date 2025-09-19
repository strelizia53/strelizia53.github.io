"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { subscribeProjects, type ProjectDoc } from "@/lib/firebaseHelpers";

const FILTERS = ["All", "Full-Stack", "Frontend", "API"] as const;
type Filter = (typeof FILTERS)[number];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [projects, setProjects] = useState<
    Array<{ id: string; data: ProjectDoc }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProjects((items) => {
      setProjects(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const items = useMemo(() => {
    const sorted = [...projects].sort(
      (a, b) => (b.data.year || 0) - (a.data.year || 0)
    );
    if (filter === "All") return sorted;
    return sorted.filter((p) => p.data.category === filter);
  }, [projects, filter]);

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
        {loading ? (
          <div className="container">Loading...</div>
        ) : items.length === 0 ? (
          <div className="container no-items">No projects found.</div>
        ) : (
          items.map((p) => (
            <article key={p.id} className="card">
              {p.data.imageUrl ? (
                <div
                  className="thumb"
                  aria-hidden="true"
                  style={{ padding: 0 }}
                >
                  <Image
                    src={p.data.imageUrl}
                    alt={p.data.title}
                    width={1200}
                    height={630}
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "contain",
                      borderRadius: 12,
                    }}
                  />
                </div>
              ) : (
                <div className="thumb" aria-hidden="true" />
              )}

              <Link
                href={`/projects/${p.data.slug}`}
                style={{ color: "inherit" }}
              >
                <div className="card-header">
                  <h3>{p.data.title}</h3>
                  <span className="year">{p.data.year}</span>
                </div>
              </Link>

              <Link
                href={`/projects/${p.data.slug}`}
                style={{ color: "inherit" }}
              >
                {p.data.summary ? (
                  <p>{p.data.summary}</p>
                ) : p.data.description ? (
                  <p>{p.data.description}</p>
                ) : null}
              </Link>

              {p.data.tags?.length ? (
                <div className="tags" aria-label="Tags">
                  {p.data.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {p.data.stack?.length ? (
                <div className="stack" aria-label="Tech stack">
                  {p.data.stack.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="card-actions">
                {p.data.links?.demo ? (
                  <Link
                    className="link primary"
                    href={p.data.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo
                  </Link>
                ) : null}
                {p.data.links?.code ? (
                  <Link
                    className="link"
                    href={p.data.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source Code
                  </Link>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
