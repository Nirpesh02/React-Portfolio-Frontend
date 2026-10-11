import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCircle, FaCamera, FaSpinner, FaSave, FaCheckCircle, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { motion as Motion } from "framer-motion";

export default function AdminProfile() {
  const { adminProfile, refreshProfile } = useOutletContext() || {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
          let n = data.data.name || "NIRPESH";
          if (n.toLowerCase() === "nir p esh" || n.toLowerCase() === "nir p esh.") n = "NIRPESH";
          setName(n);
          setEmail(data.data.email || "");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a valid name");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
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
        toast.success("Profile saved successfully to database!");
        if (data.data && data.data.avatar) {
          setAvatarPreview(resolveImageUrl(data.data.avatar));
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
          <FaUserCircle className="text-indigo-400" /> Admin Profile Settings
        </h1>
        <p className="text-slate-400 mt-2">
          Update your admin display name and round profile avatar. All changes are stored directly in MongoDB database.
        </p>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-white/10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/40 bg-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.25)] transition-all group-hover:border-indigo-400">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-slate-700" />
                )}
              </div>

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full cursor-pointer shadow-lg transition-transform active:scale-95 group-hover:scale-110 border-2 border-slate-900"
                title="Change Avatar"
              >
                <FaCamera className="text-sm" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold text-slate-100">
                {name || "NIRPESH"}
              </h3>
              <p className="text-sm text-slate-400">
                Click the camera icon to upload a round profile photo.
              </p>
              <div className="inline-flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                <FaCheckCircle className="text-xs" /> Stored securely in MongoDB
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <FaIdBadge className="text-indigo-400" /> Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. NIRPESH"
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <FaEnvelope className="text-indigo-400" /> Registered Email
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-semibold px-8 py-3.5 rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving to Database...
                </>
              ) : (
                <>
                  <FaSave /> Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
}
