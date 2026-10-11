import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaCamera,
  FaSpinner,
  FaSave,
  FaCheckCircle,
  FaEnvelope,
  FaIdBadge,
  FaBriefcase,
  FaMapMarkerAlt,
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaPhone,
  FaAlignLeft,
  FaEye,
  FaPaperPlane,
  FaRobot,
  FaHeart,
  FaCheck,
  FaPlus,
  FaTrash
} from "react-icons/fa";
import { motion as Motion } from "framer-motion";

const PRESET_INTERESTS = [
  "🎮 Gaming",
  "🎤 Singing",
  "🎬 Entertainment",
  "🎧 Music",
  "💻 Coding",
  "🎸 Guitar",
  "✈️ Traveling",
  "📸 Photography",
  "⚽ Football",
  "🏋️ Gym & Fitness",
  "📚 Reading",
  "☕ Coffee",
  "🎨 Art & Design",
  "♟️ Chess",
  "🍳 Cooking",
  "🚴 Cycling",
  "⛺ Trekking",
  "✍️ Writing",
  "🤖 AI & Tech",
  "🏊 Swimming",
  "🏏 Cricket",
  "🧘 Meditation",
  "🍕 Foodie",
  "🎥 Filmmaking"
];

export default function AdminProfile() {
  const { refreshProfile, setAdminProfile } = useOutletContext() || {};

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("Full Stack Developer");
  const [bio, setBio] = useState("Passionate full-stack developer dedicated to building responsive, scalable, and user-friendly digital experiences.");
  const [location, setLocation] = useState("Remote / Nepal");
  const [availability, setAvailability] = useState("Available for new projects");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  
  // Interests state (array of strings with emojis)
  const [selectedInterests, setSelectedInterests] = useState([
    "🎮 Gaming",
    "🎤 Singing",
    "🎬 Entertainment",
    "💻 Coding"
  ]);
  const [customInterest, setCustomInterest] = useState("");

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";
  const token = localStorage.getItem("adminToken");

  const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("/uploads")) return `${apiBaseUrl}${url}`;
    return url;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success && data.data) {
          setName(data.data.name || "");
          setEmail(data.data.email || "");
          setPhone(data.data.phone || "");
          setTitle(data.data.title || "Full Stack Developer");
          setBio(data.data.bio || "Passionate full-stack developer dedicated to building responsive, scalable, and user-friendly digital experiences.");
          setLocation(data.data.location || "Remote / Nepal");
          setAvailability(data.data.availability || "Available for new projects");
          setGithub(data.data.github || "");
          setLinkedin(data.data.linkedin || "");
          setTwitter(data.data.twitter || "");
          setWebsite(data.data.website || "");

          if (Array.isArray(data.data.interests) && data.data.interests.length > 0) {
            setSelectedInterests(data.data.interests);
          }

          if (data.data.avatar) {
            setAvatarPreview(resolveImageUrl(data.data.avatar));
          }
        }
      } catch (error) {
        toast.error("Failed to load profile data from database");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfileData();
  }, [apiBaseUrl, token]);

  const toggleInterest = (item) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleAddCustomInterest = (e) => {
    e.preventDefault();
    if (!customInterest.trim()) return;
    const trimmed = customInterest.trim();
    if (!selectedInterests.includes(trimmed)) {
      setSelectedInterests([...selectedInterests, trimmed]);
      setCustomInterest("");
      toast.success(`Added "${trimmed}"`);
    } else {
      toast.info("Already added");
    }
  };

  const compressImage = (file, maxDimension = 1600, quality = 0.88) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith("image/")) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              const optimized = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(optimized);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Image size must be less than 100MB");
        return;
      }
      try {
        toast.info("Optimizing image for fast upload...", { autoClose: 1200 });
        const optimized = await compressImage(file);
        setAvatarFile(optimized);
        setAvatarPreview(URL.createObjectURL(optimized));
      } catch (err) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a valid display name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phone", phone.trim());
      formData.append("title", title.trim());
      formData.append("bio", bio.trim());
      formData.append("location", location.trim());
      formData.append("availability", availability.trim());
      formData.append("github", github.trim());
      formData.append("linkedin", linkedin.trim());
      formData.append("twitter", twitter.trim());
      formData.append("website", website.trim());
      formData.append("interests", JSON.stringify(selectedInterests));

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch(`${apiBaseUrl}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile, Email, Phone & Interests saved to database!");
        if (data.data) {
          if (data.data.name) {
            setName(data.data.name);
          }
          if (data.data.avatar) {
            setAvatarPreview(resolveImageUrl(data.data.avatar));
          }
          if (data.data.email) {
            localStorage.setItem("adminEmail", data.data.email);
          }
          if (setAdminProfile) {
            setAdminProfile(prev => ({
              ...prev,
              name: data.data.name || prev.name,
              avatar: data.data.avatar || prev.avatar
            }));
          }
        }
        setAvatarFile(null);
        if (refreshProfile) {
          refreshProfile();
        }
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-3xl text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <FaUserCircle className="text-indigo-400" /> Admin Profile, Bio & Interests
        </h1>
        <p className="text-slate-400 mt-2">
          Manage your round avatar, display name, dynamic email, phone number, bio and tick your favorite hobbies/interests. Everything updates live on the client side modal!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form (7 Cols) */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
              <div className="relative group flex-shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500/40 bg-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.25)] transition-all group-hover:border-indigo-400">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Admin Avatar"
                      onError={() => setAvatarPreview("")}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-slate-700 p-2" />
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-transform active:scale-95 group-hover:scale-110 border-2 border-slate-900"
                  title="Upload New Profile Picture"
                >
                  <FaCamera className="text-xs" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-100">{name || "NIRPESH"}</h3>
                <p className="text-xs text-slate-400">
                  Round profile photo displayed on Navbar, Chatbot replies, and Bio modal. Supports up to 100MB.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  <FaCheckCircle className="text-[10px]" /> Stored directly in MongoDB
                </div>
              </div>
            </div>

            {/* Display Name & Dynamic Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FaIdBadge className="text-indigo-400" /> Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. NIRPESH"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FaEnvelope className="text-indigo-400" /> Dynamic Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. nirpeshdhungel7@gmail.com"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Title & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FaBriefcase className="text-indigo-400" /> Professional Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FaPhone className="text-emerald-400" /> Phone Number / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Location & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-indigo-400" /> Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kathmandu, Nepal / Remote"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FaCheckCircle className="text-emerald-400" /> Availability Status
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. Available for new projects"
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Bio Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FaAlignLeft className="text-indigo-400" /> Profile Bio / Description
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {bio.length} characters
                </span>
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief bio about yourself, passion, experience..."
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm leading-relaxed"
              />
            </div>

            {/* Interests & Hobbies Checkbox Grid (Tick marks with emojis) */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <FaHeart className="text-pink-400" /> Hobbies & Interests ({selectedInterests.length} selected)
                </label>
                <span className="text-xs text-indigo-400">Click to tick / untick</span>
              </div>
              <p className="text-xs text-slate-400">
                Tick the activities, entertainment, games or hobbies you love. They will show up with emojis in your client-side profile card!
              </p>

              {/* Preset 24 options with checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/10">
                {PRESET_INTERESTS.map((item) => {
                  const isChecked = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                        isChecked
                          ? "bg-indigo-600/30 border-indigo-500/60 text-white shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                          : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      <span
                        className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ml-1.5 flex-shrink-0 transition-colors ${
                          isChecked
                            ? "bg-indigo-500 text-white"
                            : "border border-white/20 bg-slate-900"
                        }`}
                      >
                        {isChecked && <FaCheck />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Interest Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Add custom hobby (e.g. 🛹 Skateboarding)..."
                  className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomInterest(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomInterest}
                  className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FaPlus className="text-[10px]" /> Add
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Social Links (Optional)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <FaGithub className="text-slate-400" /> GitHub URL
                  </label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <FaLinkedin className="text-blue-400" /> LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <FaTwitter className="text-sky-400" /> Twitter / X URL
                  </label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://x.com/yourhandle"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <FaGlobe className="text-emerald-400" /> Website / Portfolio
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-semibold px-8 py-3.5 rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Saving to Database...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Profile & Bio
                  </>
                )}
              </button>
            </div>
          </form>
        </Motion.div>

        {/* Live Visitor Preview Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300 px-1">
            <FaEye className="text-indigo-400" /> Live Visitor Preview (Client Side Popup)
          </div>

          <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-indigo-500/20 to-transparent blur-xl pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              {/* Avatar Preview */}
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500/40 bg-slate-950 shadow-[0_0_25px_rgba(99,102,241,0.3)] flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-full h-full text-slate-600 p-2" />
                  )}
                </div>
                <span className="absolute bottom-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-slate-900"></span>
                </span>
              </div>

              {/* Name & Title */}
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-1.5">
                {name || "NIRPESH"}
                <FaCheckCircle className="text-indigo-400 text-sm" />
              </h3>
              <p className="text-indigo-400 text-xs font-medium mt-0.5">
                {title || "Full Stack Developer"}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
                {availability && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {availability}
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-slate-300 border border-white/10">
                    <FaMapMarkerAlt className="text-slate-400 text-[10px]" />
                    {location}
                  </span>
                )}
              </div>

              {/* Bio Box */}
              <div className="w-full mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  About / Bio
                </span>
                <p className="text-slate-200 text-xs leading-relaxed line-clamp-3">
                  {bio || "Your bio will be displayed here for visitors to read."}
                </p>
              </div>

              {/* Ticked Interests Preview */}
              {selectedInterests.length > 0 && (
                <div className="w-full mt-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                    <FaHeart className="text-pink-400 text-[10px]" /> Interests & Hobbies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInterests.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-slate-950/80 text-[11px] text-slate-300 border border-white/10 shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Email Bar */}
              {email && (
                <div className="w-full mt-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 truncate">
                    <FaEnvelope className="text-indigo-400 text-xs" />
                    <span className="truncate">{email}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/20">
                    Copy
                  </span>
                </div>
              )}

              {/* Dynamic Phone Bar */}
              {phone && (
                <div className="w-full mt-2 flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 truncate">
                    <FaPhone className="text-emerald-400 text-xs" />
                    <span className="truncate font-medium">{phone}</span>
                  </div>
                  <div className="flex gap-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-500/20">
                      Call
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                      Copy
                    </span>
                  </div>
                </div>
              )}

              {/* Social Icons Mock */}
              <div className="flex items-center justify-center gap-2 mt-3.5 text-slate-400">
                {github && (
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 border border-white/10">
                    <FaGithub size={13} />
                  </div>
                )}
                {linkedin && (
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 border border-white/10">
                    <FaLinkedin size={13} />
                  </div>
                )}
                {twitter && (
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-sky-400 border border-white/10">
                    <FaTwitter size={13} />
                  </div>
                )}
                {website && (
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 border border-white/10">
                    <FaGlobe size={13} />
                  </div>
                )}
              </div>

              {/* Action Buttons Mock */}
              <div className="grid grid-cols-2 gap-2 w-full mt-4">
                <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600/80 text-white font-medium text-xs">
                  <FaPaperPlane className="text-[10px]" /> Send Message
                </div>
                <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 text-slate-300 border border-white/10 font-medium text-xs">
                  <FaRobot className="text-[10px] text-indigo-400" /> Chatbot
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
