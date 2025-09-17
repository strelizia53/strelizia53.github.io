// src/app/projects/[action]/[id?]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Replace img with Next.js Image
import { FiArrowLeft, FiUpload, FiX } from "react-icons/fi";
import {
  addProject,
  updateProject,
  getProject,
  uploadFile,
  ProjectDoc,
} from "@/lib/firebaseHelpers"; // Removed deleteFile import

type PageProps = {
  params: { action: "new" | "edit"; id?: string };
};

export default function ProjectForm({ params }: PageProps) {
  const router = useRouter();
  const { action, id } = params;
  const isEditing = action === "edit" && id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<ProjectDoc>({
    title: "",
    description: "",
    summary: "",
    year: new Date().getFullYear(),
    category: "Full-Stack",
    tags: [],
    stack: [],
    links: { demo: "", code: "" }, // Initialize links properly
  });
  const [newTag, setNewTag] = useState("");
  const [newStack, setNewStack] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (isEditing && id) {
      // Fetch existing project data
      const fetchProject = async () => {
        try {
          const project = await getProject(id);
          if (project) {
            setFormData({
              ...project,
              links: project.links || { demo: "", code: "" }, // Ensure links exists
            });
            if (project.imageUrl) {
              setImagePreview(project.imageUrl);
            }
          }
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      };
      fetchProject();
    }
  }, [isEditing, id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      links: {
        ...(prev.links || { demo: "", code: "" }),
        [name]: value,
      },
    }));
  };

  const addItem = (field: "tags" | "stack", value: string) => {
    if (value.trim() && !formData[field]?.includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()],
      }));
    }
    if (field === "tags") setNewTag("");
    if (field === "stack") setNewStack("");
  };

  const removeItem = (field: "tags" | "stack", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      let imagePath = formData.imagePath;

      // Upload new image if selected
      if (imageFile) {
        setUploading(true);
        const { url, path } = await uploadFile(imageFile, "projects");
        imageUrl = url;
        imagePath = path;
        setUploading(false);
      }

      const projectData = {
        ...formData,
        imageUrl,
        imagePath,
        links: formData.links || { demo: "", code: "" }, // Ensure links exists
      };

      if (isEditing && id) {
        await updateProject(id, projectData);
      } else {
        await addProject(projectData);
      }

      router.push("/admin");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <section className="container fade-in">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center text-blue-500 hover:underline"
        >
          <FiArrowLeft className="mr-2" /> Back to Admin
        </Link>
        <h1 className="text-3xl font-bold mt-2">
          {isEditing ? "Edit Project" : "Add New Project"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="Full-Stack">Full-Stack</option>
            <option value="Frontend">Frontend</option>
            <option value="API">API</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Summary *</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            required
            rows={2}
            className="w-full p-3 border rounded-lg"
            placeholder="Brief description for listing pages"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full p-3 border rounded-lg"
            placeholder="Detailed project description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Demo URL</label>
            <input
              type="url"
              name="demo"
              value={formData.links?.demo || ""}
              onChange={handleLinksChange}
              className="w-full p-3 border rounded-lg"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Code URL *</label>
            <input
              type="url"
              name="code"
              value={formData.links?.code || ""}
              onChange={handleLinksChange}
              required
              className="w-full p-3 border rounded-lg"
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 p-3 border rounded-lg"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={() => addItem("tags", newTag)}
              className="px-4 bg-blue-500 text-white rounded-lg"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeItem("tags", index)}
                  className="ml-2 text-red-500"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Tech Stack</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newStack}
              onChange={(e) => setNewStack(e.target.value)}
              className="flex-1 p-3 border rounded-lg"
              placeholder="Add a technology"
            />
            <button
              type="button"
              onClick={() => addItem("stack", newStack)}
              className="px-4 bg-blue-500 text-white rounded-lg"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.stack?.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeItem("stack", index)}
                  className="ml-2 text-red-500"
                >
                  <FiX size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Project Image</label>
          {imagePreview ? (
            <div className="mb-4 relative">
              <div className="w-full max-w-md h-48 relative">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : null}
          <label className="block w-full p-4 border border-dashed rounded-lg cursor-pointer">
            <FiUpload className="inline mr-2" />
            {imageFile ? "Change Image" : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading || uploading
              ? "Saving..."
              : isEditing
              ? "Update"
              : "Create"}{" "}
            Project
          </button>
          <Link
            href="/admin"
            className="px-6 py-3 border border-gray-300 rounded-lg"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
