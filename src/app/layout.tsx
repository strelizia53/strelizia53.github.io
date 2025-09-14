import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F6F6F6] text-[#000000]`}
      >
        {/* Navbar */}
        <header className="bg-[#F6F6F6] shadow-md">
          <nav className="max-w-5xl mx-auto flex justify-between items-center py-4 px-6">
            <h1 className="text-xl font-bold">MyPortfolio</h1>
            <ul className="flex space-x-6">
              <li>
                <a href="/" className="hover:text-[#CFFFE2] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  className="hover:text-[#CFFFE2] transition-colors"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-[#CFFFE2] transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-[#CFFFE2] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>

        {/* Footer */}
        <footer className="bg-[#A2D5C6] text-center py-6 mt-12">
          <p className="text-sm">
            © {new Date().getFullYear()} My Name. Built with Next.js.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#CFFFE2] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#CFFFE2] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
