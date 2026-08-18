import { motion as Motion } from "framer-motion";
import { FaCode, FaMobileAlt, FaPaintBrush, FaProjectDiagram, FaReact } from "react-icons/fa";

const highlights = [
  {
    icon: FaPaintBrush,
    title: "Frontend Focus",
    text: "React interfaces with attention to spacing, hierarchy, and usability.",
  },
  {
    icon: FaMobileAlt,
    title: "Responsive by Default",
    text: "Layouts designed to feel consistent from large screens to mobile.",
  },
  {
    icon: FaCode,
    title: "Clean Delivery",
    text: "Simple interactions, restrained color, and a polished final feel.",
  },
];

const metrics = [
  { value: "08+", label: "Projects", icon: FaProjectDiagram },
  { value: "UI", label: "Design Mindset", icon: FaPaintBrush },
  { value: "React", label: "Primary Stack", icon: FaReact },
];

const skills = ["React", "Tailwind", "Framer Motion", "Responsive UI"];

export default function Home() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden px-4 pt-24 sm:px-6 sm:pt-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.82))]" />

      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />

      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] xl:gap-10"
      >
        <div className="space-y-7 text-center lg:text-left">
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/15 bg-white/5 shadow-[0_18px_50px_rgba(15,23,42,0.45)] sm:h-28 sm:w-28">
              <Motion.img
                src="/images/project4.jpg"
                alt="Nir P Esh profile"
                className="h-full w-full object-cover"
                initial={{ scale: 1.02 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-300">
              <FaCode className="text-indigo-300" /> Portfolio / Frontend Developer
            </div>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl lg:text-7xl">
              Design that feels
              <span className="block text-slate-300">clear, modern, and calm.</span>
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-300 md:text-lg">
              I build React experiences with clean structure, strong visual
              hierarchy, and a focus on readability. The goal is simple: make
              the interface feel intentional and easy to understand.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="#projects"
              className="rounded-full bg-slate-100 px-8 py-3 font-semibold text-slate-900 shadow-lg transition hover:scale-105"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/15 px-8 py-3 font-semibold text-slate-100 transition hover:bg-white/5"
            >
              Contact Me
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left backdrop-blur"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-indigo-300">
                  <metric.icon />
                </div>
                <div className="text-2xl font-semibold text-slate-100">
                  {metric.value}
                </div>
                <div className="mt-1 text-sm text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.16),transparent_55%)] blur-xl" />

          <Motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-[0_30px_100px_rgba(15,23,42,0.65)]"
          >
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                    Currently building
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-100">
                    Portfolio interfaces with focus on clarity and polish.
                  </h2>
                </div>

                <div className="space-y-3">
                  {highlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300">
                          <item.icon />
                        </span>
                        <span>{item.title}</span>
                      </div>
                      <div className="mt-1 text-sm leading-6 text-slate-400">
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[340px] sm:min-h-[420px]">
                <Motion.img
                  src="https://tse3.mm.bing.net/th/id/OIP.bA_6zy8pfuPWahLUeHiQhAHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                  alt="Profile"
                  className="absolute inset-0 h-full w-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 120 }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="inline-flex rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 backdrop-blur">
                    Available for freelance and full-time work
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>
      </Motion.div>
    </section>
  );
}