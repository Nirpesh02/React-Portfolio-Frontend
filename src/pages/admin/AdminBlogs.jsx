import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaExternalLinkAlt,
  FaStar,
  FaRegStar,
  FaCheck,
  FaTimes,
  FaBookOpen,
  FaSearch,
  FaClock,
  FaImage,
  FaUpload,
  FaSpinner,
  FaBold,
  FaItalic,
  FaCode,
  FaQuoteRight,
  FaListUl,
  FaLink,
  FaComment,
  FaThumbsUp,
  FaHeart,
  FaEnvelope,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Comments modal state
  const [selectedBlogForComments, setSelectedBlogForComments] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // Viewers profile modal state
  const [selectedBlogForViewers, setSelectedBlogForViewers] = useState(null);
  const [viewerSearchQuery, setViewerSearchQuery] = useState("");

  // Reactions profile modal state
  const [selectedBlogForReactions, setSelectedBlogForReactions] = useState(null);
  const [reactionSearchQuery, setReactionSearchQuery] = useState("");
  const [reactionTabFilter, setReactionTabFilter] = useState("all");

  // Search & filter
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Full Stack",
    excerpt: "",
    content: "",
    tags: "",
    readTime: "",
    featured: false,
    isPublished: true,
    coverImageUrl: "",
  });

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [activeTab, setActiveTab] = useState("write"); // "write" or "preview"

  const contentTextareaRef = useRef(null);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";
  const token = localStorage.getItem("adminToken");

  const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("data:")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads")) return `${apiBaseUrl}${url}`;
    return url;
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const estimateReadTime = (text) => {
    if (!text) return "1 min read";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/blogs?status=all`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBlogs(data.data);
      }
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [apiBaseUrl]);

  // Aggregate stats across all blogs
  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.isPublished).length;
    const drafts = total - published;
    const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);
    const totalReadingSeconds = blogs.reduce(
      (acc, b) => acc + (b.readingAnalytics?.totalReadingSeconds || 0),
      0
    );
    const totalMins = Math.floor(totalReadingSeconds / 60);
    const remSecs = totalReadingSeconds % 60;
    const totalReadingTimeText =
      totalReadingSeconds === 0 ? "0m" : totalMins > 0 ? `${totalMins}m ${remSecs}s` : `${remSecs}s`;

    const totalReactions = blogs.reduce((acc, b) => {
      const r = b.reactions || {};
      return acc + (r.like || 0) + (r.love || 0) + (r.haha || 0) + (r.wow || 0) + (r.sad || 0);
    }, 0);
    const totalComments = blogs.reduce((acc, b) => acc + (b.comments?.length || 0), 0);

    return { total, published, drafts, totalViews, totalReactions, totalComments, totalReadingTimeText };
  }, [blogs]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData((prev) => {
      const shouldUpdateSlug = !editingId || prev.slug === slugify(prev.title);
      return {
        ...prev,
        title: newTitle,
        slug: shouldUpdateSlug ? slugify(newTitle) : prev.slug,
      };
    });
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setFormData((prev) => ({
      ...prev,
      content: newContent,
      readTime: estimateReadTime(newContent),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertFormatting = (prefix, suffix = "") => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formData.content;
    const selected = currentText.substring(start, end);

    const replacement = prefix + (selected || "text") + suffix;
    const newContent =
      currentText.substring(0, start) + replacement + currentText.substring(end);

    setFormData((prev) => ({
      ...prev,
      content: newContent,
      readTime: estimateReadTime(newContent),
    }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 50);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      category: "Full Stack",
      excerpt: "",
      content: "",
      tags: "",
      readTime: "",
      featured: false,
      isPublished: true,
      coverImageUrl: "",
    });
    setCoverImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setShowForm(false);
    setActiveTab("write");
  };

  const handleStartEdit = (blog) => {
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || "Full Stack",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      readTime: blog.readTime || "3 min read",
      featured: !!blog.featured,
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
      coverImageUrl: blog.coverImage && !blog.coverImage.startsWith("data:") ? blog.coverImage : "",
    });
    setImagePreview(resolveImageUrl(blog.coverImage));
    setCoverImageFile(null);
    setEditingId(blog._id);
    setShowForm(true);
    setActiveTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please provide an article title");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please provide the article content");
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("slug", formData.slug.trim() || slugify(formData.title));
      submitData.append("category", formData.category.trim());
      submitData.append("excerpt", formData.excerpt.trim() || formData.content.slice(0, 160) + "...");
      submitData.append("content", formData.content.trim());
      submitData.append("readTime", formData.readTime || estimateReadTime(formData.content));
      submitData.append("featured", formData.featured);
      submitData.append("isPublished", formData.isPublished);

      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      submitData.append("tags", JSON.stringify(tagsArray));

      if (coverImageFile) {
        submitData.append("coverImage", coverImageFile);
      } else if (imagePreview && imagePreview.startsWith("data:")) {
        submitData.append("coverImageUrl", imagePreview);
      } else if (formData.coverImageUrl.trim()) {
        submitData.append("coverImageUrl", formData.coverImageUrl.trim());
      }

      const url = editingId
        ? `${apiBaseUrl}/api/blogs/${editingId}`
        : `${apiBaseUrl}/api/blogs`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: submitData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Article updated successfully!" : "Article published successfully!");
        resetForm();
        fetchBlogs();
      } else {
        toast.error(data.message || "Failed to save article");
      }
    } catch (err) {
      toast.error("An error occurred while saving the article");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/blogs/${id}/toggle-publish`, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Status updated");
        setBlogs((prev) =>
          prev.map((b) => (b._id === id ? { ...b, isPublished: !currentStatus } : b))
        );
      }
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/blogs/${id}/toggle-featured`, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        const isNowFeatured = !currentStatus;
        toast.success(isNowFeatured ? "Marked as Featured story!" : "Unmarked from Featured");
        setBlogs((prev) =>
          prev.map((b) => (b._id === id ? { ...b, featured: isNowFeatured } : b))
        );
      }
    } catch {
      toast.error("Failed to toggle featured");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Article deleted");
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      } else {
        toast.error(data.message || "Failed to delete article");
      }
    } catch {
      toast.error("Failed to delete article");
    }
  };

  // Delete a specific comment
  const handleDeleteComment = async (blogId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    setDeletingCommentId(commentId);
    try {
      const res = await fetch(`${apiBaseUrl}/api/blogs/${blogId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Comment deleted");
        // Update local blogs state and modal state
        setBlogs((prev) =>
          prev.map((b) => (b._id === blogId ? { ...b, comments: data.comments } : b))
        );
        setSelectedBlogForComments((prev) =>
          prev ? { ...prev, comments: data.comments } : null
        );
      } else {
        toast.error(data.message || "Failed to delete comment");
      }
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchSearch =
        !searchFilter ||
        blog.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchFilter.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && blog.isPublished) ||
        (statusFilter === "draft" && !blog.isPublished);

      const matchCategory =
        categoryFilter === "all" ||
        blog.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchSearch && matchStatus && matchCategory;
    });
  }, [blogs, searchFilter, statusFilter, categoryFilter]);

  const uniqueCategories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => b.category && set.add(b.category));
    return Array.from(set);
  }, [blogs]);

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Top Header & Write New Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <FaBookOpen className="text-indigo-400" />
            Blogs Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Write, edit, manage reactions & comments, and publish blog articles directly to your portfolio.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
              setEditingId(null);
            }
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 cursor-pointer"
        >
          {showForm ? (
            <>
              <FaTimes /> Close Editor
            </>
          ) : (
            <>
              <FaPlus /> Write New Article
            </>
          )}
        </button>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Total Posts</p>
          <p className="mt-1 text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 backdrop-blur-xl">
          <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">Published</p>
          <p className="mt-1 text-2xl font-bold text-emerald-300">{stats.published}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 backdrop-blur-xl">
          <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">Total Time Read</p>
          <p className="mt-1 text-2xl font-bold text-emerald-300 font-mono flex items-center gap-1.5">
            <FaClock className="text-base text-emerald-400" /> {stats.totalReadingTimeText}
          </p>
        </div>
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4 backdrop-blur-xl">
          <p className="text-[11px] font-medium uppercase tracking-wider text-indigo-400">Total Views</p>
          <p className="mt-1 text-2xl font-bold text-indigo-300">{stats.totalViews}</p>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4 backdrop-blur-xl">
          <p className="text-[11px] font-medium uppercase tracking-wider text-rose-400">Reactions</p>
          <p className="mt-1 text-2xl font-bold text-rose-300 flex items-center gap-1.5">
            <span className="text-base">👍❤️</span> {stats.totalReactions}
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 backdrop-blur-xl">
          <p className="text-[11px] font-medium uppercase tracking-wider text-cyan-400">Comments</p>
          <p className="mt-1 text-2xl font-bold text-cyan-300 flex items-center gap-1.5">
            <FaComment className="text-base text-cyan-400" /> {stats.totalComments}
          </p>
        </div>
      </div>

      {/* Blog Creator / Editor Form */}
      {showForm && (
        <div className="rounded-3xl border border-white/15 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">
              {editingId ? "Edit Article" : "Write a New Article"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  activeTab === "write"
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                Write (Editor)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                Live Preview
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Slug */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Article Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Building Scalable Full-Stack Apps with React & Node"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Slug (URL path)
                </label>
                <div className="flex items-center rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-slate-400">
                  <span className="text-slate-600 text-xs mr-1">/blog/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: slugify(e.target.value) })
                    }
                    placeholder="article-slug"
                    className="w-full bg-transparent text-white outline-none text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Category & Tags & Read Time */}
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Full Stack, React, DevOps..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="React, Node.js, WebDev, Tailwind"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Read Time (auto-calculated from word count)
                </label>
                <input
                  type="text"
                  value={formData.readTime || estimateReadTime(formData.content)}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
                  }
                  placeholder="4 min read"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Excerpt / Summary */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Summary / Excerpt (Card preview)
              </label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief 1-2 sentence introduction displayed on blog cards..."
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Cover Image Upload & URL */}
            <div className="grid gap-5 md:grid-cols-2 items-start">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Cover Image (Upload File or Enter URL)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-slate-950/60 p-4 text-xs font-medium text-indigo-400 hover:border-indigo-500 hover:bg-slate-950/80 transition cursor-pointer">
                      <FaUpload /> Choose Cover Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.coverImageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, coverImageUrl: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="Or paste an image URL (Unsplash, Cloudinary, etc.)"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image Preview */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Image Preview
                </label>
                <div className="h-32 rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Cover Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-600 text-xs">
                      <FaImage className="text-2xl mb-1" />
                      <span>No image selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Markdown Content Editor */}
            {activeTab === "write" ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Content (Markdown Supported) <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    {formData.content.trim().split(/\s+/).filter(Boolean).length} words • {estimateReadTime(formData.content)}
                  </span>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-slate-300">
                  <button
                    type="button"
                    onClick={() => insertFormatting("**", "**")}
                    title="Bold"
                    className="p-1.5 hover:bg-white/10 rounded transition cursor-pointer"
                  >
                    <FaBold />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("*", "*")}
                    title="Italic"
                    className="p-1.5 hover:bg-white/10 rounded transition cursor-pointer"
                  >
                    <FaItalic />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("## ")}
                    title="Heading 2"
                    className="p-1.5 hover:bg-white/10 rounded transition font-bold cursor-pointer"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("### ")}
                    title="Heading 3"
                    className="p-1.5 hover:bg-white/10 rounded transition font-semibold cursor-pointer"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("```javascript\n", "\n```")}
                    title="Code Block"
                    className="p-1.5 hover:bg-white/10 rounded transition cursor-pointer"
                  >
                    <FaCode />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("`", "`")}
                    title="Inline Code"
                    className="p-1.5 hover:bg-white/10 rounded font-mono text-[10px] transition cursor-pointer"
                  >
                    &lt;/&gt;
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("> ")}
                    title="Blockquote"
                    className="p-1.5 hover:bg-white/10 rounded transition cursor-pointer"
                  >
                    <FaQuoteRight />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("* ")}
                    title="Bullet List"
                    className="p-1.5 hover:bg-white/10 rounded transition cursor-pointer"
                  >
                    <FaListUl />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("[link text](", ")")}
                    title="Insert Link"
                    className="p-1.5 hover:bg-white/10 rounded transition cursor-pointer"
                  >
                    <FaLink />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("\n---\n")}
                    title="Divider"
                    className="px-2 py-1 hover:bg-white/10 rounded text-[11px] font-mono text-slate-400 transition cursor-pointer"
                  >
                    ---
                  </button>
                </div>

                <textarea
                  ref={contentTextareaRef}
                  rows={14}
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your article using Markdown. Use ## for headings, ```js for code blocks, * for bullet points..."
                  required
                  className="w-full rounded-b-xl border border-t-0 border-white/10 bg-slate-950/80 p-4 font-mono text-xs sm:text-sm text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-slate-950/90 p-6 min-h-[300px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-4 pb-2 border-b border-white/10">
                  Preview Output
                </p>
                <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
                  <h1 className="text-2xl font-bold text-white">{formData.title || "Untitled Article"}</h1>
                  <p className="text-sm italic text-indigo-300">{formData.excerpt}</p>
                  <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {formData.content || "No content written yet."}
                  </div>
                </div>
              </div>
            )}

            {/* Featured & Published Switches */}
            <div className="flex flex-wrap items-center gap-8 rounded-xl border border-white/10 bg-slate-950/60 p-4">
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-indigo-600"
                />
                <span className="font-medium">
                  {formData.isPublished ? "Publish Immediately (Live)" : "Save as Draft (Hidden)"}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-indigo-600"
                />
                <span className="flex items-center gap-1.5 font-medium">
                  <FaStar className={formData.featured ? "text-amber-400" : "text-slate-500"} />
                  Mark as Featured Story (Spotlight Banner)
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition cursor-pointer"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving...
                  </>
                ) : editingId ? (
                  "Update Article"
                ) : (
                  "Publish Article"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search articles by title or category..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Posts Table / Card List */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
            <FaSpinner className="animate-spin text-3xl text-indigo-500" />
            <p className="text-sm">Loading articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FaBookOpen className="mx-auto text-4xl mb-3 text-indigo-400/50" />
            <p className="text-base font-semibold text-white">No articles found</p>
            <p className="text-xs text-slate-500 mt-1">
              {searchFilter
                ? "Try adjusting your search criteria"
                : "Click 'Write New Article' to create your first blog post!"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredBlogs.map((blog) => {
              const reactorsList = Array.isArray(blog.reactionsList) ? blog.reactionsList : [];
              const totalBlogReactions = reactorsList.length;
              const r = {
                like: reactorsList.filter((x) => x.reactionType === "like").length,
                love: reactorsList.filter((x) => x.reactionType === "love").length,
                haha: reactorsList.filter((x) => x.reactionType === "haha").length,
                wow: reactorsList.filter((x) => x.reactionType === "wow").length,
                sad: reactorsList.filter((x) => x.reactionType === "sad").length,
              };
              const commentsCount = blog.comments ? blog.comments.length : 0;
              const avgReadMins = blog.readingAnalytics?.avgReadingMinutes || 0;
              const readerSessions = blog.readingAnalytics?.readerSessions || 0;

              return (
                <div
                  key={blog._id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition hover:bg-white/[0.02]"
                >
                  {/* Article Info & Thumbnail */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800 border border-white/10">
                      {blog.coverImage ? (
                        <img
                          src={resolveImageUrl(blog.coverImage)}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-indigo-400/40">
                          <FaBookOpen />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 font-medium text-indigo-300 border border-indigo-500/25">
                          {blog.category}
                        </span>

                        {blog.featured ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                            <FaStar className="text-[10px]" /> Featured
                          </span>
                        ) : null}

                        {/* Real Views Count - Clickable to view Google viewer profiles */}
                        <span className="text-slate-500">•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBlogForViewers(blog);
                            setViewerSearchQuery("");
                          }}
                          title="Click views logo to view Google viewer profiles"
                          className="group inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 border border-indigo-500/30 transition hover:border-indigo-400 cursor-pointer shadow-sm"
                        >
                          <FaEye className="text-indigo-400 text-xs transition-transform group-hover:scale-125" />
                          <span>{blog.views || 0} {blog.views === 1 ? "view" : "views"}</span>
                          <span className="rounded bg-indigo-400/20 px-1 py-0.2 text-[9px] font-mono text-indigo-200">
                            Viewers
                          </span>
                        </button>

                        {/* Real Total Reading Time Spent by Viewers */}
                        <span className="text-slate-500">•</span>
                        <span className="inline-flex items-center gap-1 text-emerald-300 font-mono text-[11px] font-semibold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                          ⏱️ Total Read Time: {(() => {
                            const totalSec = blog.readingAnalytics?.totalReadingSeconds || 0;
                            const m = Math.floor(totalSec / 60);
                            const s = totalSec % 60;
                            if (totalSec === 0) return "0 min";
                            return m > 0 ? `${m}m ${s}s` : `${s}s`;
                          })()}
                        </span>
                      </div>

                      <h3 className="mt-1 text-sm sm:text-base font-bold text-white truncate hover:text-indigo-300">
                        <Link to={`/blog/${blog.slug || blog._id}`} target="_blank" rel="noreferrer">
                          {blog.title}
                        </Link>
                      </h3>

                      <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                        {blog.excerpt}
                      </p>

                      {/* Facebook Reactions Breakdown & Comments Button */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {/* Interactive Reactions Badge - Click to view users who reacted */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBlogForReactions(blog);
                            setReactionSearchQuery("");
                            setReactionTabFilter("all");
                          }}
                          title="Click reactions badge to view reactors & their profiles"
                          className="group inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 px-2.5 py-1 text-[11px] text-slate-300 border border-rose-500/20 hover:border-rose-500/40 transition cursor-pointer shadow-sm"
                        >
                          <span className="font-semibold text-rose-300 group-hover:text-rose-200">Reactions:</span>
                          <span title="Likes">👍 {r.like || 0}</span>
                          <span title="Loves">❤️ {r.love || 0}</span>
                          <span title="Hahas">😆 {r.haha || 0}</span>
                          <span title="Wows">😮 {r.wow || 0}</span>
                          <span title="Sads">😢 {r.sad || 0}</span>
                          <span className="font-bold text-white group-hover:text-rose-200 ml-1">({totalBlogReactions})</span>
                          <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[9px] font-mono text-rose-200 ml-0.5">
                            Reactors
                          </span>
                        </button>

                        {/* Comments button to open modal */}
                        <button
                          type="button"
                          onClick={() => setSelectedBlogForComments(blog)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 border border-indigo-500/25 transition cursor-pointer"
                        >
                          <FaComment className="text-indigo-400 text-[10px]" />
                          <span>Comments ({commentsCount})</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    {/* Status Toggle Badge */}
                    <button
                      onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
                      title="Click to toggle publish/draft"
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        blog.isPublished
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          blog.isPublished ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      {blog.isPublished ? "Published" : "Draft"}
                    </button>

                    {/* Featured Toggle Star */}
                    <button
                      onClick={() => handleToggleFeatured(blog._id, blog.featured)}
                      title={blog.featured ? "Featured: Click to unmark" : "Click to mark as featured story"}
                      className={`p-2 rounded-xl border transition cursor-pointer ${
                        blog.featured
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30 ring-1 ring-amber-400/40"
                          : "bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {blog.featured ? <FaStar className="text-amber-400" /> : <FaRegStar />}
                    </button>

                    {/* View Live Link */}
                    <Link
                      to={`/blog/${blog.slug || blog._id}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View live article"
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                    </Link>

                    {/* Edit */}
                    <button
                      onClick={() => handleStartEdit(blog)}
                      title="Edit article"
                      className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer"
                    >
                      <FaEdit className="text-xs" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      title="Delete article"
                      className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* COMMENTS MANAGEMENT MODAL FOR ADMIN */}
      {/* ========================================================= */}
      {selectedBlogForComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FaComment className="text-indigo-400" />
                  Comments for: <span className="text-indigo-300 truncate max-w-md">{selectedBlogForComments.title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total Comments: {selectedBlogForComments.comments?.length || 0}
                </p>
              </div>

              <button
                onClick={() => setSelectedBlogForComments(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {!selectedBlogForComments.comments || selectedBlogForComments.comments.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <FaComment className="mx-auto text-3xl mb-2 opacity-30" />
                  <p className="text-sm">No comments have been posted on this article yet.</p>
                </div>
              ) : (
                selectedBlogForComments.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <img
                        src={
                          comment.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=6366f1&color=fff&bold=true`
                        }
                        alt={comment.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            comment.name || "User"
                          )}&background=6366f1&color=fff&bold=true`;
                        }}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white">{comment.name}</span>
                          {comment.email && (
                            <span className="text-xs text-slate-500">({comment.email})</span>
                          )}
                          <span className="text-[11px] text-slate-500">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteComment(selectedBlogForComments._id, comment._id)
                      }
                      disabled={deletingCommentId === comment._id}
                      title="Delete comment"
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer flex-shrink-0"
                    >
                      {deletingCommentId === comment._id ? (
                        <FaSpinner className="animate-spin text-xs" />
                      ) : (
                        <FaTrash className="text-xs" />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setSelectedBlogForComments(null)}
                className="rounded-xl bg-white/10 px-5 py-2 text-xs font-semibold text-white hover:bg-white/15 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GOOGLE VIEWERS PROFILE MODAL FOR ADMIN */}
      {/* ========================================================= */}
      {selectedBlogForViewers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[88vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-md flex-shrink-0">
                    <FcGoogle className="text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-white truncate max-w-lg">
                    Google Viewers Profile
                  </h3>
                </div>
                <p className="text-xs text-indigo-300 font-medium truncate max-w-xl">
                  {selectedBlogForViewers.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-semibold text-emerald-300 border border-emerald-500/30">
                    {selectedBlogForViewers.viewers?.length || selectedBlogForViewers.views || 0} Unique Google Viewers
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">
                    Views count increments only when a new distinct Gmail visits
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBlogForViewers(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer flex-shrink-0"
              >
                <FaTimes />
              </button>
            </div>

            {/* Search Filter inside Viewers */}
            {(selectedBlogForViewers.viewers?.length > 0) && (
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={viewerSearchQuery}
                  onChange={(e) => setViewerSearchQuery(e.target.value)}
                  placeholder="Filter viewers by name or Gmail address..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Viewers Cards Grid / List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(!selectedBlogForViewers.viewers || selectedBlogForViewers.viewers.length === 0) ? (
                <div className="py-16 text-center text-slate-400">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 mb-3">
                    <FcGoogle className="text-3xl opacity-50" />
                  </div>
                  <p className="text-base font-bold text-white">No Google Viewers Yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    When visitors sign in with Google to read this blog, their profiles, Gmails, reading time, and visit history will be listed here automatically.
                  </p>
                </div>
              ) : (
                (() => {
                  const filtered = (selectedBlogForViewers.viewers || []).filter((v) => {
                    const q = viewerSearchQuery.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      v.name?.toLowerCase().includes(q) ||
                      v.email?.toLowerCase().includes(q)
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="py-12 text-center text-slate-500 text-sm">
                        No viewers matching "{viewerSearchQuery}"
                      </div>
                    );
                  }

                  return filtered.map((viewer, vIdx) => {
                    const totalSec = viewer.timeSpentSeconds || 0;
                    const mins = Math.floor(totalSec / 60);
                    const secs = totalSec % 60;
                    const readingTimeFormatted =
                      totalSec === 0 ? "0s" : mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

                    const viewedDate = viewer.viewedAt
                      ? new Date(viewer.viewedAt).toLocaleString()
                      : "Recently";

                    const lastActiveDate = viewer.lastViewedAt
                      ? new Date(viewer.lastViewedAt).toLocaleString()
                      : viewedDate;

                    return (
                      <div
                        key={viewer._id || vIdx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-indigo-500/40 hover:bg-slate-950/90"
                      >
                        {/* Avatar & User Details */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative flex-shrink-0">
                            <img
                              src={
                                viewer.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  viewer.name || "Google User"
                                )}&background=4285F4&color=fff&bold=true`
                              }
                              alt={viewer.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  viewer.name || "Google User"
                                )}&background=4285F4&color=fff&bold=true`;
                              }}
                              className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/50"
                            />
                            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
                              <FcGoogle className="text-xs" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white truncate">
                                {viewer.name || "Google User"}
                              </h4>
                              <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                                Verified Reader
                              </span>
                            </div>

                            <a
                              href={`mailto:${viewer.email}`}
                              className="mt-0.5 flex items-center gap-1.5 text-xs text-indigo-300 font-mono hover:underline truncate"
                            >
                              <FaEnvelope className="text-[10px] text-slate-400" />
                              {viewer.email}
                            </a>

                            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                              <span>First Viewed: {viewedDate}</span>
                              {viewer.lastViewedAt && viewer.lastViewedAt !== viewer.viewedAt && (
                                <span>• Last Active: {lastActiveDate}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Viewer Activity Metrics */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 flex-shrink-0 text-right">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-300">
                            ⏱️ {readingTimeFormatted} read
                          </span>
                          <span className="text-[11px] text-slate-400">
                            🔄 {viewer.viewCount || 1} {(viewer.viewCount || 1) === 1 ? "session" : "sessions"}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
              <span>
                Total Viewers: <strong className="text-white">{selectedBlogForViewers.viewers?.length || 0}</strong>
              </span>
              <button
                onClick={() => setSelectedBlogForViewers(null)}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2 text-xs font-semibold text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactions Profile & Breakdown Modal */}
      {selectedBlogForReactions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[88vh] rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl flex flex-col gap-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                    <FaHeart className="text-sm" />
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Reactions & Reactor Profiles
                  </h3>
                </div>
                <p className="mt-1 text-xs text-slate-400 truncate font-medium">
                  {selectedBlogForReactions.title}
                </p>

                {/* Reaction counts badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs pt-2">
                  {(() => {
                    const reactors = Array.isArray(selectedBlogForReactions.reactionsList)
                      ? selectedBlogForReactions.reactionsList
                      : [];
                    const total = reactors.length;
                    return (
                      <>
                        <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 font-semibold text-rose-300 border border-rose-500/30">
                          {total} Total Reactions
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">1 Reaction per Google Account</span>
                      </>
                    );
                  })()}
                </div>
              </div>

              <button
                onClick={() => setSelectedBlogForReactions(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer flex-shrink-0"
              >
                <FaTimes />
              </button>
            </div>

            {/* Reaction Type Filter Tabs */}
            {(() => {
              const reactors = Array.isArray(selectedBlogForReactions.reactionsList)
                ? selectedBlogForReactions.reactionsList
                : [];
              const total = reactors.length;
              const r = {
                like: reactors.filter((x) => x.reactionType === "like").length,
                love: reactors.filter((x) => x.reactionType === "love").length,
                haha: reactors.filter((x) => x.reactionType === "haha").length,
                wow: reactors.filter((x) => x.reactionType === "wow").length,
                sad: reactors.filter((x) => x.reactionType === "sad").length,
              };
              const tabs = [
                { id: "all", label: "All", count: total, emoji: "✨" },
                { id: "like", label: "Like", count: r.like || 0, emoji: "👍" },
                { id: "love", label: "Love", count: r.love || 0, emoji: "❤️" },
                { id: "haha", label: "Haha", count: r.haha || 0, emoji: "😆" },
                { id: "wow", label: "Wow", count: r.wow || 0, emoji: "😮" },
                { id: "sad", label: "Sad", count: r.sad || 0, emoji: "😢" },
              ];

              return (
                <div className="flex flex-wrap items-center gap-1.5 border-b border-white/5 pb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setReactionTabFilter(tab.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        reactionTabFilter === tab.id
                          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                      <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                        reactionTabFilter === tab.id ? "bg-white/25 text-white" : "bg-white/10 text-slate-300"
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })()}

            {/* Search Filter inside Reactors */}
            {(selectedBlogForReactions.reactionsList?.length > 0) && (
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  value={reactionSearchQuery}
                  onChange={(e) => setReactionSearchQuery(e.target.value)}
                  placeholder="Filter reactors by name, Gmail, or reaction..."
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500"
                />
              </div>
            )}

            {/* Reactors Cards Grid / List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(!selectedBlogForReactions.reactionsList || selectedBlogForReactions.reactionsList.length === 0) ? (
                <div className="py-16 text-center text-slate-400">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 mb-3">
                    <span className="text-3xl">❤️</span>
                  </div>
                  <p className="text-base font-bold text-white">No Reactions Yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    When visitors react to this article, their Google profiles, email addresses, and chosen emojis will appear here.
                  </p>
                </div>
              ) : (
                (() => {
                  const filtered = (selectedBlogForReactions.reactionsList || []).filter((reactor) => {
                    if (reactionTabFilter !== "all" && reactor.reactionType !== reactionTabFilter) {
                      return false;
                    }
                    const q = reactionSearchQuery.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      reactor.name?.toLowerCase().includes(q) ||
                      reactor.email?.toLowerCase().includes(q) ||
                      reactor.reactionType?.toLowerCase().includes(q)
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="py-12 text-center text-slate-500 text-sm">
                        No reactors found for this selection
                      </div>
                    );
                  }

                  const getEmojiMeta = (type) => {
                    switch (type) {
                      case "like":
                        return { emoji: "👍", label: "Like", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
                      case "love":
                        return { emoji: "❤️", label: "Love", badge: "bg-rose-500/20 text-rose-300 border-rose-500/30" };
                      case "haha":
                        return { emoji: "😆", label: "Haha", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
                      case "wow":
                        return { emoji: "😮", label: "Wow", badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" };
                      case "sad":
                        return { emoji: "😢", label: "Sad", badge: "bg-sky-500/20 text-sky-300 border-sky-500/30" };
                      default:
                        return { emoji: "👍", label: "Like", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
                    }
                  };

                  return filtered.map((reactor, rIdx) => {
                    const meta = getEmojiMeta(reactor.reactionType);
                    const reactedDate = reactor.reactedAt
                      ? new Date(reactor.reactedAt).toLocaleString()
                      : "Recently";

                    return (
                      <div
                        key={reactor._id || rIdx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-rose-500/40 hover:bg-slate-950/90"
                      >
                        {/* Avatar & User Details */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative flex-shrink-0">
                            <img
                              src={
                                reactor.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  reactor.name || "Google User"
                                )}&background=E11D48&color=fff&bold=true`
                              }
                              alt={reactor.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  reactor.name || "Google User"
                                )}&background=E11D48&color=fff&bold=true`;
                              }}
                              className="h-12 w-12 rounded-full object-cover ring-2 ring-rose-500/50"
                            />
                            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
                              <FcGoogle className="text-xs" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white truncate">
                                {reactor.name || "Google User"}
                              </h4>
                              <span className={`rounded-full px-2 py-0.2 text-[10px] font-semibold border ${meta.badge}`}>
                                {meta.emoji} {meta.label}
                              </span>
                            </div>

                            <a
                              href={`mailto:${reactor.email}`}
                              className="mt-0.5 flex items-center gap-1.5 text-xs text-rose-300 font-mono hover:underline truncate"
                            >
                              <FaEnvelope className="text-[10px] text-slate-400" />
                              {reactor.email}
                            </a>

                            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                              <span>Reacted: {reactedDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Reaction Emoji Big Display */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 flex-shrink-0 text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl filter drop-shadow">{meta.emoji}</span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{meta.label}</span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
              <span>
                Total Reactors: <strong className="text-white">{selectedBlogForReactions.reactionsList?.length || 0}</strong>
              </span>
              <button
                onClick={() => setSelectedBlogForReactions(null)}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2 text-xs font-semibold text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
