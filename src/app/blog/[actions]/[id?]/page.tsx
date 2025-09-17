// src/app/admin/blogs/[action]/[id?]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { addBlog, updateBlog, getBlog, BlogDoc } from "@/lib/firebaseHelpers";

type PageProps = {
  params: { action: "new" | "edit"; id?: string };
};

export default function BlogForm({ params }: PageProps) {
  const router = useRouter();
  const { action, id } = params;
  const isEditing = action === "edit" && id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogDoc>({
    title: "",
    summary: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    tags: [],
    readingTime: "5 min read",
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (isEditing) {
      // Fetch existing blog data
      const fetchBlog = async () => {
        try {
          // You'll need to implement getBlog in firebaseHelpers
          const blog = await getBlog(id);
          if (blog) {
            setFormData(blog);
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      };
      fetchBlog();
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

  const addTag = (value: string) => {
    if (value.trim() && !formData.tags?.includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), value.trim()],
      }));
    }
    setNewTag("");
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await updateBlog(id, formData);
      } else {
        await addBlog(formData);
      }

      router.push("/admin");
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog post");
      setLoading(false);
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
          {isEditing ? "Edit Blog Post" : "Add New Blog Post"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Reading Time</label>
            <input
              type="text"
              name="readingTime"
              value={formData.readingTime}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="5 min read"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Summary *</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full p-3 border rounded-lg"
            placeholder="Brief excerpt for listing pages"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={10}
            className="w-full p-3 border rounded-lg font-mono"
            placeholder="Write your blog post content here (Markdown supported)"
          />
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
              onClick={() => addTag(newTag)}
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
                  onClick={() => removeTag(index)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"} Blog Post
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
