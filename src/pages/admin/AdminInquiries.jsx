import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle, FaClock, FaEnvelope, FaMoneyBillWave, FaBriefcase, FaMapMarkerAlt, FaCommentDots, FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewChatId, setViewChatId] = useState(null);
  const [adminReplies, setAdminReplies] = useState({});
  const [adminAvatar, setAdminAvatar] = useState("");
  const chatContainerRef = useRef(null);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/inquiries`);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();

    const fetchAdminAvatar = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/auth/profile`);
        const data = await res.json();
        if (data.success && data.data && data.data.avatar) {
          const url = data.data.avatar;
          setAdminAvatar(url.startsWith('/uploads') ? `${apiBaseUrl}${url}` : url);
        }
      } catch (e) {
        console.error("Failed to load admin avatar", e);
      }
    };
    fetchAdminAvatar();
  }, [apiBaseUrl]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/inquiries/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Inquiry marked as ${newStatus}`);
        setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleAdminReply = async (e, inquiryId, email) => {
    e.preventDefault();
    const messageText = adminReplies[inquiryId];
    if (!messageText?.trim()) return;

    try {
      const newMsg = { sender: "admin", text: messageText };
      const res = await fetch(`${apiBaseUrl}/api/inquiries/chat`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: newMsg }),
      });
      const data = await res.json();
      
      if (data.success) {
        setInquiries(inquiries.map(inq => 
          inq._id === inquiryId ? { ...inq, chatHistory: data.data } : inq
        ));
        setAdminReplies({ ...adminReplies, [inquiryId]: "" });
        
        // Scroll to bottom
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, 100);
      } else {
        toast.error("Failed to send reply");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved": return <FaCheckCircle className="text-green-400" />;
      case "Declined": return <FaTimesCircle className="text-red-400" />;
      default: return <FaClock className="text-yellow-400" />;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "Approved": return "bg-green-500/10 border-green-500/20 text-green-300";
      case "Declined": return "bg-red-500/10 border-red-500/20 text-red-300";
      default: return "bg-yellow-500/10 border-yellow-500/20 text-yellow-300";
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading inquiries...</p>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Project Inquiries</h1>
        <p className="text-slate-400 mt-2">Manage client requests and project inquiries from the Help page.</p>
      </div>

      <div className="grid gap-6">
        {inquiries.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur">
            <p className="text-slate-400">No project inquiries found.</p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-200">{inquiry.name}</h3>
                  <a href={`mailto:${inquiry.email}`} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mt-1 text-sm">
                    <FaEnvelope /> {inquiry.email}
                  </a>
                  {inquiry.address && (
                    <div className="text-slate-400 flex items-center gap-2 mt-1 text-sm">
                      <FaMapMarkerAlt className="text-slate-500" /> {inquiry.address}
                    </div>
                  )}
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusBg(inquiry.status)}`}>
                  {getStatusIcon(inquiry.status)}
                  {inquiry.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-white/5">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <FaBriefcase /> Service Requested
                  </div>
                  <div className="text-slate-200">{inquiry.service}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-white/5">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <FaMoneyBillWave /> Budget Range
                  </div>
                  <div className="text-slate-200">{inquiry.budget}</div>
                </div>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-5 border border-white/5 mb-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Project Details / Message</div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                {inquiry.status !== "Approved" && (
                  <button
                    onClick={() => handleStatusChange(inquiry._id, "Approved")}
                    className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                  >
                    <FaCheckCircle /> Approve Request
                  </button>
                )}
                {inquiry.status !== "Declined" && (
                  <button
                    onClick={() => handleStatusChange(inquiry._id, "Declined")}
                    className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                  >
                    <FaTimesCircle /> Decline
                  </button>
                )}
                {inquiry.status !== "Pending" && (
                  <button
                    onClick={() => handleStatusChange(inquiry._id, "Pending")}
                    className="bg-slate-600/20 hover:bg-slate-600/30 text-slate-400 border border-slate-500/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm ml-auto"
                  >
                    <FaClock /> Mark as Pending
                  </button>
                )}
                {(inquiry.status === "Approved" || (inquiry.chatHistory && inquiry.chatHistory.length > 0)) && (
                  <button
                    onClick={() => setViewChatId(viewChatId === inquiry._id ? null : inquiry._id)}
                    className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm ml-auto cursor-pointer"
                  >
                    <FaCommentDots />{" "}
                    {viewChatId === inquiry._id
                      ? "Hide Chat Log"
                      : `View Chat Log${inquiry.chatHistory && inquiry.chatHistory.length > 0 ? ` (${inquiry.chatHistory.length})` : ""}`}
                  </button>
                )}
              </div>

              {/* Chat History View */}
              {viewChatId === inquiry._id && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <FaCommentDots className="text-indigo-400" />
                      <h4 className="text-sm font-semibold text-slate-200">
                        Chatbot Interaction Log ({inquiry.email})
                      </h4>
                    </div>
                    {inquiry.chatHistory && inquiry.chatHistory.length > 0 && (
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                        {inquiry.chatHistory.length} message{inquiry.chatHistory.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {(!inquiry.chatHistory || inquiry.chatHistory.length === 0) ? (
                    <div className="bg-slate-950/40 border border-white/5 rounded-xl p-6 text-center text-slate-400 text-sm">
                      No chat messages yet from this client. You can send the first message below.
                    </div>
                  ) : (
                    <div 
                      ref={chatContainerRef}
                      className="bg-slate-950/50 rounded-xl p-4 max-h-[300px] overflow-y-auto space-y-4 border border-white/5 scrollbar-thin scrollbar-thumb-white/10"
                    >
                      {inquiry.chatHistory.map((msg, idx) => {
                        if (msg.sender === "system") {
                          return (
                            <div key={idx} className="flex items-center justify-center my-4">
                              <div className="bg-slate-800/50 px-4 py-1.5 rounded-full text-xs text-slate-400 border border-white/5 flex items-center gap-2">
                                <FaClock className="text-[10px]" /> {new Date(msg.timestamp).toLocaleString()} - New Session Started
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={idx} className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs overflow-hidden ${
                              msg.sender === "user" 
                                ? "bg-slate-700 text-slate-300" 
                                : msg.sender === "admin"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                            }`}>
                              {msg.sender === "user" ? (
                                <FaUser />
                              ) : msg.sender === "admin" ? (
                                adminAvatar ? (
                                  <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover" />
                                ) : (
                                  "N"
                                )
                              ) : (
                                <FaRobot />
                              )}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                              msg.sender === "user" 
                                ? "bg-slate-800 text-slate-200 rounded-tr-none" 
                                : msg.sender === "admin"
                                  ? "bg-emerald-900/40 border border-emerald-500/20 text-slate-200 rounded-tl-none"
                                  : "bg-indigo-900/40 border border-indigo-500/20 text-slate-200 rounded-tl-none"
                            }`}>
                              {msg.sender === "admin" && <div className="text-xs text-emerald-400 font-semibold mb-1">Nirpesh (Admin)</div>}
                              {msg.text}
                              <div className="text-[10px] text-slate-400 mt-1.5 opacity-60 text-right">
                                {new Date(msg.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Admin Reply Input */}
                  <form onSubmit={(e) => handleAdminReply(e, inquiry._id, inquiry.email)} className="mt-4 flex gap-3 relative">
                    <input
                      type="text"
                      value={adminReplies[inquiry._id] || ""}
                      onChange={(e) => setAdminReplies({ ...adminReplies, [inquiry._id]: e.target.value })}
                      placeholder="Type your reply as Admin..."
                      className="flex-1 bg-slate-900 border border-white/10 rounded-full pl-5 pr-14 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!adminReplies[inquiry._id]?.trim()}
                      className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                    >
                      <FaPaperPlane className="ml-1 text-sm" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
