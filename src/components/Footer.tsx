import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link href="/" className="brand">
            Strelizia53
          </Link>
          <p className="footer-tagline">
            Full-stack developer &mdash; building things that matter.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <p className="footer-nav-heading">Pages</p>
          <ul>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="footer-contact">
          <p className="footer-nav-heading">Connect</p>
          <div className="footer-social">
            <a
              href="https://github.com/strelizia53"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitHub"
            >
              <FaGithub size={18} />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/rushaid-khan"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} />
              LinkedIn
            </a>
            <a
              href="mailto:rushaidkhan53@gmail.com"
              className="footer-social-link"
              aria-label="Email"
            >
              <FiMail size={18} />
              Email
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {year} Rushaid Khan. Built with Next.js &amp; Firebase.</p>
      </div>
    </footer>
  );
}
