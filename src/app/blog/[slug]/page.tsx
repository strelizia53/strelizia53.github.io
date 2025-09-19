// src/app/blog/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getBlogBySlug, type BlogDoc } from "@/lib/firebaseHelpers";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blog post...</p>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const post = data.data;

  return (
    <section className="container fade-in">
      {/* Banner Image */}
      {post.images?.length ? (
        <div className="blog-banner">
          <Carousel images={post.images} />
        </div>
      ) : post.imageUrl ? (
        <div className="blog-banner">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1600}
            height={400}
            className="banner-image"
          />
        </div>
      ) : null}

      <div className="post-hero">
        <h1 className="post-h1">{post.title}</h1>
        <div className="post-info">
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
      </div>

      {post.tags?.length ? (
        <div className="post-tags" aria-label="Tags">
          {post.tags.map((t) => (
            <span key={t} className="post-tag">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="blog-content">
        <div className="prose">
          {post.summary ? <p>{post.summary}</p> : null}
          {post.content ? (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>
      </div>

      <div className="post-actions">
        <Link className="read-link" href="/blog">
          ← Back to Blog
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
    <div className="banner-carousel">
      <Image
        src={current.src}
        alt={current.alt}
        width={1600}
        height={400}
        className="banner-image"
      />
      {total > 1 && (
        <div className="banner-carousel-controls">
          <button
            className="banner-carousel-button"
            onClick={prev}
            type="button"
          >
            ←
          </button>
          <span className="banner-carousel-indicator">
            {index + 1} / {total}
          </span>
          <button
            className="banner-carousel-button"
            onClick={next}
            type="button"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
