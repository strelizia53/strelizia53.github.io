// src/app/admin/blogs/[action]/[id?]/page.tsx
"use client";

import { useState, useEffect } from "react";
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
import Image from "next/image"; // ✅ Import Image

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

export default function BlogFormPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { action, id } = params as { action: string; id?: string };

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<BlogFormState>({
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
  });

  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing blog if editing
  useEffect(() => {
    if (action === "edit" && id && user) {
      setLoading(true);
      (async () => {
        try {
          let blog = await getBlog(id);
          if (!blog) {
            const bySlug = await getBlogBySlug(id);
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
    }
  }, [action, id, user, today]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayAdd = (field: "tags", value: string) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));
  };

  const handleArrayRemove = (field: "tags", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      let finalImageUrl = formData.imageUrl;
      let finalImagePath = formData.imagePath;

      // Handle image upload
      if (imageFile) {
        // Delete old image if editing
        if (action === "edit" && formData.imagePath) {
          await deleteFile(formData.imagePath);
        }
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
        alert("Blog post created successfully!");
      } else if (action === "edit" && id) {
        await updateBlog(id, payload);
        alert("Blog post updated successfully!");
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
    return (
      <div className="p-6">You must be logged in to access this page.</div>
    );
  }

  if (loading && action === "edit") {
    return (
      <section className="loading-container">
        <div className="loading-spinner"></div>
      </section>
    );
  }

  return (
    <section className="admin-form-container fade-in">
      <div className="admin-form-header">
        <button onClick={() => router.back()} className="back-button">
          <FiArrowLeft /> Back to Admin
        </button>
        <h1>{action === "new" ? "Create New Blog Post" : "Edit Blog Post"}</h1>
      </div>

      {error && <div className="status error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="slug">Slug (URL-friendly ID) *</label>
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
            rows={12}
            className="content-textarea"
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="input-with-button">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleArrayAdd("tags", tagInput),
                setTagInput(""))
              }
            />
            <button
              type="button"
              className="add-item-button"
              onClick={() => {
                handleArrayAdd("tags", tagInput);
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
                  onClick={() => handleArrayRemove("tags", idx)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          {formData.imageUrl && (
            <div className="image-preview" style={{ marginBottom: 8 }}>
              <Image
                src={formData.imageUrl}
                alt="Current featured image"
                width={600}
                height={240}
                style={{ width: "100%", height: 160, objectFit: "cover" }}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          <p className="form-help">
            {imageFile ? `Selected: ${imageFile.name}` : "No file selected"}
          </p>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading
              ? "Saving..."
              : action === "new"
              ? "Create Blog Post"
              : "Update Blog Post"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
