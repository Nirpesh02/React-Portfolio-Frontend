import { useState, useEffect } from "react";
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaClock, FaSpinner } from "react-icons/fa";
import { motion as Motion } from "framer-motion";
import { toast } from "react-toastify";

export default function AdminResetAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("adminToken");
  const apiBaseUrl = import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/reset-attempts`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAttempts(data.data);
      } else {
        toast.error(data.message || "Failed to fetch logs");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(`Error: ${error.message || "Failed to connect to server"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-indigo-500">
        <FaSpinner className="animate-spin text-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <FaShieldAlt size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Security Logs</h1>
          <p className="text-sm text-slate-400">Monitor all password reset attempts</p>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-slate-800/30 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">Recent Reset Attempts</h2>
          <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full border border-white/10">
            Total: {attempts.length}
          </span>
        </div>

        {attempts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No reset attempts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Email Attempted</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {attempts.map((attempt) => (
                  <Motion.tr 
                    key={attempt._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 text-sm font-medium text-slate-200">
                      {attempt.email}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        attempt.status === 'Success' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {attempt.status === 'Success' ? <FaCheckCircle /> : <FaTimesCircle />}
                        {attempt.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                      {formatDate(attempt.createdAt)}
                    </td>
                    <td className="p-4 text-sm text-slate-400 flex items-center gap-2 whitespace-nowrap">
                      <FaClock className="text-slate-500" />
                      {formatTime(attempt.createdAt)}
                    </td>
                  </Motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
