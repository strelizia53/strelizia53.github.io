import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, allSlugs, getProject } from "@/lib/projects";

type PageProps = { params: { slug: string } };
export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const p = getProject(params.slug);
  return {
    title: p ? `${p.title} · Projects` : "Project",
    description: p?.summary ?? "Project case study",
  };
}

export default function ProjectPage({ params }: PageProps) {
  const p = getProject(params.slug);
  if (!p) return notFound();

  return (
    <article className="container fade-in">
      {/* breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/projects">Projects</Link>
        <span aria-hidden>›</span>
        <span>{p.title}</span>
      </nav>

      {/* hero */}
      <header className="project-hero">
        <h1 className="project-title">{p.title}</h1>
        <div className="meta">
          <span className="badge">{p.category}</span>
          <span className="chip">Year: {p.year}</span>
          <div className="stack" aria-label="Tech stack">
            {p.stack.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>

        <p className="prose">{p.summary}</p>

        <div className="card-actions" style={{ marginTop: 6 }}>
          {p.links.demo && (
            <Link
              href={p.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="link primary"
            >
              Live Demo
            </Link>
          )}
          <Link
            href={p.links.code}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Source Code
          </Link>
        </div>
      </header>

      {/* gallery */}
      {p.images && p.images.length > 0 && (
        <div className="gallery" role="group" aria-label="Screenshots">
          {p.images.map((img) => (
            <img key={img.src} src={img.src} alt={img.alt} />
          ))}
        </div>
      )}

      <div className="divider" />

      {/* sections */}
      <section className="section">
        <h2>Overview</h2>
        <div className="prose">
          <p>{p.description ?? "Overview coming soon."}</p>
        </div>
      </section>

      {p.problem && (
        <section className="section">
          <h2>Problem</h2>
          <div className="prose">
            <p>{p.problem}</p>
          </div>
        </section>
      )}

      {p.solution && (
        <section className="section">
          <h2>Solution</h2>
          <div className="prose">
            <p>{p.solution}</p>
          </div>
        </section>
      )}

      {p.highlights && p.highlights.length > 0 && (
        <section className="section">
          <h2>Highlights</h2>
          <div className="prose">
            <ul>
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {p.learnings && p.learnings.length > 0 && (
        <section className="section">
          <h2>Learnings</h2>
          <div className="prose">
            <ul>
              {p.learnings.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* KPIs (optional) */}
      {/* <div className="kpis">
        <div className="stat"><b>2.3k</b> Monthly users</div>
        <div className="stat"><b>~45ms</b> P95 latency</div>
        <div className="stat"><b>+18%</b> Task throughput</div>
      </div> */}
    </article>
  );
}
