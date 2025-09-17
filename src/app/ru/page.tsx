"use client";

import { useState } from "react";
import Link from "next/link";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";

type Project = {
  id: string;
  title: string;
  description: string;
};

type Blog = {
  id: string;
  title: string;
  excerpt: string;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"projects" | "blogs">("projects");

  // ✅ For now we’ll use dummy data (later we’ll replace with API calls)
  const projects: Project[] = [
    { id: "1", title: "Portfolio Website", description: "A modern portfolio" },
  ];

  const blogs: Blog[] = [
    {
      id: "1",
      title: "Getting Started with Next.js",
      excerpt: "A beginner guide",
    },
  ];

  return (
    <section className="container fade-in">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "projects" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "blogs" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Blogs
        </button>
      </div>

      {/* Content */}
      {activeTab === "projects" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Manage Projects</h2>
            <Link
              href="/admin/projects/new"
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Add Project
            </Link>
          </div>

          <ul className="space-y-4">
            {projects.map((p) => (
              <li
                key={p.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.description}</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/projects/edit/${p.id}`}
                    className="text-blue-500"
                  >
                    <FiEdit size={18} />
                  </Link>
                  <button className="text-red-500">
                    <FiTrash size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "blogs" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Manage Blogs</h2>
            <Link
              href="/admin/blogs/new"
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Add Blog
            </Link>
          </div>

          <ul className="space-y-4">
            {blogs.map((b) => (
              <li
                key={b.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{b.title}</h3>
                  <p className="text-sm text-gray-500">{b.excerpt}</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/blogs/edit/${b.id}`}
                    className="text-blue-500"
                  >
                    <FiEdit size={18} />
                  </Link>
                  <button className="text-red-500">
                    <FiTrash size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
