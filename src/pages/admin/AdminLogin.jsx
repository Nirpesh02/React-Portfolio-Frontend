import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock, FaEnvelope, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { motion as Motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: New Passwords
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminEmail", data.email);
        toast.success("Logged in successfully!");
        navigate("/admin");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (resetStep === 1) {
      if (!email.trim()) {
        toast.error("Please enter your email first");
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.success) {
          setResetStep(2);
        } else {
          toast.error(data.message || "Incorrect username or email");
        }
      } catch (error) {
        toast.error("Failed to connect to server");
      } finally {
        setIsLoading(false);
      }
    } else if (resetStep === 2) {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Password updated successfully! You can now login.");
          setIsForgotPassword(false);
          setResetStep(1);
          setPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast.error(data.message || "Failed to reset password");
        }
      } catch (error) {
        toast.error("Failed to connect to server");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_50%)]" />
      
      <Motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <FaLock size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {isForgotPassword ? "Reset Password" : "Admin Login"}
        </h2>
        <p className="text-slate-400 text-center mb-8 text-sm">
          {isForgotPassword 
            ? (resetStep === 1 ? "Enter your email to reset password" : "Enter your new password") 
            : "Welcome back, Nirpesh. Please login to continue."}
        </p>

        {!isForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="text-right mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsForgotPassword(true)}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center mt-6"
            >
              {isLoading ? <FaSpinner className="animate-spin text-xl" /> : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {resetStep === 1 && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Registered Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
            )}

            {resetStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center mt-6"
            >
              {isLoading ? <FaSpinner className="animate-spin text-xl" /> : (resetStep === 1 ? "Next Step" : "Update Password")}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetStep(1);
                }}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full"
              >
                <FaArrowLeft /> Back to Login
              </button>
            </div>
          </form>
        )}
      </Motion.div>
    </div>
  );
}
