import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaImage, FaSave } from "react-icons/fa";

export default function AdminHomeProfile() {
  const [formData, setFormData] = useState({
    smallImage: "",
    largeImage: "",
    aboutImage: "",
  });
  const [selectedFiles, setSelectedFiles] = useState({
    smallImage: null,
    largeImage: null,
    aboutImage: null,
  });
  const [previews, setPreviews] = useState({
    smallImage: "",
    largeImage: "",
    aboutImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/home-profile`);
        const data = await res.json();
        if (data.success && data.data) {
          setFormData({
            smallImage: data.data.smallImage || "",
            largeImage: data.data.largeImage || "",
            aboutImage: data.data.aboutImage || "",
          });
          setPreviews({
            smallImage: data.data.smallImage?.startsWith('/uploads') ? `${apiBaseUrl}${data.data.smallImage}` : data.data.smallImage || "",
            largeImage: data.data.largeImage?.startsWith('/uploads') ? `${apiBaseUrl}${data.data.largeImage}` : data.data.largeImage || "",
            aboutImage: data.data.aboutImage?.startsWith('/uploads') ? `${apiBaseUrl}${data.data.aboutImage}` : data.data.aboutImage || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load home images");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [apiBaseUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles({ ...selectedFiles, [e.target.name]: file });
      setPreviews({ ...previews, [e.target.name]: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = new FormData();
      if (selectedFiles.smallImage) submitData.append("smallImage", selectedFiles.smallImage);
      if (selectedFiles.largeImage) submitData.append("largeImage", selectedFiles.largeImage);
      if (selectedFiles.aboutImage) submitData.append("aboutImage", selectedFiles.aboutImage);

      const res = await fetch(`${apiBaseUrl}/api/home-profile`, {
        method: "PUT",
        body: submitData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Home images updated successfully!");
      } else {
        toast.error(data.message || "Failed to update images");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading...</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Home Page Images</h1>
        <p className="text-slate-400 mt-2">Manage the images displayed on the home page.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <FaImage className="text-indigo-400" /> Small Profile Image (Round)
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-400 mb-1">Upload New Image</label>
                <input
                  type="file"
                  name="smallImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border border-white/15 bg-white/5 shadow-lg">
                {previews.smallImage ? (
                  <img src={previews.smallImage} alt="Small Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">Preview</div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <FaImage className="text-indigo-400" /> Large Profile Image (Rectangle)
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-400 mb-1">Upload New Image</label>
                <input
                  type="file"
                  name="largeImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="w-32 h-40 shrink-0 rounded-xl overflow-hidden border border-white/15 bg-white/5 shadow-lg">
                {previews.largeImage ? (
                  <img src={previews.largeImage} alt="Large Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">Preview</div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <FaImage className="text-indigo-400" /> About Page Image (Rectangle)
            </h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-400 mb-1">Upload New Image</label>
                <input
                  type="file"
                  name="aboutImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="w-48 h-32 shrink-0 rounded-xl overflow-hidden border border-white/15 bg-white/5 shadow-lg">
                {previews.aboutImage ? (
                  <img src={previews.aboutImage} alt="About Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">Preview</div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              <FaSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
