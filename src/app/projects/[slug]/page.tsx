// src/app/projects/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProjectBySlug, type ProjectDoc } from "@/lib/firebaseHelpers";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [data, setData] = useState<{ id: string; data: ProjectDoc } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProjectBySlug(slug)
      .then((res) => {
        if (!mounted) return;
        if (!res) {
          router.replace("/projects");
          return;
        }
        setData(res);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [slug, router]);

  if (loading) {
    return (
      <section className="container fade-in">
        <div>Loading...</div>
      </section>
    );
  }

  if (!data) return null;

  const p = data.data;

  return (
    <section className="container fade-in">
      <nav className="breadcrumbs">
        <Link href="/projects">Projects</Link>
        <span>/</span>
        <span>{p.title}</span>
      </nav>

      <div className="project-hero">
        <h1 className="project-title">{p.title}</h1>
        <div className="meta">
          <span className="badge">{p.category}</span>
          {p.year ? <span className="chip">{p.year}</span> : null}
        </div>
      </div>

      {p.summary ? <p className="prose">{p.summary}</p> : null}
      {p.description ? (
        <div className="section">
          <h2>Overview</h2>
          <div className="prose">
            <p>{p.description}</p>
          </div>
        </div>
      ) : null}

      {p.tags?.length ? (
        <div className="section">
          <h2>Tags</h2>
          <div className="tags">
            {p.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {p.stack?.length ? (
        <div className="section">
          <h2>Tech Stack</h2>
          <div className="stack">
            {p.stack.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {p.links?.demo || p.links?.code ? (
        <div className="section">
          <h2>Links</h2>
          <div className="card-actions">
            {p.links?.demo ? (
              <Link
                className="link primary"
                href={p.links.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </Link>
            ) : null}
            {p.links?.code ? (
              <Link
                className="link"
                href={p.links.code}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
