"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { POSTS, formatDate } from "@/lib/posts";

const ALL = "All";

export default function BlogPage() {
  const allTags = useMemo(() => {
    const s = new Set<string>();
    POSTS.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return [ALL, ...Array.from(s).sort()];
  }, []);

  const [tag, setTag] = useState<string>(ALL);

  const items = useMemo(() => {
    const sorted = [...POSTS].sort(
      (a, b) => +new Date(b.date) - +new Date(a.date)
    );
    if (tag === ALL) return sorted;
    return sorted.filter((p) => p.tags.includes(tag));
  }, [tag]);

  return (
    <section className="container fade-in">
      <div className="blog-hero">
        <h1>Blog</h1>
        <p>Short write-ups on things I build and learn along the way.</p>
      </div>

      <div className="blog-toolbar" role="toolbar" aria-label="Filter posts">
        {allTags.map((t) => (
          <button
            key={t}
            className="blog-pill"
            aria-pressed={tag === t}
            onClick={() => setTag(t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="blog-grid">
        {items.map((p) => (
          <article key={p.slug} className="post-card">
            <header>
              <h2 className="post-title">
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h2>
              <div className="post-meta">
                <span>{formatDate(p.date)}</span>
                <span>•</span>
                <span>{p.readingTime}</span>
              </div>
            </header>

            <p className="post-excerpt">{p.summary}</p>

            <div className="post-tags" aria-label="Tags">
              {p.tags.map((t) => (
                <span key={t} className="post-tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="post-actions">
              <Link className="read-link" href={`/blog/${p.slug}`}>
                Continue Reading
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
