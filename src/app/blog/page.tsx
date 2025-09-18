"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { subscribeBlogs, type BlogDoc } from "@/lib/firebaseHelpers";
import Image from "next/image";

const ALL = "All";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Array<{ id: string; data: BlogDoc }>>([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState<string>(ALL);

  useEffect(() => {
    const unsub = subscribeBlogs((items) => {
      setBlogs(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    blogs.forEach((p) => (p.data.tags || []).forEach((t) => s.add(t)));
    return [ALL, ...Array.from(s).sort()];
  }, [blogs]);

  const items = useMemo(() => {
    const sorted = [...blogs].sort(
      (a, b) => +new Date(b.data.date) - +new Date(a.data.date)
    );
    if (tag === ALL) return sorted;
    return sorted.filter((p) => (p.data.tags || []).includes(tag));
  }, [blogs, tag]);

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
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="no-items">No posts found.</div>
        ) : (
          items.map((p) => (
            <article key={p.id} className="post-card">
              {p.data.imageUrl ? (
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border:
                      "1px solid color-mix(in srgb, var(--fg) 14%, transparent)",
                  }}
                >
                  <Image
                    src={p.data.imageUrl}
                    alt={p.data.title}
                    width={1200}
                    height={630}
                    style={{ width: "100%", height: 180, objectFit: "cover" }}
                  />
                </div>
              ) : null}
              <header>
                <h2 className="post-title">
                  <Link href={`/blog/${p.data.slug}`}>{p.data.title}</Link>
                </h2>
                <div className="post-meta">
                  <span>{new Date(p.data.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{p.data.readingTime}</span>
                </div>
              </header>

              {p.data.summary ? (
                <p className="post-excerpt">{p.data.summary}</p>
              ) : null}

              {(p.data.tags || []).length ? (
                <div className="post-tags" aria-label="Tags">
                  {p.data.tags!.map((t) => (
                    <span key={t} className="post-tag">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="post-actions">
                <Link className="read-link" href={`/blog/${p.data.slug}`}>
                  Continue Reading
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
