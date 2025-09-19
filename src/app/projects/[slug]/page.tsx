// src/app/projects/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

      {p.images?.length ? (
        <div className="gallery" style={{ marginTop: 8 }}>
          <Carousel images={p.images} />
        </div>
      ) : p.imageUrl ? (
        <div className="gallery" style={{ marginTop: 8 }}>
          <Image
            src={p.imageUrl}
            alt={p.title}
            width={1600}
            height={900}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: 12,
            }}
          />
        </div>
      ) : null}

      {p.summary ? (
        <div className="section">
          <div className="prose">
            <p>{p.summary}</p>
          </div>
        </div>
      ) : null}

      {p.description ? (
        <div className="section">
          <h2>Overview</h2>
          <div className="prose">
            <p>{p.description}</p>
          </div>
        </div>
      ) : null}

      {p.problem ? (
        <div className="section">
          <h2>Problem</h2>
          <div className="prose">
            <p>{p.problem}</p>
          </div>
        </div>
      ) : null}

      {p.solution ? (
        <div className="section">
          <h2>Solution</h2>
          <div className="prose">
            <p>{p.solution}</p>
          </div>
        </div>
      ) : null}

      {p.highlights?.length ? (
        <div className="section">
          <h2>Highlights</h2>
          <div className="prose">
            <ul>
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {p.learnings?.length ? (
        <div className="section">
          <h2>Learnings</h2>
          <div className="prose">
            <ul>
              {p.learnings.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
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

      <div className="divider" />

      <div className="card-actions">
        <Link className="link" href="/projects">
          ← Back to Projects
        </Link>
      </div>
    </section>
  );
}

function Carousel({ images }: { images: { src: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);
  const current = images[index];

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid color-mix(in srgb, var(--fg) 14%, transparent)",
        }}
      >
        <Image
          src={current.src}
          alt={current.alt}
          width={1600}
          height={900}
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </div>
      {total > 1 ? (
        <div
          className="card-actions"
          style={{ justifyContent: "space-between", marginTop: 8 }}
        >
          <button className="link" onClick={prev} type="button">
            Prev
          </button>
          <span className="chip">
            {index + 1} / {total}
          </span>
          <button className="link" onClick={next} type="button">
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
