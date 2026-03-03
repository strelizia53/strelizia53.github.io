// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiFolder, FiFileText } from "react-icons/fi";
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
    const unsubProjects = subscribeProjects((items) => setProjects(items));
    const unsubBlogs = subscribeBlogs((items) => setBlogs(items));
    return () => { unsubProjects(); unsubBlogs(); };
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
    if (!confirm(`Delete "${data.title}"? This cannot be undone.`)) return;
    try {
      await removeProject(id, data);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await removeBlog(id);
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog post");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <section className="fade-in" style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Dashboard header */}
      <div className="admin-dash-header">
        <div>
          <h1 className="admin-dash-title">Dashboard</h1>
          <p className="admin-dash-subtitle">Manage your portfolio content</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline admin-logout-btn">
          <FiLogOut size={16} />
          Sign out
        </button>
      </div>

      {/* Stats row */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FiFolder size={20} />
          </div>
          <div>
            <p className="admin-stat-value">{projects.length}</p>
            <p className="admin-stat-label">Projects</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FiFileText size={20} />
          </div>
          <div>
            <p className="admin-stat-value">{blogs.length}</p>
            <p className="admin-stat-label">Blog Posts</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="toolbar" role="tablist" aria-label="Content type">
        <button
          role="tab"
          className="pill"
          aria-pressed={activeTab === "projects"}
          onClick={() => setActiveTab("projects")}
        >
          <FiFolder size={14} />
          Projects
        </button>
        <button
          role="tab"
          className="pill"
          aria-pressed={activeTab === "blogs"}
          onClick={() => setActiveTab("blogs")}
        >
          <FiFileText size={14} />
          Blog Posts
        </button>
      </div>

      {/* Projects panel */}
      {activeTab === "projects" && (
        <div className="admin-section">
          <div className="admin-actions">
            <Link href="/admin/projects/new/new" className="btn btn-primary">
              <FiPlus size={16} />
              New Project
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="no-items">No projects yet. Add your first one!</div>
          ) : (
            <div className="admin-list">
              {projects.map((p) => (
                <div key={p.id} className="admin-item">
                  <div className="admin-item-info">
                    <p className="admin-item-title">{p.data.title}</p>
                    <div className="admin-item-meta">
                      <span>{p.data.year}</span>
                      {p.data.category && (
                        <>
                          <span>·</span>
                          <span>{p.data.category}</span>
                        </>
                      )}
                      {p.data.tags?.length ? (
                        <>
                          <span>·</span>
                          <span>{p.data.tags.slice(0, 3).join(", ")}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="admin-item-actions">
                    <Link
                      href={`/admin/projects/edit/${p.id}`}
                      className="admin-icon-btn admin-icon-btn--edit"
                      aria-label={`Edit ${p.data.title}`}
                      title="Edit"
                    >
                      <FiEdit2 size={15} />
                    </Link>
                    <button
                      className="admin-icon-btn admin-icon-btn--delete"
                      onClick={() => handleDeleteProject(p.id, p.data)}
                      aria-label={`Delete ${p.data.title}`}
                      title="Delete"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blogs panel */}
      {activeTab === "blogs" && (
        <div className="admin-section">
          <div className="admin-actions">
            <Link href="/admin/blogs/new/new" className="btn btn-primary">
              <FiPlus size={16} />
              New Post
            </Link>
          </div>

          {blogs.length === 0 ? (
            <div className="no-items">No blog posts yet. Write your first one!</div>
          ) : (
            <div className="admin-list">
              {blogs.map((b) => (
                <div key={b.id} className="admin-item">
                  <div className="admin-item-info">
                    <p className="admin-item-title">{b.data.title}</p>
                    <div className="admin-item-meta">
                      <span>
                        {new Date(b.data.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {b.data.readingTime && (
                        <>
                          <span>·</span>
                          <span>{b.data.readingTime}</span>
                        </>
                      )}
                      {b.data.tags?.length ? (
                        <>
                          <span>·</span>
                          <span>{b.data.tags.slice(0, 3).join(", ")}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="admin-item-actions">
                    <Link
                      href={`/admin/blogs/edit/${b.id}`}
                      className="admin-icon-btn admin-icon-btn--edit"
                      aria-label={`Edit ${b.data.title}`}
                      title="Edit"
                    >
                      <FiEdit2 size={15} />
                    </Link>
                    <button
                      className="admin-icon-btn admin-icon-btn--delete"
                      onClick={() => handleDeleteBlog(b.id, b.data.title)}
                      aria-label={`Delete ${b.data.title}`}
                      title="Delete"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
