// src/app/admin/project/[action]/[id?]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import {
  addProject,
  updateProject,
  getProject,
  uploadFile,
  deleteFile,
} from "@/lib/firebaseHelpers";
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

export default function ProjectFormPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { action, id } = params as { action: string; id?: string };

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

  // Fetch existing project if editing
  useEffect(() => {
    if (action === "edit" && id && user) {
      setLoading(true);
      getProject(id)
        .then((project) => {
          if (project) {
            setFormData({
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
            });
          } else {
            setError("Project not found.");
          }
        })
        .catch((err) => {
          console.error("Error fetching project:", err);
          setError("Failed to load project.");
        })
        .finally(() => setLoading(false));
    }
  }, [action, id, user]);

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
        year: Number(formData.year),
        links: {
          demo: formData.links.demo || "",
          code: formData.links.code || "",
        },
      };

      if (action === "new") {
        await addProject(payload);
        alert("Project created successfully!");
      } else if (action === "edit" && id) {
        await updateProject(id, payload);
        alert("Project updated successfully!");
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
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <FiArrowLeft /> Back to Admin
      </button>

      <h1 className="text-2xl font-bold mb-6">
        {action === "new" ? "Create New Project" : "Edit Project"}
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug (URL-friendly ID) *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            placeholder="my-awesome-project"
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Year *
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
            min="2000"
            max={new Date().getFullYear() + 1}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="Full-Stack">Full-Stack</option>
            <option value="Frontend">Frontend</option>
            <option value="API">API</option>
          </select>
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium mb-1">
            Summary *
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Problem */}
        <div>
          <label htmlFor="problem" className="block text-sm font-medium mb-1">
            Problem Statement
          </label>
          <textarea
            id="problem"
            name="problem"
            value={formData.problem || ""}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Solution */}
        <div>
          <label htmlFor="solution" className="block text-sm font-medium mb-1">
            Solution
          </label>
          <textarea
            id="solution"
            name="solution"
            value={formData.solution || ""}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-sm font-medium mb-1">Highlights</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              placeholder="Add a highlight"
              className="flex-1 p-2 border border-gray-300 rounded"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleArrayAdd("highlights", highlightInput),
                setHighlightInput(""))
              }
            />
            <button
              type="button"
              onClick={() => {
                handleArrayAdd("highlights", highlightInput);
                setHighlightInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.highlights?.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleArrayRemove("highlights", idx)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Learnings */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Key Learnings
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={learningInput}
              onChange={(e) => setLearningInput(e.target.value)}
              placeholder="Add a learning"
              className="flex-1 p-2 border border-gray-300 rounded"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleArrayAdd("learnings", learningInput),
                setLearningInput(""))
              }
            />
            <button
              type="button"
              onClick={() => {
                handleArrayAdd("learnings", learningInput);
                setLearningInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.learnings?.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleArrayRemove("learnings", idx)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 p-2 border border-gray-300 rounded"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleArrayAdd("tags", tagInput),
                setTagInput(""))
              }
            />
            <button
              type="button"
              onClick={() => {
                handleArrayAdd("tags", tagInput);
                setTagInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleArrayRemove("tags", idx)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div>
          <label className="block text-sm font-medium mb-1">Tech Stack</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              placeholder="Add a tech (e.g., React, Node.js)"
              className="flex-1 p-2 border border-gray-300 rounded"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                handleArrayAdd("stack", stackInput),
                setStackInput(""))
              }
            />
            <button
              type="button"
              onClick={() => {
                handleArrayAdd("stack", stackInput);
                setStackInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.stack.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleArrayRemove("stack", idx)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="links.demo"
              className="block text-sm font-medium mb-1"
            >
              Live Demo URL
            </label>
            <input
              type="url"
              id="links.demo"
              name="links.demo"
              value={formData.links.demo}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="links.code"
              className="block text-sm font-medium mb-1"
            >
              GitHub URL
            </label>
            <input
              type="url"
              id="links.code"
              name="links.code"
              value={formData.links.code}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repo"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Featured Image
          </label>
          {formData.imageUrl && (
            <div className="mb-2">
              <img
                src={formData.imageUrl}
                alt="Current"
                className="h-32 object-cover rounded"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            {imageFile ? `Selected: ${imageFile.name}` : "No file selected"}
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "Saving..."
              : action === "new"
              ? "Create Project"
              : "Update Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
