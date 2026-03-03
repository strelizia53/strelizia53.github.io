import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

export default function Home() {
  const stack = [
    "React", "Next.js", "TypeScript", "Node.js", "Firebase", "Python",
  ];

  return (
    <section className="hero fade-in">
      {/* Availability badge */}
      <div className="availability-badge">
        <span className="availability-dot" />
        Available for opportunities
      </div>

      <h1>
        Hi, I&apos;m{" "}
        <span className="marker">Rushaid Khan</span>
      </h1>

      <p className="hero-tagline">
        Full-stack developer building modern, performant web apps — from pixel-perfect
        UIs to scalable APIs.
      </p>

      {/* CTA buttons */}
      <div className="hero-actions">
        <Link href="/projects" className="btn btn-primary">
          View Projects
        </Link>
        <Link href="/about" className="btn btn-outline">
          About Me
        </Link>
        <Link href="/contact" className="btn btn-outline">
          Contact
        </Link>
      </div>

      {/* Social links */}
      <div className="hero-social">
        <a
          href="https://github.com/strelizia53"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label="GitHub"
        >
          <FaGithub size={20} />
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/rushaid-khan"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label="LinkedIn"
        >
          <FaLinkedin size={20} />
          LinkedIn
        </a>
        <a
          href="mailto:rushaidkhan53@gmail.com"
          className="social-link"
          aria-label="Email"
        >
          <FiMail size={20} />
          Email
        </a>
      </div>

      {/* Tech stack row */}
      <div className="hero-stack">
        <span className="hero-stack-label">Stack</span>
        <div className="hero-stack-pills">
          {stack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
