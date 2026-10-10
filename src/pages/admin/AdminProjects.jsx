import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaExternalLinkAlt, FaGithub, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "", // comma separated string
    liveLink: "",
    role: "Full Stack Developer",
    dateRange: "",
    duration: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/projects`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !editingId) {
      toast.error("Please select an image");
      return;
    }
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      const url = editingId 
        ? `${apiBaseUrl}/api/projects/${editingId}` 
        : `${apiBaseUrl}/api/projects`;
      
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: submitData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Project updated successfully!" : "Project added successfully!");
        setFormData({ title: "", description: "", technologies: "", liveLink: "", role: "Full Stack Developer", dateRange: "", duration: "" });
        setImageFile(null);
        setImagePreview("");
        setEditingId(null);
        setShowAddForm(false);
        fetchProjects();
      } else {
        toast.error(data.message || "Failed to add project");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`${apiBaseUrl}/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project deleted");
        fetchProjects();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title || "",
      description: project.description || "",
      technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies || "",
      liveLink: project.liveLink || "",
      role: project.role || "Full Stack Developer",
      dateRange: project.dateRange || "",
      duration: project.duration || "",
    });
    setImagePreview(project.image?.startsWith('/uploads') ? `${apiBaseUrl}${project.image}` : project.image);
    setImageFile(null);
    setEditingId(project._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Projects Management</h1>
          <p className="text-slate-400 mt-2">Add, remove, and manage your portfolio projects.</p>
        </div>
        <button
          onClick={() => {
            if (showAddForm) {
              setShowAddForm(false);
              setEditingId(null);
              setFormData({ title: "", description: "", technologies: "", liveLink: "", role: "Full Stack Developer", dateRange: "", duration: "" });
              setImageFile(null);
              setImagePreview("");
            } else {
              setShowAddForm(true);
            }
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
        >
          {showAddForm ? "Cancel" : <><FaPlus /> Add Project</>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
          <h2 className="text-xl font-semibold text-slate-200 mb-6">{editingId ? "Edit Project" : "Add New Project"}</h2>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. E-Commerce Platform"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Project Image *</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    required={!editingId}
                    onChange={handleFileChange}
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Role *</label>
                <input
                  type="text"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. Full Stack Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Date Range *</label>
                <input
                  type="text"
                  name="dateRange"
                  required
                  value={formData.dateRange}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. Jan 2024 - Dec 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Duration *</label>
                <input
                  type="text"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. 12 months"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description *</label>
              <textarea
                name="description"
                required
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="A brief description of what you built..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Technologies (comma separated) *</label>
              <input
                type="text"
                name="technologies"
                required
                value={formData.technologies}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="React, Tailwind, Node.js"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Demo / Domain Link</label>
                <input
                  type="text"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="https://yourdomain.com"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                {editingId ? "Update Project" : "Save Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-400">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-slate-400">No projects found. Add your first project!</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={project.image?.startsWith('/uploads') ? `${apiBaseUrl}${project.image}` : project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-indigo-500/80 hover:bg-indigo-500 text-white p-2 rounded-lg backdrop-blur"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg backdrop-blur"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-slate-200">{project.title}</h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4 mb-4">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider font-medium bg-white/10 text-slate-300 px-2 py-1 rounded-md">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[10px] font-medium text-slate-400 px-1 py-1">+{project.technologies.length - 3}</span>
                  )}
                </div>
                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-white/10">
                  {project.liveLink && project.liveLink.trim() !== "" && (
                    <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 text-sm">
                      <FaExternalLinkAlt size={14} /> Demo Link
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
