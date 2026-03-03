import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // ✅ client nav
import Footer from "@/components/Footer"; // optional

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rushaid Khan — Full-Stack Developer",
    template: "%s | Rushaid Khan",
  },
  description:
    "Full-stack developer building modern web applications with React, Next.js, Node.js, and Firebase.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        <main className="container" style={{ paddingBlock: "32px" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
