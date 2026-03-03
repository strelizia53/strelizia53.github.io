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

      <div className="toolbar" role="toolbar" aria-label="Filter posts">
        {allTags.map((t) => (
          <button
            key={t}
            className="pill"
            aria-pressed={tag === t}
            onClick={() => setTag(t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="blog-list">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
          </div>
        ) : items.length === 0 ? (
          <div className="no-items">No posts found.</div>
        ) : (
          items.map((p) => (
            <article key={p.id} className="blog-item">
              {p.data.imageUrl ? (
                <div className="thumb" style={{ padding: 0 }}>
                  <Image
                    src={p.data.imageUrl}
                    alt={p.data.title}
                    width={1200}
                    height={630}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />
                </div>
              ) : null}

              <header>
                <h2 className="blog-title">
                  <Link href={`/blog/${p.data.slug}`} style={{ color: "inherit" }}>
                    {p.data.title}
                  </Link>
                </h2>
                <div className="blog-meta">
                  <span>
                    {new Date(p.data.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{p.data.readingTime}</span>
                </div>
              </header>

              {p.data.summary ? (
                <p className="blog-summary">{p.data.summary}</p>
              ) : null}

              {(p.data.tags || []).length ? (
                <div className="tags" aria-label="Tags">
                  {p.data.tags!.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="card-actions">
                <Link className="link primary" href={`/blog/${p.data.slug}`}>
                  Read Post &rarr;
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
