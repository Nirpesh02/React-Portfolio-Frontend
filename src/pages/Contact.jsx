import { useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaPaperPlane, FaDownload } from "react-icons/fa";
import { FaEnvelope, FaMapMarkerAlt, FaClock, FaToolbox } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contactDetails = [
  {
    label: "Email",
    value: "nirpeshdhungel7@gmail.com",
    href: "mailto:nirpeshdhungel7@gmail.com",
  },
  {
    label: "Location",
    value: "Remote / Nepal",
    href: null,
  },
  {
    label: "Response time",
    value: "Within 24 hours",
    href: null,
  },
];

const services = [
  "Portfolio websites",
  "Business landing pages",
  "React UI development",
  "Responsive redesigns",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.comment.trim()) {
      toast.error("Please fill required fields", {
        position: "bottom-right",
        theme: "dark",
      });
      return;
    }

    if (formData.comment.trim().length < 10) {
      toast.error("Message should be at least 10 characters", {
        position: "bottom-right",
        theme: "dark",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${apiBaseUrl}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          comment: formData.comment.trim(),
        }),
      });

      const rawText = await response.text();
      let data = {};

      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = { message: rawText };
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      toast.success("Message sent successfully", {
        position: "bottom-right",
        theme: "dark",
      });

      setFormData({ name: "", email: "", comment: "" });
    } catch (error) {
      toast.error(error.message || "Failed to send message", {
        position: "bottom-right",
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,41,59,0.95),rgba(2,6,23,0.85))]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="max-w-3xl text-center md:text-left">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-300">
            Contact
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl md:text-5xl">
            Let’s build something clean, useful, and professional.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            If you need a portfolio site, a business landing page, or a modern
            React interface, send a message and I’ll get back to you quickly.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] xl:mt-14 xl:gap-8">
          <div className="space-y-8">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.32)] backdrop-blur-xl sm:p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                <FaEnvelope className="text-indigo-300" />
                Contact details
              </h3>

              <div className="mt-5 space-y-4">
                {contactDetails.map((item) => {
                  const content = (
                    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-white/20 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                          {item.label === "Email" && <FaEnvelope className="text-indigo-300" />}
                          {item.label === "Location" && <FaMapMarkerAlt className="text-indigo-300" />}
                          {item.label === "Response time" && <FaClock className="text-indigo-300" />}
                          {item.label}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          {item.value}
                        </div>
                      </div>
                      <span className="text-slate-500">↗</span>
                    </div>
                  );

                  return item.href ? (
                    <a key={item.label} href={item.href}>
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                <FaToolbox className="text-indigo-300" />
                What I can help with
              </h3>

              <div className="mt-5 flex flex-wrap gap-3">
                {services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-200"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Social links
              </h3>

              <div className="mt-5 flex flex-wrap gap-4 text-2xl">
                {[
                  { icon: <FaGithub />, link: "https://github.com/Nirpesh02", label: "GitHub" },
                  { icon: <FaLinkedin />, link: "https://linkedin.com/in/nirpesh-dhungel", label: "LinkedIn" },
                  { icon: <FaTwitter />, link: "https://twitter.com/yourusername", label: "Twitter" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/Nir_P_Esh_CV.pdf"
              download="Nir_P_Esh_CV.pdf"
              className="flex items-center justify-center gap-3 rounded-[1.75rem] border border-indigo-400/30 bg-indigo-500/10 px-6 py-5 text-sm font-semibold text-slate-100 transition hover:border-indigo-300/50 hover:bg-indigo-500/15"
            >
              <FaDownload /> Download CV
            </a>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur-xl md:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-xl font-semibold text-slate-100 sm:text-2xl">
                  Send a message
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Tell me about your project, timeline, and what you need help
                  with. I’ll reply with the next steps.
                </p>
              </div>

              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 md:block">
                Quick reply
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name *"
                className="w-full rounded-xl border border-white/10 bg-black/30 p-3.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:p-4"
                required
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email *"
                className="w-full rounded-xl border border-white/10 bg-black/30 p-3.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:p-4"
                required
              />

              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Tell me a bit about your project... *"
                rows="6"
                maxLength={1000}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:p-4"
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02] sm:py-4 sm:text-lg"
              >
                {isSubmitting ? "Sending..." : "Send Message"} <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
}
