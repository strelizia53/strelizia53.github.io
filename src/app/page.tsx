export default function Home() {
  return (
    <section className="text-center space-y-6">
      <h2 className="text-4xl font-bold">Hi, I&apos;m Your Name</h2>
      <p className="text-lg max-w-2xl mx-auto">
        I&apos;m a full-stack developer focused on building modern web applications.
      </p>
      <a
        href="/projects"
        className="inline-block px-6 py-3 rounded bg-accent hover:bg-muted transition-colors text-foreground-light dark:text-foreground-dark"
      >
        View Projects
      </a>
    </section>
  );
}
