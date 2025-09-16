import * as React from "react";
import type { JSX } from "react";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO string
  summary: string;
  tags: string[];
  readingTime: string;
};

export const POSTS: PostMeta[] = [
  {
    slug: "building-taskflow",
    title: "What I Learned Building TaskFlow",
    date: "2025-02-10",
    summary:
      "Notes from shipping a realtime Kanban app—optimistic UI, idempotent mutations, and schema trade-offs.",
    tags: ["Next.js", "Realtime", "Prisma"],
    readingTime: "6 min",
  },
  {
    slug: "api-auth-basics",
    title: "API Auth Basics Every New Dev Should Know",
    date: "2024-12-01",
    summary:
      "JWT vs session cookies, rotating tokens, and practical tips for protecting your endpoints.",
    tags: ["Auth", "Security", "Node"],
    readingTime: "7 min",
  },
];

/** Helper to format dates like "Feb 10, 2025" */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(iso)
  );
}

/** Simple route helper */
export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

/**
 * Post bodies as JSX to avoid adding a markdown dependency.
 * Replace these with MDX later if you like.
 */
export const PostBodies: Record<string, () => JSX.Element> = {
  "building-taskflow": () => (
    <>
      <p>
        TaskFlow started as a weekend experiment and ended up teaching me a ton
        about realtime UIs. Here are the biggest lessons.
      </p>
      <h2>Optimistic UI</h2>
      <p>
        For drag-and-drop, the client applies changes immediately, then
        reconciles with the server. The key is making mutations{" "}
        <em>idempotent</em>:
      </p>
      <pre>
        <code>{`PATCH /tasks/:id { position: 120, version: 9 }`}</code>
      </pre>
      <p>
        If packets arrive out of order, the server can discard stale updates by
        checking <code>version</code>.
      </p>
      <h2>Schema Trade-offs</h2>
      <ul>
        <li>Soft deletes + audit tables simplified recovery.</li>
        <li>
          Composite index on <code>(boardId, position)</code> kept queries fast.
        </li>
      </ul>
      <h2>Takeaways</h2>
      <ul>
        <li>Design your API for reconciliation, not perfection.</li>
        <li>Test with lossy network conditions early.</li>
      </ul>
    </>
  ),
  "api-auth-basics": () => (
    <>
      <p>
        Picking an auth strategy is mostly about trade-offs. Here’s a practical
        cheat-sheet.
      </p>
      <h2>Sessions vs JWT</h2>
      <ul>
        <li>Sessions: easy rotation, server state, good for browsers.</li>
        <li>
          JWT: stateless, great for APIs/services; watch token revocation.
        </li>
      </ul>
      <h2>Rotation & Revocation</h2>
      <p>
        Rotate refresh tokens on each use. Keep a short access token TTL (5–15
        minutes). Store hashes server-side.
      </p>
      <h2>Tips</h2>
      <ul>
        <li>
          Set <code>SameSite=Lax</code> and <code>HttpOnly</code> for cookies.
        </li>
        <li>Scope tokens narrowly; least privilege always.</li>
      </ul>
    </>
  ),
};
