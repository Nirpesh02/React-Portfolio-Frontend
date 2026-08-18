import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { FaUserAstronaut, FaLeaf, FaUsers, FaWandMagicSparkles } from "react-icons/fa6";

export default function About() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updateCapability = () => {
      setCanTilt(mediaQuery.matches);
    };

    updateCapability();
    mediaQuery.addEventListener("change", updateCapability);

    return () => {
      mediaQuery.removeEventListener("change", updateCapability);
    };
  }, []);

  const onMove = (e) => {
    setMouse({
      x: e.clientX / window.innerWidth - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    });
  };

  return (
    <section
      id="about"
      onMouseMove={canTilt ? onMove : undefined}
      className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-20 text-slate-100 sm:px-6 sm:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.14),transparent_40%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center xl:gap-12">
        <Motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-300">
            <FaUserAstronaut className="text-indigo-300" />
            About Me
          </div>

          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            I build thoughtful interfaces with clean structure and calm visual rhythm.
          </h2>

          <div className="space-y-4 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            <p>
              I’m a creative web developer who likes building modern, intuitive,
              and maintainable digital experiences.
            </p>
            <p>
              My focus is on combining clean, efficient code with thoughtful
              design to build products that feel dependable and polished.
            </p>
            <p>
              I enjoy exploring new technologies, refining UI details, and
              turning ideas into experiences that users remember.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Clean Code",
              "Modern UI/UX",
              "Creative Thinking",
              "Team Collaboration",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur-md transition hover:bg-white/10"
              >
                {item === "Clean Code" && <FaLeaf className="text-indigo-300" />}
                {item === "Modern UI/UX" && <FaWandMagicSparkles className="text-indigo-300" />}
                {item === "Creative Thinking" && <FaUserAstronaut className="text-indigo-300" />}
                {item === "Team Collaboration" && <FaUsers className="text-indigo-300" />}
                {item}
              </span>
            ))}
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.16),transparent_55%)] blur-xl" />

          <Motion.div
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-[0_30px_100px_rgba(15,23,42,0.65)]"
            style={{
              transform: canTilt
                ? `rotateY(${mouse.x * 10}deg) rotateX(${-mouse.y * 10}deg)`
                : "none",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <Motion.img
              src="/images/project4.jpg"
              alt="Profile"
              className="h-[320px] w-full object-cover sm:h-[420px] md:h-[560px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="inline-flex rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 backdrop-blur">
                Profile / Full image presentation
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}
