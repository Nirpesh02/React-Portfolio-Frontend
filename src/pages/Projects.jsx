import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaFolderOpen, FaImages, FaLightbulb, FaRocket, FaSpinner } from "react-icons/fa";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/projects`);
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [apiBaseUrl]);

  const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith('/uploads')) return `${apiBaseUrl}${url}`;
    return url;
  };

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [active]);

  const handleImageError = (projectId) => {
    setImageErrors((prev) => ({ ...prev, [projectId]: true }));
  };

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-slate-950 px-4 py-20 text-slate-100 sm:px-6 sm:py-28"
      aria-label="Projects section"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_28%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-300">
            <FaFolderOpen className="text-indigo-300" />
            Selected Work
          </div>

          <Motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-5 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl md:text-5xl"
          >
            Projects designed to feel polished, readable, and easy to use.
          </Motion.h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            A small collection of work focused on structure, performance, and a
            more thoughtful interface experience.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 flex items-center justify-center text-slate-400">
            <FaSpinner className="animate-spin text-3xl" />
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-16 text-center text-slate-400">
            <p>No projects found. Admin can add them from the dashboard.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:mt-14 xl:grid-cols-3 xl:gap-8">
            {projects.map((project, index) => (
              <Motion.article
                key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 shadow-[0_18px_50px_rgba(15,23,42,0.32)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20"
              role="article"
            >
              <div className="relative h-56 overflow-hidden bg-slate-800">
                {!imageErrors[project._id] ? (
                  <Motion.img
                    src={resolveImageUrl(project.image)}
                    alt={`${project.title} project showcase`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={() => handleImageError(project._id)}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800">
                    <span className="text-sm text-slate-400">Image unavailable</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute left-4 top-4 flex gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/75 px-3 py-1 text-xs text-slate-200 backdrop-blur">
                      <FaRocket className="text-indigo-300" />
                    {project.role}
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                  <span>{project.dateRange}</span>
                  <span>{project.duration}</span>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
                    <FaImages className="text-indigo-300" />
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setActive(project)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10"
                  aria-label={`View details for ${project.title}`}
                >
                  View Case Study
                </button>
              </div>
              </Motion.article>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <Motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-3 py-4 backdrop-blur-md sm:px-4 sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <Motion.div
              initial={{ y: 40, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.65)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center text-3xl text-slate-300 transition hover:scale-110 hover:text-white"
                aria-label="Close modal"
                aria-pressed="false"
              >
                ×
              </button>

              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[280px] lg:min-h-full">
                  {!imageErrors[active._id] ? (
                    <Motion.img
                      src={resolveImageUrl(active.image)}
                      alt={`${active.title} demonstration`}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.02 }}
                      loading="lazy"
                      onError={() => handleImageError(active._id)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800">
                      <span className="text-slate-400">Image unavailable</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />

                  <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-slate-950/75 px-3 py-1 text-xs text-slate-200 backdrop-blur">
                      {active.role}
                    </span>
                    <span className="rounded-full border border-white/10 bg-slate-950/75 px-3 py-1 text-xs text-slate-200 backdrop-blur">
                      {active.duration}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-8">
                  <div className="mb-6 text-xs text-slate-400">{active.dateRange}</div>

                  <h2 id="modal-title" className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
                    {active.title}
                  </h2>

                  <p className="mt-4 leading-7 text-slate-300 whitespace-pre-wrap">
                    {active.description}
                  </p>

                  {active.keyFeatures && active.keyFeatures.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Key Features
                      </h3>
                      <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {active.keyFeatures.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm leading-6 text-slate-300">
                            <span className="mt-1 text-indigo-400">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-8">
                      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        <FaLightbulb className="text-indigo-300" />
                      Technologies
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {active.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    {active.liveLink && active.liveLink.trim() !== "" && active.liveLink !== "#" && (
                      <a
                        href={active.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-full bg-slate-100 px-6 py-3 text-center font-semibold text-slate-900 transition hover:scale-[1.02]"
                        aria-label={`Visit ${active.title} live demo`}
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
