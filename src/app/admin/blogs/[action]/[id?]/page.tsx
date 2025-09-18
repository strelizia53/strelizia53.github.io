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
  });

  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing blog if editing
  useEffect(() => {
    if (action === "edit" && id && user) {
      setLoading(true);
      getBlog(id)
        .then((blog) => {
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
            });
          } else {
            setError("Blog post not found.");
          }
        })
        .catch((err) => {
          console.error("Error fetching blog:", err);
          setError("Failed to load blog post.");
        })
        .finally(() => setLoading(false));
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
        {action === "new" ? "Create New Blog Post" : "Edit Blog Post"}
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
            placeholder="my-awesome-blog-post"
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

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Publish Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Reading Time */}
        <div>
          <label
            htmlFor="readingTime"
            className="block text-sm font-medium mb-1"
          >
            Reading Time (e.g., &quot;5 min read&quot;) *
          </label>
          <input
            type="text"
            id="readingTime"
            name="readingTime"
            value={formData.readingTime}
            onChange={handleInputChange}
            required
            placeholder="5 min read"
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
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

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content (Markdown supported) *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={12}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
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

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Featured Image
          </label>
          {formData.imageUrl && (
            <div className="mb-2">
              <Image // ✅ Replaced <img> with <Image />
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
              ? "Create Blog Post"
              : "Update Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
