// src/app/admin/blogs/[action]/[id?]/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import {
  addBlog,
  updateBlog,
  getBlog,
  uploadFile,
  deleteFile,
  getBlogBySlug,
} from "@/lib/firebaseHelpers";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

type BlogFormState = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  tags: string[];
  readingTime: string;
  imageUrl?: string;
  imagePath?: string;
  images?: { src: string; alt: string }[];
};

const today = new Date().toISOString().split("T")[0];

const EMPTY_FORM: BlogFormState = {
  slug: "",
  title: "",
  summary: "",
  content: "",
  date: today,
  tags: [],
  readingTime: "5 min read",
  imageUrl: "",
  imagePath: "",
  images: [],
};

export default function BlogFormPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { action, id } = params as { action: string; id?: string };

  const possibleId = useMemo(() => {
    const extracted =
      id ||
      (params as Record<string, string | string[]>).id ||
      (params as Record<string, string | string[]>)["id?"] ||
      (params as Record<string, string | string[]>).slug ||
      (params as Record<string, string | string[]>).blogId;
    return Array.isArray(extracted) ? extracted[0] : extracted;
  }, [id, params]);

  const [formData, setFormData] = useState<BlogFormState>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    if (action === "edit" && possibleId && user && !hasLoadedData) {
      setLoading(true);
      setError("");
      (async () => {
        try {
          let blog = await getBlog(possibleId);
          if (!blog) {
            const bySlug = await getBlogBySlug(possibleId);
            blog = bySlug?.data || null;
          }
          if (blog) {
            setFormData({
              slug: blog.slug || "",
              title: blog.title || "",
              summary: blog.summary || "",
              content: blog.content || "",
              date: blog.date || today,
              tags: blog.tags || [],
              readingTime: blog.readingTime || "5 min read",
              imageUrl: blog.imageUrl || "",
              imagePath: blog.imagePath || "",
              images: blog.images || [],
            });
            setHasLoadedData(true);
          } else {
            setError("Blog post not found.");
          }
        } catch (err) {
          console.error("Error fetching blog:", err);
          setError("Failed to load blog post.");
        } finally {
          setLoading(false);
        }
      })();
    } else if (action === "new") {
      setFormData(EMPTY_FORM);
      setError("");
      setImageFile(null);
    }
  }, [action, possibleId, user, hasLoadedData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      let finalImageUrl = formData.imageUrl;
      let finalImagePath = formData.imagePath;
      if (imageFile) {
        if (action === "edit" && formData.imagePath) await deleteFile(formData.imagePath);
        const { url, path } = await uploadFile(imageFile, "blogs");
        finalImageUrl = url;
        finalImagePath = path;
      }
      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        imagePath: finalImagePath,
        images: formData.images || [],
      };
      if (action === "new") {
        await addBlog(payload);
      } else if (action === "edit" && possibleId) {
        await updateBlog(possibleId, payload);
      } else {
        setError("Invalid action or missing ID.");
        return;
      }
      router.push("/admin");
    } catch (err) {
      console.error("Error saving blog:", err);
      setError("Failed to save blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="no-items">You must be logged in to access this page.</div>;
  }

  if (loading && action === "edit") {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <section className="admin-form-container fade-in">
      <div className="admin-form-header">
        <button onClick={() => router.back()} className="back-button">
          <FiArrowLeft size={16} /> Back to Admin
        </button>
        <h1>{action === "new" ? "Create New Blog Post" : "Edit Blog Post"}</h1>
      </div>

      {error && <div className="status error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Basic info */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="slug">Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              placeholder="my-awesome-blog-post"
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Publish Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="readingTime">Reading Time *</label>
            <input
              type="text"
              id="readingTime"
              name="readingTime"
              value={formData.readingTime}
              onChange={handleInputChange}
              required
              placeholder="5 min read"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary *</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            required
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content (Markdown supported) *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={16}
            className="content-textarea"
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label>Tags</label>
          <div className="input-with-button">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!tagInput.trim()) return;
                  setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
                  setTagInput("");
                }
              }}
            />
            <button
              type="button"
              className="add-item-button"
              onClick={() => {
                if (!tagInput.trim()) return;
                setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
                setTagInput("");
              }}
            >
              Add
            </button>
          </div>
          <div className="item-list">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="item-tag">
                {tag}
                <button
                  type="button"
                  className="remove-item"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="form-group">
          <label>Featured Image</label>
          {formData.imageUrl && (
            <div className="image-preview" style={{ marginBottom: "var(--space-md)" }}>
              <Image
                src={formData.imageUrl}
                alt="Current featured image"
                width={600}
                height={240}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && setImageFile(e.target.files[0])}
            className="file-input"
          />
          <p className="form-help">
            {imageFile ? `Selected: ${imageFile.name}` : "No file selected"}
          </p>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Saving…" : action === "new" ? "Create Post" : "Save Changes"}
          </button>
          <button type="button" onClick={() => router.push("/admin")} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
