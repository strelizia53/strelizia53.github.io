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
import Login from "@/components/Login";

type ProjectWithId = { id: string; data: ProjectDoc };
type BlogWithId = { id: string; data: BlogDoc };

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "blogs">("projects");
  const [projects, setProjects] = useState<ProjectWithId[]>([]);
  const [blogs, setBlogs] = useState<BlogWithId[]>([]);

  useEffect(() => {
    if (!user) return;

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
  }, [user]);

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

  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <Login />;
  }

  // Show admin content if authenticated
  return (
    <section className="admin-container fade-in">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab("projects")}
          className={activeTab === "projects" ? "tab-active" : "tab-inactive"}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={activeTab === "blogs" ? "tab-active" : "tab-inactive"}
        >
          Blogs
        </button>
      </div>

      {/* Content */}
      {activeTab === "projects" && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Manage Projects</h2>
            <Link href="/admin/projects/new" className="add-button">
              <FiPlus /> Add Project
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="no-items">No projects found.</p>
          ) : (
            <ul className="items-list">
              {projects.map((p) => (
                <li key={p.id} className="item-card">
                  <div className="item-content">
                    <h3>{p.data.title}</h3>
                    <p className="item-description">
                      {p.data.description?.substring(0, 100)}
                      {p.data.description && p.data.description.length > 100
                        ? "..."
                        : ""}
                    </p>
                    <div className="item-tags">
                      {p.data.tags?.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="item-actions">
                    <Link
                      href={`/admin/projects/edit/${p.id}`}
                      className="edit-button"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      className="delete-button"
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
        <div className="admin-section">
          <div className="section-header">
            <h2>Manage Blogs</h2>
            <Link href="/admin/blogs/new" className="add-button">
              <FiPlus /> Add Blog
            </Link>
          </div>

          {blogs.length === 0 ? (
            <p className="no-items">No blog posts found.</p>
          ) : (
            <ul className="items-list">
              {blogs.map((b) => (
                <li key={b.id} className="item-card">
                  <div className="item-content">
                    <h3>{b.data.title}</h3>
                    <p className="item-description">
                      {b.data.summary?.substring(0, 100)}
                      {b.data.summary && b.data.summary.length > 100
                        ? "..."
                        : ""}
                    </p>
                    <div className="item-tags">
                      {b.data.tags?.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="item-actions">
                    <Link
                      href={`/admin/blogs/edit/${b.id}`}
                      className="edit-button"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      className="delete-button"
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
