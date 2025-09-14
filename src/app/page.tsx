import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-24 text-center animate-fadeIn">
      <h1 className="text-5xl font-bold">
        Hi, I&apos;m <span className="text-accent">Your Name</span>
      </h1>
      <p className="text-lg max-w-xl text-foreground/80 dark:text-foreground-dark/80">
        I&apos;m a full-stack developer focused on building modern web applications.
      </p>
      <div className="flex gap-4">
        <Link
          href="/projects"
          className="px-6 py-3 rounded-md bg-accent text-foreground hover:bg-muted transition-colors"
        >
          View Projects
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-md border border-foreground dark:border-foreground-dark hover:bg-muted transition-colors"
        >
          Contact Me
        </Link>
      </div>
    </section>
  );
}

