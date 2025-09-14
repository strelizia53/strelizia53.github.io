export type Project = {
  slug: string;
  title: string;
  year: number;
  category: "Full-Stack" | "Frontend" | "API";
  summary: string;
  description?: string;
  problem?: string;
  solution?: string;
  highlights?: string[];
  learnings?: string[];
  tags: string[];
  stack: string[];
  links: { demo?: string; code: string };
  images?: { src: string; alt: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "taskflow",
    title: "TaskFlow",
    year: 2025,
    category: "Full-Stack",
    summary: "Task manager with auth, boards, and realtime updates.",
    description:
      "A productivity app with Kanban boards, drag-and-drop tasks, and collaborative updates.",
    problem:
      "Small teams struggle to coordinate tasks without paying for heavy tools.",
    solution:
      "Lightweight, fast UI with optimistic updates; WebSocket channel per board; RBAC for sharing.",
    highlights: [
      "Realtime drag-and-drop with optimistic UI + server reconciliation",
      "Email/password + OAuth with session rotation",
      "Postgres + Prisma schema with soft deletes and audit trail",
    ],
    learnings: [
      "Stabilizing realtime UIs with idempotent mutations",
      "Caching board queries to avoid thrash on reorder",
    ],
    tags: ["CRUD", "Auth", "Realtime"],
    stack: ["Next.js", "Postgres", "Prisma", "WebSockets"],
    links: { demo: "#", code: "https://github.com/you/taskflow" },
    images: [
      { src: "/images/taskflow-board.png", alt: "TaskFlow board view" },
      { src: "/images/taskflow-auth.png", alt: "TaskFlow auth screen" },
    ],
  },
  {
    slug: "moviescope",
    title: "MovieScope",
    year: 2024,
    category: "Frontend",
    summary: "Search and bookmark movies with local caching.",
    tags: ["Search", "Caching"],
    stack: ["React", "Zustand", "Vite"],
    links: { demo: "#", code: "https://github.com/you/moviescope" },
    images: [{ src: "/images/moviescope.png", alt: "MovieScope UI" }],
  },
  {
    slug: "devnotes-api",
    title: "DevNotes API",
    year: 2024,
    category: "API",
    summary: "Notes REST API with JWT, pagination, and OpenAPI docs.",
    tags: ["REST", "JWT", "Docs"],
    stack: ["Node", "Express", "MongoDB", "Swagger"],
    links: { code: "https://github.com/you/devnotes-api" },
  },
  {
    slug: "shoply",
    title: "Shoply",
    year: 2025,
    category: "Full-Stack",
    summary: "Mini store with cart, checkout, and analytics.",
    tags: ["E-commerce", "Dashboard"],
    stack: ["Next.js", "Stripe", "PlanetScale"],
    links: { demo: "#", code: "https://github.com/you/shoply" },
  },
];

export const allSlugs = () => PROJECTS.map((p) => p.slug);
export const getProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);
