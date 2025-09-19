// src/app/admin/blogs/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { addBlog, uploadFile } from "@/lib/firebaseHelpers";
import { useAuth } from "@/contexts/AuthContext";

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

export default function NewBlogPage() {
  const { user } = useAuth();
  const router = useRouter();
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
  });

  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleMultiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 5);
    setImageFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      let finalImageUrl = formData.imageUrl;
      let finalImagePath = formData.imagePath;
      let finalImages: { src: string; alt: string }[] | undefined =
        formData.images;
      if (imageFile) {
        const { url, path } = await uploadFile(imageFile, "blogs");
        finalImageUrl = url;
        finalImagePath = path;
      }
      if (imageFiles.length) {
        const uploaded = [] as { src: string; alt: string }[];
        for (const f of imageFiles.slice(0, 5)) {
          const { url } = await uploadFile(f, "blogs");
          uploaded.push({ src: url, alt: formData.title || f.name });
        }
        finalImages = uploaded;
      }
      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        imagePath: finalImagePath,
        images: finalImages,
      };
      await addBlog(payload);
      alert("Blog post created successfully!");
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

  return (
    <section className="admin-form-container fade-in">
      <div className="admin-form-header">
        <Link href="/admin" className="back-button">
          <FiArrowLeft /> Back to Admin
        </Link>
        <h1>Create New Blog Post</h1>
      </div>

      {error && <div className="status error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="slug">Slug (URL-friendly ID) *</label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="my-awesome-blog-post"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Publish Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="readingTime">Reading Time *</label>
            <input
              id="readingTime"
              name="readingTime"
              type="text"
              placeholder="5 min read"
              value={formData.readingTime}
              onChange={handleInputChange}
              required
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
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content (Markdown supported) *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={12}
            required
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
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <p className="form-help">
            {imageFile ? `Selected: ${imageFile.name}` : "No file selected"}
          </p>
        </div>

        <div className="form-group">
          <label>Additional Images (up to 5)</label>
          <input
            className="file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultiImageChange}
          />
          <p className="form-help">
            {imageFiles.length
              ? `${imageFiles.length} selected`
              : "None selected"}
          </p>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Saving..." : "Create Blog Post"}
          </button>
          <Link href="/admin" className="cancel-button">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
