import { useEffect, useState } from "react";
import { FaProjectDiagram, FaEnvelope } from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0 });

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, inquiriesRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/projects`),
          fetch(`${apiBaseUrl}/api/inquiries`)
        ]);
        
        const projectsData = await projectsRes.json();
        const inquiriesData = await inquiriesRes.json();

        setStats({
          projects: projectsData.success ? projectsData.data.length : 0,
          messages: inquiriesData.success ? inquiriesData.data.length : 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, [apiBaseUrl]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Welcome back to your portfolio admin panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 text-2xl">
            <FaProjectDiagram />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Projects</p>
            <p className="text-3xl font-semibold text-slate-100">{stats.projects}</p>
          </div>
        </div>
        
        {/* Placeholder for messages if they want it later */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-2xl">
            <FaEnvelope />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Inquiries</p>
            <p className="text-3xl font-semibold text-slate-100">{stats.messages}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
