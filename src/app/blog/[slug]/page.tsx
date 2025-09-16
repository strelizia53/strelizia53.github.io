import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost, PostBodies, formatDate } from "@/lib/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = getPost(params.slug);
  return {
    title: p ? `${p.title} · Blog` : "Blog post",
    description: p?.summary ?? "Post",
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) return notFound();
  const Body = PostBodies[p.slug] ?? (() => <p>Coming soon…</p>);

  return (
    <article className="container fade-in">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/blog">Blog</Link>
        <span aria-hidden>›</span>
        <span>{p.title}</span>
      </nav>

      <header className="post-hero">
        <h1 className="post-h1">{p.title}</h1>
        <div className="post-info">
          <span>{formatDate(p.date)}</span>
          <span>•</span>
          <span>{p.readingTime}</span>
        </div>
      </header>

      <section className="prose">
        <Body />
      </section>
    </article>
  );
}
