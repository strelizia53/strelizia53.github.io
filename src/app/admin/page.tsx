// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPlus, FiEdit, FiTrash, FiLogOut } from "react-icons/fi";
import {
  subscribeProjects,
  subscribeBlogs,
  removeProject,
  removeBlog,
  ProjectDoc,
  BlogDoc,
} from "@/lib/firebaseHelpers";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

type ProjectWithId = { id: string; data: ProjectDoc };
type BlogWithId = { id: string; data: BlogDoc };

function AdminContent() {
  const { logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "blogs">("projects");
  const [projects, setProjects] = useState<ProjectWithId[]>([]);
  const [blogs, setBlogs] = useState<BlogWithId[]>([]);

  useEffect(() => {
    // Subscribe to real-time updates for projects
    const unsubscribeProjects = subscribeProjects((items) => {
      setProjects(items);
    });

    // Subscribe to real-time updates for blogs
    const unsubscribeBlogs = subscribeBlogs((items) => {
      setBlogs(items);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeProjects();
      unsubscribeBlogs();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleDeleteProject = async (id: string, data: ProjectDoc) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await removeProject(id, data);
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project");
      }
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await removeBlog(id);
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog post");
      }
    }
  };

  return (
    <section className="container fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700"
        >
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Rest of your admin content remains the same */}
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

          {projects.length === 0 ? (
            <p className="text-gray-500">No projects found.</p>
          ) : (
            <ul className="space-y-4">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{p.data.title}</h3>
                    <p className="text-sm text-gray-500">
                      {p.data.description?.substring(0, 100)}
                      {p.data.description && p.data.description.length > 100
                        ? "..."
                        : ""}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {p.data.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/projects/edit/${p.id}`}
                      className="text-blue-500"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteProject(p.id, p.data)}
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
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

          {blogs.length === 0 ? (
            <p className="text-gray-500">No blog posts found.</p>
          ) : (
            <ul className="space-y-4">
              {blogs.map((b) => (
                <li
                  key={b.id}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{b.data.title}</h3>
                    <p className="text-sm text-gray-500">
                      {b.data.summary?.substring(0, 100)}
                      {b.data.summary && b.data.summary.length > 100
                        ? "..."
                        : ""}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {b.data.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/blogs/edit/${b.id}`}
                      className="text-blue-500"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteBlog(b.id)}
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}
