import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaProjectDiagram, FaSignOutAlt, FaPlus, FaImage, FaEnvelope, FaBars, FaTimes, FaKey, FaSpinner, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);

  const token = localStorage.getItem("adminToken");
  const apiBaseUrl = import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    
    setIsChangingPass(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/change-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password changed successfully!");
        setIsChangePassOpen(false);
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally {
      setIsChangingPass(false);
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Projects", path: "/admin/projects", icon: <FaProjectDiagram /> },
    { name: "Home Images", path: "/admin/home-images", icon: <FaImage /> },
    { name: "Inquiries", path: "/admin/inquiries", icon: <FaEnvelope /> },
    { name: "Security Logs", path: "/admin/reset-attempts", icon: <FaShieldAlt /> },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-slate-900/95 backdrop-blur-xl flex flex-col transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-wider text-indigo-400">ADMIN PANEL</h2>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              setIsChangePassOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all"
          >
            <FaKey />
            <span className="font-medium">Change Password</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-4 px-4 py-2 border border-white/10 rounded-xl text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Go to Live Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,rgba(30,27,75,0.3),transparent_50%)]">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-white/10 flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-300 hover:text-white p-2"
          >
            <FaBars size={24} />
          </button>
          <h2 className="text-lg font-bold tracking-wider text-indigo-400">ADMIN PANEL</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Change Password Modal */}
      {isChangePassOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
            <button 
              onClick={() => setIsChangePassOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaKey className="text-indigo-400" /> Change Password
            </h3>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Current Password</label>
                <input 
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">New Password</label>
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                type="submit"
                disabled={isChangingPass}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center"
              >
                {isChangingPass ? <FaSpinner className="animate-spin" /> : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
