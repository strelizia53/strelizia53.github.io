// src/app/admin/projects/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { addProject, uploadFile } from "@/lib/firebaseHelpers";
import { useAuth } from "@/contexts/AuthContext";

type ProjectFormState = {
  slug: string;
  title: string;
  year: number;
  category: "Full-Stack" | "Frontend" | "API";
  summary: string;
  description?: string;
  problem?: string;
  solution?: string;
  highlights?: string[];
  learnings?: string[];
  tags: string[];
  stack: string[];
  links: {
    demo: string;
    code: string;
  };
  imageUrl?: string;
  imagePath?: string;
};

export default function NewProjectPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectFormState>({
    slug: "",
    title: "",
    year: new Date().getFullYear(),
    category: "Full-Stack",
    summary: "",
    description: "",
    problem: "",
    solution: "",
    highlights: [],
    learnings: [],
    tags: [],
    stack: [],
    links: { demo: "", code: "" },
    imageUrl: "",
    imagePath: "",
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [learningInput, setLearningInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "year") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || new Date().getFullYear(),
      }));
    } else if (name.startsWith("links.")) {
      const linkKey = name.split(".")[1] as "demo" | "code";
      setFormData((prev) => ({
        ...prev,
        links: { ...prev.links, [linkKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayAdd = (
    field: "highlights" | "learnings" | "tags" | "stack",
    value: string
  ) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));
  };

  const handleArrayRemove = (
    field: "highlights" | "learnings" | "tags" | "stack",
    index: number
  ) => {
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
      if (imageFile) {
        const { url, path } = await uploadFile(imageFile, "projects");
        finalImageUrl = url;
        finalImagePath = path;
      }
      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        imagePath: finalImagePath,
        year: Number(formData.year),
        links: {
          demo: formData.links.demo || "",
          code: formData.links.code || "",
        },
      };
      await addProject(payload);
      alert("Project created successfully!");
      router.push("/admin");
    } catch (err) {
      console.error("Error saving project:", err);
      setError("Failed to save project. Please try again.");
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
        <h1>Create New Project</h1>
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
              placeholder="my-awesome-project"
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
            <label htmlFor="year">Year *</label>
            <input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              min={2000}
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="Full-Stack">Full-Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="API">API</option>
            </select>
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

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          <div className="form-group">
            <label htmlFor="problem">Problem Statement</label>
            <textarea
              id="problem"
              name="problem"
              value={formData.problem || ""}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label htmlFor="solution">Solution</label>
            <textarea
              id="solution"
              name="solution"
              value={formData.solution || ""}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Highlights</label>
            <div className="input-with-button">
              <input
                type="text"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Add a highlight"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                  handleArrayAdd("highlights", highlightInput),
                  setHighlightInput(""))
                }
              />
              <button
                type="button"
                className="add-item-button"
                onClick={() => {
                  handleArrayAdd("highlights", highlightInput);
                  setHighlightInput("");
                }}
              >
                Add
              </button>
            </div>
            <div className="item-list">
              {formData.highlights?.map((item, idx) => (
                <span key={idx} className="item-chip">
                  {item}
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => handleArrayRemove("highlights", idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Key Learnings</label>
            <div className="input-with-button">
              <input
                type="text"
                value={learningInput}
                onChange={(e) => setLearningInput(e.target.value)}
                placeholder="Add a learning"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                  handleArrayAdd("learnings", learningInput),
                  setLearningInput(""))
                }
              />
              <button
                type="button"
                className="add-item-button"
                onClick={() => {
                  handleArrayAdd("learnings", learningInput);
                  setLearningInput("");
                }}
              >
                Add
              </button>
            </div>
            <div className="item-list">
              {formData.learnings?.map((item, idx) => (
                <span key={idx} className="item-chip">
                  {item}
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => handleArrayRemove("learnings", idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-grid">
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
            <label>Tech Stack</label>
            <div className="input-with-button">
              <input
                type="text"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                placeholder="Add a tech (e.g., React, Node.js)"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                  handleArrayAdd("stack", stackInput),
                  setStackInput(""))
                }
              />
              <button
                type="button"
                className="add-item-button"
                onClick={() => {
                  handleArrayAdd("stack", stackInput);
                  setStackInput("");
                }}
              >
                Add
              </button>
            </div>
            <div className="item-list">
              {formData.stack.map((tech, idx) => (
                <span key={idx} className="item-chip">
                  {tech}
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => handleArrayRemove("stack", idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="links.demo">Live Demo URL</label>
            <input
              id="links.demo"
              name="links.demo"
              type="url"
              value={formData.links.demo}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="links.code">GitHub URL</label>
            <input
              id="links.code"
              name="links.code"
              type="url"
              value={formData.links.code}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repo"
            />
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

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Saving..." : "Create Project"}
          </button>
          <Link href="/admin" className="cancel-button">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
