import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaShareAlt,
  FaCopy,
  FaCheck,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaBookOpen,
  FaTag,
  FaUserCircle,
  FaSpinner,
  FaArrowRight,
  FaThumbsUp,
  FaComment,
  FaPaperPlane,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useBlogAuth } from "../context/BlogAuthContext";

// Facebook-style reaction definitions
const REACTIONS = [
  { type: "like", label: "Like", emoji: "👍", color: "text-blue-400" },
  { type: "love", label: "Love", emoji: "❤️", color: "text-rose-400" },
  { type: "haha", label: "Haha", emoji: "😆", color: "text-amber-400" },
  { type: "wow", label: "Wow", emoji: "😮", color: "text-amber-300" },
  { type: "sad", label: "Sad", emoji: "😢", color: "text-sky-400" },
];

// Helper component to render code block with Copy button
const CodeSnippet = ({ code, language = "code" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-2 text-xs text-slate-400">
        <span className="font-mono uppercase tracking-wider text-indigo-400 font-semibold">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
          <span>{copied ? "Copied!" : "Copy code"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs sm:text-sm font-mono leading-relaxed text-indigo-100">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Rich Markdown-like Content Renderer
const MarkdownContent = ({ content }) => {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let currentCodeBlock = null;
  let currentCodeLang = "";
  let listItems = [];

  const flushList = (key) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="my-4 space-y-2 pl-6 list-disc text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const parseInline = (text) => {
    if (!text) return "";

    const parts = [];
    let remaining = text;
    let keyIdx = 0;

    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={keyIdx++}
            className="rounded bg-indigo-500/10 px-1.5 py-0.5 font-mono text-xs text-indigo-300 border border-indigo-500/20"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <em key={keyIdx++} className="italic text-slate-200">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith("[") && token.includes("](")) {
        const titleMatch = token.match(/\[(.*?)\]\((.*?)\)/);
        if (titleMatch) {
          parts.push(
            <a
              key={keyIdx++}
              href={titleMatch[2]}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 underline decoration-indigo-500/40 underline-offset-4 hover:text-indigo-300"
            >
              {titleMatch[1]}
            </a>
          );
        }
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      flushList(`list-${i}`);
      if (currentCodeBlock !== null) {
        elements.push(
          <CodeSnippet
            key={`code-${i}`}
            code={currentCodeBlock.join("\n")}
            language={currentCodeLang || "code"}
          />
        );
        currentCodeBlock = null;
        currentCodeLang = "";
      } else {
        currentCodeBlock = [];
        currentCodeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (currentCodeBlock !== null) {
      currentCodeBlock.push(line);
      continue;
    }

    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      listItems.push(line.trim().slice(2));
      continue;
    } else {
      flushList(`list-${i}`);
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="mt-8 mb-3 text-xl font-bold tracking-tight text-white sm:text-2xl"
        >
          {parseInline(line.slice(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="mt-10 mb-4 text-2xl font-extrabold tracking-tight text-white border-b border-white/10 pb-2 sm:text-3xl"
        >
          {parseInline(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={`h1-${i}`}
          className="mt-12 mb-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
        >
          {parseInline(line.slice(2))}
        </h1>
      );
      continue;
    }

    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-6 border-l-4 border-indigo-500 bg-indigo-500/10 py-3 px-5 rounded-r-2xl italic text-slate-200 text-sm sm:text-base leading-relaxed"
        >
          {parseInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-white/10" />
      );
      continue;
    }

    if (!line.trim()) {
      continue;
    }

    elements.push(
      <p
        key={`p-${i}`}
        className="my-4 text-base leading-8 text-slate-300 sm:text-lg"
      >
        {parseInline(line)}
      </p>
    );
  }

  flushList("list-end");
  return <div>{elements}</div>;
};

export default function BlogDetail() {
  const { slugOrId } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic user reading time tracking (how long the user has been reading this article)
  const [secondsSpentReading, setSecondsSpentReading] = useState(0);

  // Facebook reaction state
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [myReaction, setMyReaction] = useState(null);
  const [reactions, setReactions] = useState({ like: 0, love: 0, haha: 0, wow: 0, sad: 0 });
  const reactionPickerTimeoutRef = useRef(null);

  // Comment state
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", text: "" });
  const [submittingComment, setSubmittingComment] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  const resolveImageUrl = (url, fallback = "") => {
    if (!url) return fallback;
    if (url.startsWith("data:")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads")) return `${apiBaseUrl}${url}`;
    return url;
  };

  const { user, loginWithGoogle, logout } = useBlogAuth();

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBaseUrl}/api/blogs/${slugOrId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setBlog(data.data);
          setRelated(data.related || []);
          setReactions(data.data.reactions || { like: 0, love: 0, haha: 0, wow: 0, sad: 0 });
          setComments(data.data.comments || []);

          // Clear any client-side cached reactions so it strictly reflects 0 from DB
          try {
            Object.keys(localStorage).forEach((k) => {
              if (k.startsWith("reaction_") || k.startsWith("viewed_blog_")) {
                localStorage.removeItem(k);
              }
            });
          } catch (e) {}
          setMyReaction(null);
        } else {
          setError(data.message || "Blog post not found");
        }
      } catch (err) {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    if (slugOrId) {
      fetchBlog();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [slugOrId, apiBaseUrl]);

  // Unique Gmail-based Viewer Tracking:
  // If the same Gmail visits multiple times, the view count DOES NOT increase.
  // Only distinct Gmail logins increase the view count!
  useEffect(() => {
    if (!blog?._id) return;

    if (user?.email) {
      fetch(`${apiBaseUrl}/api/blogs/${blog._id}/view-google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        }),
      })
        .then((r) => r.json())
        .then((viewRes) => {
          if (viewRes.success && viewRes.views !== undefined) {
            setBlog((prev) => (prev ? { ...prev, views: viewRes.views } : prev));
          }
        })
        .catch(() => {});
    }
  }, [blog?._id, user?.email, apiBaseUrl]);

  // Pre-fill comment author if Google user is logged in
  useEffect(() => {
    if (user) {
      setCommentForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Silent background tracking of time spent reading by this viewer (tied to their Gmail)
  useEffect(() => {
    if (!blog?._id) return;

    // Send 10s duration ping to backend every 10 seconds of active reading
    const interval = setInterval(() => {
      fetch(`${apiBaseUrl}/api/blogs/${blog._id}/reading-time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationSeconds: 10,
          email: user?.email || null,
        }),
      }).catch(() => {});
    }, 10000);

    return () => clearInterval(interval);
  }, [blog?._id, user?.email, apiBaseUrl]);

  // Handle Facebook reaction select or toggle
  const handleReactionClick = async (reactionType) => {
    if (!blog?._id) return;
    setShowReactionPicker(false);

    const isToggleOff = myReaction === reactionType;
    const previousReaction = myReaction;
    const newReaction = isToggleOff ? null : reactionType;

    // Optimistic UI update
    setMyReaction(newReaction);
    setReactions((prev) => {
      const updated = { ...prev };
      if (previousReaction && updated[previousReaction] !== undefined) {
        updated[previousReaction] = Math.max(0, updated[previousReaction] - 1);
      }
      if (newReaction && updated[newReaction] !== undefined) {
        updated[newReaction] = (updated[newReaction] || 0) + 1;
      }
      return updated;
    });

    if (newReaction) {
      toast.success(`You reacted with ${REACTIONS.find((r) => r.type === newReaction)?.emoji || "👍"}!`);
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/blogs/${blog._id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reactionType: newReaction,
          previousReaction,
        }),
      });
      const data = await res.json();
      if (data.success && data.reactions) {
        setReactions(data.reactions);
      }
    } catch (e) {
      console.error("Failed to update reaction", e);
    }
  };

  // Submit comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.text.trim()) {
      toast.error("Please provide your name and a comment message");
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/blogs/${blog._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Comment posted successfully!");
        setComments(data.comments || [data.comment, ...comments]);
        setCommentForm({ name: commentForm.name, email: commentForm.email, text: "" });
      } else {
        toast.error(data.message || "Failed to post comment");
      }
    } catch {
      toast.error("Could not post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = (platform) => {
    const currentUrl = window.location.href;
    const title = blog?.title || "Check out this article";

    if (platform === "copy") {
      navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied to clipboard!");
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
        "_blank"
      );
    } else if (platform === "whatsapp") {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${currentUrl}`)}`,
        "_blank"
      );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate total reactions count
  const totalReactionsCount =
    (reactions.like || 0) +
    (reactions.love || 0) +
    (reactions.haha || 0) +
    (reactions.wow || 0) +
    (reactions.sad || 0);

  // Dynamic user read time formatted
  const minutesRead = Math.floor(secondsSpentReading / 60);
  const secondsRemainder = secondsSpentReading % 60;
  const userReadTimeText =
    minutesRead > 0
      ? `${minutesRead}m ${secondsRemainder}s read so far`
      : `${secondsRemainder}s read so far`;

  // Dynamic estimated read time based on word count
  const estimatedReadTime = blog?.content
    ? `${Math.max(1, Math.ceil(blog.content.trim().split(/\s+/).filter(Boolean).length / 200))} min read`
    : blog?.readTime || "3 min read";

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
        <p className="text-slate-400 text-sm">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 bg-slate-950 text-center text-slate-100">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-12 max-w-lg backdrop-blur-xl">
          <FaBookOpen className="mx-auto text-4xl text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
          <p className="mt-2 text-sm text-slate-400">
            {error || "The article you are looking for does not exist or has been removed."}
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition cursor-pointer"
          >
            <FaArrowLeft /> Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  // STRICT ACCESS GATE: If not signed in with Google, do not show article content!
  if (!user) {
    return (
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-20 text-slate-100 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_40%)]" />

        <Motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-white/10">
            <FcGoogle className="text-4xl" />
          </div>

          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Sign in with Google
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Please sign in with your Google account to access and read this article.
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
            <Link to="/blog" className="text-slate-400 hover:text-white transition">
              ← Return to Blog
            </Link>
            <span>Verified Reader Access</span>
          </div>
        </Motion.div>
      </div>
    );
  }

  const activeReactionObj = REACTIONS.find((r) => r.type === myReaction);

  return (
    <article className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-20 text-slate-100 sm:px-6 sm:py-24">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.08),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Top Back Navigation & Google Profile */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1 text-indigo-400" />
            Back to Articles
          </Link>

          {/* Google Viewer Account Pill / Sign In */}
          <div>
            {user ? (
              <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/90 px-3.5 py-1.5 backdrop-blur-md shadow-md">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-emerald-400"
                />
                <div className="text-left">
                  <span className="text-xs font-semibold text-white truncate max-w-[130px] inline-block">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign out of Google"
                  className="p-1 rounded-full text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                  <FaSignOutAlt className="text-xs" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white hover:bg-slate-100 text-slate-900 px-3.5 py-1.5 text-xs font-bold shadow-md transition hover:scale-105 cursor-pointer"
              >
                <FcGoogle className="text-base" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Article Header Meta */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 font-semibold text-indigo-300 border border-indigo-500/30">
              {blog.category}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <FaCalendarAlt className="text-slate-500 text-xs" />
              {formatDate(blog.createdAt)}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <FaEye className="text-slate-500 text-xs" />
              {blog.views || 0} {blog.views === 1 ? "view" : "views"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            {blog.title}
          </h1>

          {/* Author Card & Share Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              {blog.author?.avatar ? (
                <img
                  src={resolveImageUrl(blog.author.avatar)}
                  alt={blog.author.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
              ) : (
                <FaUserCircle className="text-4xl text-slate-400" />
              )}
              <div>
                <p className="text-sm font-bold text-white">
                  {blog.author?.name || "NIRPESH"}
                </p>
                <p className="text-xs text-slate-400">
                  {blog.author?.role || "Full Stack Developer"}
                </p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <FaShareAlt className="text-indigo-400" /> Share:
              </span>
              <button
                onClick={() => handleShare("copy")}
                title="Copy link"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <FaCopy className="text-xs" />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                title="Share on Twitter/X"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-300 transition hover:bg-indigo-600 hover:text-white cursor-pointer"
              >
                <FaTwitter className="text-xs" />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                title="Share on LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-300 transition hover:bg-blue-600 hover:text-white cursor-pointer"
              >
                <FaLinkedin className="text-xs" />
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                title="Share on WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-300 transition hover:bg-emerald-600 hover:text-white cursor-pointer"
              >
                <FaWhatsapp className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        {blog.coverImage && (
          <div className="my-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
            <img
              src={resolveImageUrl(blog.coverImage)}
              alt={blog.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Lead Excerpt */}
        {blog.excerpt && (
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5 text-base sm:text-lg font-medium leading-relaxed text-indigo-200">
            {blog.excerpt}
          </div>
        )}

        {/* Article Body Content */}
        <div className="mt-8 border-b border-white/10 pb-12">
          <MarkdownContent content={blog.content} />
        </div>

        {/* Tags Cloud */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="my-8 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
              <FaTag className="text-indigo-400" /> Tags:
            </span>
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 border border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* FACEBOOK-STYLE REACTIONS BAR */}
        {/* ========================================================= */}
        <div className="my-10 rounded-2xl border border-white/10 bg-slate-900/90 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Reactions summary counter */}
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <div className="flex -space-x-1 text-lg">
                {reactions.love > 0 && <span>❤️</span>}
                {reactions.like > 0 && <span>👍</span>}
                {reactions.haha > 0 && <span>😆</span>}
                {reactions.wow > 0 && <span>😮</span>}
                {reactions.sad > 0 && <span>😢</span>}
                {totalReactionsCount === 0 && <span className="opacity-60">👍</span>}
              </div>
              <span className="font-semibold text-white">
                {totalReactionsCount > 0
                  ? `${totalReactionsCount} reaction${totalReactionsCount > 1 ? "s" : ""}`
                  : "Be the first to react!"}
              </span>

              {/* Breakdown detail */}
              {totalReactionsCount > 0 && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 ml-2 border-l border-white/10 pl-3">
                  {reactions.like > 0 && <span>👍 {reactions.like}</span>}
                  {reactions.love > 0 && <span>❤️ {reactions.love}</span>}
                  {reactions.haha > 0 && <span>😆 {reactions.haha}</span>}
                  {reactions.wow > 0 && <span>😮 {reactions.wow}</span>}
                  {reactions.sad > 0 && <span>😢 {reactions.sad}</span>}
                </div>
              )}
            </div>

            {/* Reaction Trigger Button with Facebook Popup */}
            <div
              className="relative inline-block"
              onMouseEnter={() => {
                clearTimeout(reactionPickerTimeoutRef.current);
                setShowReactionPicker(true);
              }}
              onMouseLeave={() => {
                reactionPickerTimeoutRef.current = setTimeout(() => {
                  setShowReactionPicker(false);
                }, 300);
              }}
            >
              {/* Facebook Reaction Floating Picker Popup */}
              <AnimatePresence>
                {showReactionPicker && (
                  <Motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/95 px-3 py-2 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
                  >
                    {REACTIONS.map((item) => (
                      <Motion.button
                        key={item.type}
                        type="button"
                        whileHover={{ scale: 1.45, y: -6 }}
                        whileTap={{ scale: 1.1 }}
                        onClick={() => handleReactionClick(item.type)}
                        title={item.label}
                        className="group relative flex flex-col items-center justify-center p-1.5 transition cursor-pointer"
                      >
                        <span className="text-2xl sm:text-3xl filter drop-shadow-md transition-transform">
                          {item.emoji}
                        </span>
                        {/* Tooltip */}
                        <span className="absolute -top-7 rounded-md bg-slate-950 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100 pointer-events-none shadow-md">
                          {item.label}
                        </span>
                      </Motion.button>
                    ))}
                  </Motion.div>
                )}
              </AnimatePresence>

              {/* Main Reaction Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (myReaction) {
                    handleReactionClick(myReaction); // Toggle off
                  } else {
                    handleReactionClick("like"); // Default like
                  }
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition cursor-pointer shadow-md ${
                  activeReactionObj
                    ? "bg-indigo-600/30 text-white border border-indigo-500/50"
                    : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {activeReactionObj ? (
                  <>
                    <span className="text-lg">{activeReactionObj.emoji}</span>
                    <span className={activeReactionObj.color}>{activeReactionObj.label}</span>
                  </>
                ) : (
                  <>
                    <FaThumbsUp className="text-sm text-indigo-400" />
                    <span>React</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COMMENTS SECTION (FACEBOOK STYLE) */}
        {/* ========================================================= */}
        <section className="my-12 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <FaComment className="text-indigo-400" />
              Comments ({comments.length})
            </h3>
            <span className="text-xs text-slate-400">Share your thoughts with the community</span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your Name *"
                value={commentForm.name}
                onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Your Email (Optional, private)"
                value={commentForm.email}
                onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <textarea
              rows={3}
              placeholder="Write a comment... (Markdown formatting supported)"
              value={commentForm.text}
              onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition cursor-pointer"
              >
                {submittingComment ? (
                  <>
                    <FaSpinner className="animate-spin" /> Posting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" /> Post Comment
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              <p>No comments yet. Be the first to start the discussion!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((c, i) => (
                <div
                  key={c._id || i}
                  className="flex items-start gap-3.5 rounded-2xl border border-white/5 bg-slate-950/50 p-4 sm:p-5"
                >
                  <img
                    src={
                      c.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6366f1&color=fff&bold=true`
                    }
                    alt={c.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{c.name}</h4>
                      <span className="text-[11px] text-slate-500">
                        {c.createdAt ? formatDate(c.createdAt) : "Recently"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom Call to Action */}
        <div className="my-12 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 p-8 text-center backdrop-blur-xl shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Have thoughts on this topic or want to collaborate?
          </h3>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            I am always open to exploring full-stack projects, architecture consulting, or exchanging developer ideas.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 cursor-pointer"
            >
              Get in Touch <FaArrowRight className="text-xs" />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Explore Projects
            </Link>
          </div>
        </div>

        {/* Related Articles Section */}
        {Array.isArray(related) && related.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item._id}
                  to={`/blog/${item.slug || item._id}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40"
                >
                  <div>
                    {item.coverImage && (
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-800 mb-3">
                        <img
                          src={resolveImageUrl(item.coverImage)}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-white group-hover:text-indigo-300 line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
                    <span>{item.readTime || "3 min read"}</span>
                    <span className="text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read <FaArrowRight className="text-[9px]" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
