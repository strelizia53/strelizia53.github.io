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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navbar */}
        <header className="bg-background-light dark:bg-background-dark shadow-md">
          <nav className="max-w-5xl mx-auto flex justify-between items-center py-4 px-6">
            <h1 className="text-xl font-bold">MyPortfolio</h1>
            <div className="flex items-center space-x-6">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:text-accent transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-accent transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-accent transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-accent transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
              <ThemeToggle />
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>

        {/* Footer */}
        <footer className="bg-muted text-center py-6 mt-12 text-foreground-light dark:text-foreground-dark">
          <p className="text-sm">
            © {new Date().getFullYear()} My Name. Built with Next.js.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
