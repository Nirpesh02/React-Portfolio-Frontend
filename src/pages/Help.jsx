import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { FaQuestionCircle, FaPaperPlane, FaCode, FaPaintBrush, FaMobileAlt, FaHandshake, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const faqs = [
  {
    question: "What is your typical turnaround time?",
    answer: "For a standard website, it usually takes 2-4 weeks. Complex web apps can take 1-3 months depending on the features required.",
  },
  {
    question: "Do you offer post-launch support?",
    answer: "Yes! I provide 1 month of free bug-fixing and support after launch. I also offer ongoing maintenance contracts.",
  },
  {
    question: "What technologies do you use?",
    answer: "I specialize in the MERN stack (MongoDB, Express, React, Node.js), along with Tailwind CSS for styling and Framer Motion for animations.",
  },
  {
    question: "How does the payment process work?",
    answer: "I typically require a 30% upfront deposit to secure the spot, 40% halfway through, and 30% upon final delivery and approval.",
  },
];

export default function Help() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    address: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await res.json();
          if (data && data.address) {
            const p = data.address;
            const ward = p.suburb || p.neighbourhood || p.residential || "";
            const city = p.city || p.town || p.village || p.municipality || "";
            const district = p.county || p.state_district || "";
            const province = p.state || p.region || "";

            const fullAddress = [ward, city, district, province].filter(Boolean).join(", ");
            setFormData((prev) => ({ ...prev, address: fullAddress }));
            toast.success("Location fetched successfully!");
          }
        } catch (error) {
          toast.error("Failed to fetch address details");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        toast.error("Please allow location access to use this feature");
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${apiBaseUrl}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Inquiry sent successfully! I will get back to you soon.");
        setFormData({ name: "", email: "", service: "", budget: "", address: "", message: "" });
      } else {
        toast.error("Failed to send inquiry.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-28 text-slate-100 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-300 mb-6">
            <FaQuestionCircle /> Client Support & Inquiries
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            How can I help you?
          </h1>
          <p className="text-slate-400 text-lg">
            Whether you have a question about my services or want to start a new project, I'm here to help. Fill out the form below or check the FAQs.
          </p>
        </Motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* FAQ Section */}
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors">
                  <h3 className="text-lg font-medium text-slate-200 mb-3">{faq.question}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-medium text-indigo-300 mb-2">Need immediate assistance?</h3>
              <p className="text-slate-400 text-sm mb-4">You can also reach out to me directly via email or phone for urgent matters.</p>
              <a href="/contact" className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">Go to Contact Page &rarr;</a>
            </div>
          </Motion.div>

          {/* Inquiry Form */}
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-6">Start a Project Request</h2>
            <p className="text-slate-400 text-sm mb-8">Fill out the details below to help me understand your needs before we schedule a meeting.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Service Needed</label>
                <div className="relative">
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="Web Development">Web Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="E-Commerce Setup">E-Commerce Setup</option>
                    <option value="Consulting / Support">Consulting / Support</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Budget</label>
                <div className="relative">
                  <select
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="" disabled>Select a budget range</option>
                    <option value="Under Rs. 50,000">Under Rs. 50,000</option>
                    <option value="Rs. 50,000 - Rs. 1,50,000">Rs. 50,000 - Rs. 1,50,000</option>
                    <option value="Rs. 1,50,000 - Rs. 5,00,000">Rs. 1,50,000 - Rs. 5,00,000</option>
                    <option value="Rs. 5,00,000+">Rs. 5,00,000+</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Address (City, District, Province)</label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    required
                    readOnly
                    value={formData.address}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-slate-200 focus:outline-none cursor-not-allowed opacity-80"
                    placeholder="Click the icon to auto-fill location..."
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    title="Get my current location"
                    className="absolute inset-y-0 right-2 flex items-center justify-center p-2 text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                  >
                    {isLocating ? <FaSpinner className="animate-spin" /> : <FaMapMarkerAlt size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 ml-1">Click the location icon to auto-fill your current address.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Project Details</label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell me a bit about your project goals, timeline, and requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Sending Request..." : <><FaPaperPlane /> Send Project Request</>}
              </button>
            </form>
          </Motion.div>
        </div>
      </div>
    </section>
  );
}
