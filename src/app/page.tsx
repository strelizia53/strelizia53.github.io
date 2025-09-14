import Link from "next/link";

export default function Home() {
  return (
    <section className="hero fade-in">
      <h1>
        Hi, I&apos;m <span className="highlight">Rushaid Khan</span>
      </h1>

      <p>
        I&apos;m a full-stack developer focused on building modern web
        applications.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Link href="/projects" className="btn btn-primary">
          View Projects
        </Link>
        <Link href="/contact" className="btn btn-outline">
          Contact Me
        </Link>
      </div>
    </section>
  );
}
