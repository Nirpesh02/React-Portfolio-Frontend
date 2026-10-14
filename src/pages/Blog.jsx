import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaBookOpen,
  FaSearch,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaArrowRight,
  FaSpinner,
  FaFire,
  FaUserCircle,
  FaComment,
  FaThumbsUp,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useBlogAuth } from "../context/BlogAuthContext";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { user, loginWithGoogle, logout } = useBlogAuth();

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  const resolveImageUrl = (url, fallback = "") => {
    if (!url) return fallback;
    if (url.startsWith("data:")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads")) return `${apiBaseUrl}${url}`;
    return url;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBaseUrl}/api/blogs`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [apiBaseUrl]);

  // Extract distinct categories from actual backend blogs
  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["All", ...Array.from(set)];
  }, [blogs]);

  // Filtered blogs based on search and category
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory =
        activeCategory === "All" || blog.category?.toLowerCase() === activeCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        blog.title?.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query) ||
        (Array.isArray(blog.tags) &&
          blog.tags.some((t) => t.toLowerCase().includes(query))) ||
        blog.category?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  // ONLY identify a blog as featured if blog.featured is genuinely true!
  const featuredBlog = useMemo(() => {
    return blogs.find((b) => b.featured === true) || null;
  }, [blogs]);

  const regularBlogs = useMemo(() => {
    if (!featuredBlog || searchQuery || activeCategory !== "All") {
      return filteredBlogs;
    }
    return filteredBlogs.filter((b) => b._id !== featuredBlog._id);
  }, [filteredBlogs, featuredBlog, searchQuery, activeCategory]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Dynamic reading time estimation from content or reader analytics
  const getDynamicReadTime = (blog) => {
    if (blog.readingAnalytics?.avgReadingMinutes && blog.readingAnalytics.avgReadingMinutes > 0) {
      return `${blog.readingAnalytics.avgReadingMinutes}m avg read`;
    }
    if (blog.content) {
      const words = blog.content.trim().split(/\s+/).filter(Boolean).length;
      const mins = Math.max(1, Math.ceil(words / 200));
      return `${mins} min read`;
    }
    return blog.readTime || "3 min read";
  };

  // Helper to calculate total reactions
  const getTotalReactions = (reactions) => {
    if (!reactions) return 0;
    return (
      (reactions.like || 0) +
      (reactions.love || 0) +
      (reactions.haha || 0) +
      (reactions.wow || 0) +
      (reactions.sad || 0)
    );
  };

  // STRICT ACCESS GATE: If not signed in with Google, do not show any blog content!
  if (!user) {
    return (
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-20 text-slate-100 sm:px-6">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_40%)]" />

        <Motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center"
        >
          {/* Google Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-white/10">
            <FcGoogle className="text-4xl" />
          </div>

          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Sign in with Google
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Sign in with your Google account to unlock and read all blog articles, insights, and engineering notes.
          </p>

          <div className="mt-8">
            <button
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-6 shadow-xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm sm:text-base"
            >
              <FcGoogle className="text-2xl flex-shrink-0" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="text-slate-400 hover:text-white transition">
              ← Return to Home
            </Link>
            <span>Verified Reader Access</span>
          </div>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-20 text-slate-100 sm:px-6 sm:py-24">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.1),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-md"
            >
              <FaBookOpen className="text-indigo-400" />
              Articles & Insights
            </Motion.div>

            <Motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Thoughts, tutorials &{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                engineering notes.
              </span>
            </Motion.h1>

            <Motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg"
            >
              A curated space where I document real-world lessons, full-stack architecture,
              modern frontend workflows, and system design insights.
            </Motion.p>
          </div>

          {/* Google Sign-in / Viewer Account Pill */}
          <div className="flex-shrink-0 self-start">
            {user ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 p-2 sm:px-4 sm:py-2 backdrop-blur-xl shadow-lg shadow-black/40">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover ring-2 ring-emerald-400/60 flex-shrink-0"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate max-w-[140px]">{user.name}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Active Google Viewer" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  title="Sign out of Google"
                  className="ml-1 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 p-2 text-slate-400 transition cursor-pointer"
                >
                  <FaSignOutAlt className="text-xs" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FcGoogle className="text-xl" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mt-12 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/50"
                      : "bg-slate-900/80 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80 flex-shrink-0">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, tags..."
              className="w-full rounded-full border border-white/10 bg-slate-900/90 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="mt-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <FaSpinner className="animate-spin text-4xl text-indigo-500" />
            <p className="text-sm">Fetching latest articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="mt-20 rounded-3xl border border-white/10 bg-slate-900/50 p-12 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 text-2xl">
              <FaBookOpen />
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">No articles found</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
              We couldn't find any articles matching "{searchQuery}". Try searching with another keyword or resetting the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            {/* ONLY render Spotlight Banner if a post is genuinely marked as featured */}
            {featuredBlog && !searchQuery && activeCategory === "All" && (
              <Motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition duration-300 hover:border-indigo-500/50"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  {/* Image Column */}
                  <div className="relative aspect-[16/9] lg:aspect-auto lg:h-80 overflow-hidden rounded-2xl lg:col-span-7 bg-slate-800">
                    {featuredBlog.coverImage ? (
                      <img
                        src={resolveImageUrl(featuredBlog.coverImage)}
                        alt={featuredBlog.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-indigo-400">
                        <FaBookOpen className="text-6xl opacity-30" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur shadow-md">
                      <FaFire className="text-amber-300" />
                      Featured Story
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex flex-col justify-between lg:col-span-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="rounded-full bg-indigo-500/20 px-3 py-1 font-medium text-indigo-300 border border-indigo-500/30">
                          {featuredBlog.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-slate-500" />
                          {formatDate(featuredBlog.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye className="text-slate-500" />
                          {featuredBlog.views || 0} {featuredBlog.views === 1 ? "view" : "views"}
                        </span>
                        {getTotalReactions(featuredBlog.reactions) > 0 && (
                          <span className="flex items-center gap-1 text-amber-300 font-medium">
                            👍❤️ {getTotalReactions(featuredBlog.reactions)}
                          </span>
                        )}
                        {featuredBlog.comments?.length > 0 && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <FaComment className="text-slate-500" /> {featuredBlog.comments.length}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-2xl font-bold text-white transition-colors group-hover:text-indigo-300 sm:text-3xl">
                        <Link to={`/blog/${featuredBlog.slug || featuredBlog._id}`}>
                          {featuredBlog.title}
                        </Link>
                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-slate-400 line-clamp-3 sm:text-base">
                        {featuredBlog.excerpt}
                      </p>

                      {/* Tags */}
                      {Array.isArray(featuredBlog.tags) && featuredBlog.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {featuredBlog.tags.slice(0, 4).map((t, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-400 border border-white/5"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2.5">
                        {featuredBlog.author?.avatar ? (
                          <img
                            src={resolveImageUrl(featuredBlog.author.avatar)}
                            alt={featuredBlog.author.name}
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                          />
                        ) : (
                          <FaUserCircle className="text-2xl text-slate-400" />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-slate-200">
                            {featuredBlog.author?.name || "NIRPESH"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {featuredBlog.author?.role || "Developer"}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${featuredBlog.slug || featuredBlog._id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500 group-hover:translate-x-1"
                      >
                        Read Article
                        <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Motion.article>
            )}

            {/* Grid of Regular / Filtered Articles */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {regularBlogs.map((blog, idx) => {
                  const totalReactions = getTotalReactions(blog.reactions);
                  const totalComments = blog.comments ? blog.comments.length : 0;

                  return (
                    <Motion.article
                      key={blog._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10"
                    >
                      <div>
                        {/* Card Thumbnail */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                          {blog.coverImage ? (
                            <img
                              src={resolveImageUrl(blog.coverImage)}
                              alt={blog.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950/60 to-slate-900 text-indigo-400/40">
                              <FaBookOpen className="text-4xl" />
                            </div>
                          )}
                          <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300 backdrop-blur border border-white/10">
                            {blog.category}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-slate-500 text-[10px]" />
                              {formatDate(blog.createdAt)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <FaEye className="text-slate-500 text-[10px]" />
                              {blog.views || 0} {blog.views === 1 ? "view" : "views"}
                            </span>
                          </div>

                          <h3 className="mt-3 text-lg font-bold text-white transition group-hover:text-indigo-300 line-clamp-2">
                            <Link to={`/blog/${blog.slug || blog._id}`}>
                              {blog.title}
                            </Link>
                          </h3>

                          <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
                            {blog.excerpt}
                          </p>

                          {/* Social Stats: Reactions & Comments */}
                          {(totalReactions > 0 || totalComments > 0) && (
                            <div className="mt-3 flex items-center gap-3 pt-2 border-t border-white/5 text-xs text-slate-400">
                              {totalReactions > 0 && (
                                <span className="inline-flex items-center gap-1 text-slate-300">
                                  <span className="text-sm">👍❤️</span> {totalReactions}
                                </span>
                              )}
                              {totalComments > 0 && (
                                <span className="inline-flex items-center gap-1 text-slate-400">
                                  <FaComment className="text-slate-500 text-[10px]" /> {totalComments} comments
                                </span>
                              )}
                            </div>
                          )}

                          {/* Tags */}
                          {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {blog.tags.slice(0, 3).map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-400 border border-white/5"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-white/5 px-5 py-3.5 sm:px-6">
                        <div className="flex items-center gap-2">
                          {blog.author?.avatar ? (
                            <img
                              src={resolveImageUrl(blog.author.avatar)}
                              alt={blog.author.name}
                              className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                            />
                          ) : (
                            <FaUserCircle className="text-base text-slate-400" />
                          )}
                          <span className="text-xs text-slate-300 font-medium">
                            {blog.author?.name || "NIRPESH"}
                          </span>
                        </div>

                        <Link
                          to={`/blog/${blog.slug || blog._id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 transition hover:text-indigo-300 group-hover:translate-x-1"
                        >
                          Read <FaArrowRight className="text-[10px]" />
                        </Link>
                      </div>
                    </Motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
