// src/app/admin/projects/[action]/[id?]/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import {
  addProject,
  updateProject,
  getProject,
  getProjectBySlug,
  uploadFile,
  deleteFile,
} from "@/lib/firebaseHelpers";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image"; // ✅ Import Image

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
  images?: { src: string; alt: string }[];
};

export default function ProjectFormPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { action, id } = params as { action: string; id?: string };

  // Debug: Try to extract ID from different possible parameter names
  const possibleId = useMemo(() => {
    const extractedId =
      id ||
      (params as Record<string, string | string[]>).id ||
      (params as Record<string, string | string[]>)["id?"] || // Handle the literal "id?" parameter name
      (params as Record<string, string | string[]>).slug ||
      (params as Record<string, string | string[]>).projectId;
    // Ensure we return a string, not an array
    return Array.isArray(extractedId) ? extractedId[0] : extractedId;
  }, [id, params]);

  // Debug: Log route parameters (removed to prevent re-renders)

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
    images: [],
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [learningInput, setLearningInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Fetch existing project if editing
  useEffect(() => {
    if (action === "edit" && possibleId && user && !hasLoadedData) {
      setLoading(true);
      setError("");
      (async () => {
        try {
          let project = await getProject(possibleId);
          if (!project) {
            const bySlug = await getProjectBySlug(possibleId);
            project = bySlug?.data || null;
          }
          if (project) {
            const newFormData = {
              slug: project.slug || "",
              title: project.title || "",
              year: project.year || new Date().getFullYear(),
              category: project.category || "Full-Stack",
              summary: project.summary || "",
              description: project.description || "",
              problem: project.problem || "",
              solution: project.solution || "",
              highlights: project.highlights || [],
              learnings: project.learnings || [],
              tags: project.tags || [],
              stack: project.stack || [],
              links: project.links || { demo: "", code: "" },
              imageUrl: project.imageUrl || "",
              imagePath: project.imagePath || "",
              images: project.images || [],
            };
            setFormData(newFormData);
            setHasLoadedData(true);
          } else {
            setError("Project not found.");
          }
        } catch (err) {
          console.error("Error fetching project:", err);
          setError("Failed to load project.");
        } finally {
          setLoading(false);
        }
      })();
    } else if (action === "new") {
      // Reset form for new project
      setFormData({
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
        images: [],
      });
      setError("");
      setImageFile(null);
    }
  }, [action, possibleId, user, hasLoadedData]);

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
        links: {
          ...prev.links,
          [linkKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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

      // Handle image upload
      if (imageFile) {
        // Delete old image if editing
        if (action === "edit" && formData.imagePath) {
          await deleteFile(formData.imagePath);
        }
        const { url, path } = await uploadFile(imageFile, "projects");
        finalImageUrl = url;
        finalImagePath = path;
      }

      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        imagePath: finalImagePath,
        images: formData.images || [],
        year: Number(formData.year),
        links: {
          demo: formData.links.demo || "",
          code: formData.links.code || "",
        },
      };

      if (action === "new") {
        await addProject(payload);
        alert("Project created successfully!");
      } else if (action === "edit" && possibleId) {
        await updateProject(possibleId, payload);
        alert("Project updated successfully!");
      } else {
        setError("Invalid action or missing ID for edit.");
        return;
      }

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

  if (loading && action === "edit") {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <section className="admin-form-container fade-in">
      <div className="admin-form-header">
        <button onClick={() => router.back()} className="back-button">
          <FiArrowLeft /> Back to Admin
        </button>

        <h1>{action === "new" ? "Create New Project" : "Edit Project"}</h1>
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
              placeholder="my-awesome-project"
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
            <label htmlFor="year">Year *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
              min="2000"
              max={new Date().getFullYear() + 1}
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
            required
            rows={3}
          />
        </div>

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

        <div className="form-grid">
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
              <span key={idx} className="highlight-item">
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
              <span key={idx} className="highlight-item">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleArrayAdd("stack", stackInput);
                    setStackInput("");
                  }
                }}
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
              type="url"
              id="links.demo"
              name="links.demo"
              value={formData.links.demo}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="links.code">GitHub URL</label>
            <input
              type="url"
              id="links.code"
              name="links.code"
              value={formData.links.code}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          {formData.imageUrl && (
            <div className="mb-4">
              <Image
                src={formData.imageUrl}
                alt="Current featured image"
                width={300}
                height={128}
                className="h-32 w-auto object-cover rounded"
                unoptimized
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
              ? "Create Project"
              : "Update Project"}
          </button>
        </div>
      </form>
    </section>
  );
}
