import { useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaPhone,
  FaRobot,
  FaPaperPlane,
  FaCopy,
  FaCheck,
  FaUserCircle
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function ProfileBioModal({ isOpen, onClose, profileData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const {
    name = "NIRPESH",
    avatar = "",
    title = "Full Stack Developer",
    bio = "Passionate full-stack developer dedicated to building responsive, scalable, and user-friendly digital experiences.",
    location = "Remote / Nepal",
    availability = "Available for new projects",
    email = "nirpeshdhungel7@gmail.com",
    github = "",
    linkedin = "",
    twitter = "",
    website = "",
    phone = ""
  } = profileData || {};

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Card */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-slate-900/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl z-10 overflow-hidden my-auto"
        >
          {/* Subtle Top Glow Gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-indigo-500/25 via-indigo-600/10 to-transparent blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <FaTimes size={16} />
          </button>

          <div className="flex flex-col items-center text-center">
            {/* Round Avatar with Online Ring */}
            <div className="relative mb-4 group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-indigo-500/40 bg-slate-950 shadow-[0_0_35px_rgba(99,102,241,0.35)] flex items-center justify-center">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-slate-600 p-2" />
                )}
              </div>
              <span className="absolute bottom-1 right-2 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 ring-4 ring-slate-900"></span>
              </span>
            </div>

            {/* Name & Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              {name}
              <FaCheckCircle className="text-indigo-400 text-lg" title="Verified Profile" />
            </h2>
            <p className="text-indigo-400 font-medium text-sm sm:text-base mt-1">
              {title}
            </p>

            {/* Badges: Availability & Location */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {availability && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {availability}
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
                  <FaMapMarkerAlt className="text-slate-400 text-[11px]" />
                  {location}
                </span>
              )}
            </div>

            {/* Bio Box */}
            <div className="w-full mt-5 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                About / Bio
              </span>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            </div>

            {/* Email Bar with Click to Copy */}
            {email && (
              <div className="w-full mt-3 flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-300 truncate">
                  <FaEnvelope className="text-indigo-400 flex-shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="truncate hover:text-indigo-300 transition-colors"
                  >
                    {email}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all text-[11px] cursor-pointer flex-shrink-0 ml-2"
                  title="Copy email"
                >
                  {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}

            {/* Social Links Row */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {github && (
                <a
                  href={github.startsWith("http") ? github : `https://${github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
                  title="GitHub"
                >
                  <FaGithub size={18} />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-600/30 border border-white/10 hover:border-blue-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
                  title="LinkedIn"
                >
                  <FaLinkedin size={18} />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter.startsWith("http") ? twitter : `https://${twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-sky-600/30 border border-white/10 hover:border-sky-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
                  title="Twitter / X"
                >
                  <FaTwitter size={18} />
                </a>
              )}
              {website && (
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
                  title="Portfolio / Website"
                >
                  <FaGlobe size={18} />
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
                  title="Phone / Contact"
                >
                  <FaPhone size={16} />
                </a>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full mt-6">
              <Link
                to="/contact"
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all cursor-pointer"
              >
                <FaPaperPlane className="text-xs" /> Send Message
              </Link>
              <Link
                to="/chatbot"
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <FaRobot className="text-xs text-indigo-400" /> Chat with AI
              </Link>
            </div>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
}
