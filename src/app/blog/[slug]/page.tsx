// src/app/blog/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getBlogBySlug, type BlogDoc } from "@/lib/firebaseHelpers";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [data, setData] = useState<{ id: string; data: BlogDoc } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getBlogBySlug(slug)
      .then((res) => {
        if (!mounted) return;
        if (!res) {
          router.replace("/blog");
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

  const post = data.data;

  return (
    <section className="container fade-in">
      <div className="post-hero">
        <h1 className="post-h1">{post.title}</h1>
        <div className="post-info">
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
      </div>

      {post.imageUrl ? (
        <div
          style={{
            marginBottom: 12,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid color-mix(in srgb, var(--fg) 14%, transparent)",
          }}
        >
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1200}
            height={630}
            style={{ width: "100%", height: 320, objectFit: "cover" }}
          />
        </div>
      ) : null}

      {post.tags?.length ? (
        <div className="post-tags" aria-label="Tags">
          {post.tags.map((t) => (
            <span key={t} className="post-tag">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="prose" style={{ marginTop: 12 }}>
        {post.summary ? <p>{post.summary}</p> : null}
        {post.content ? (
          <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
        ) : null}
      </div>

      <div className="post-actions" style={{ marginTop: 16 }}>
        <Link className="read-link" href="/blog">
          Back to Blog
        </Link>
      </div>
    </section>
  );
}
