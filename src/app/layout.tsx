import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Personal portfolio of a full stack developer",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Navbar */}
        <header className="header">
          <div className="container nav">
            <Link href="/" className="brand" aria-label="Go to home">
              MyPortfolio
            </Link>

            <nav aria-label="Primary">
              <ul className="nav-list">
                <li>
                  <Link href="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="nav-link">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="nav-link">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="nav-link">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            <ThemeToggle />
          </div>
        </header>

        {/* Main */}
        <main className="container" style={{ paddingBlock: "32px" }}>
          {children}
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} My Name — Built with Next.js.
            </p>
            <div className="footer-links">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
