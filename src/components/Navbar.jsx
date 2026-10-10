import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaProjectDiagram,
  FaUser,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaQuestionCircle,
  FaRobot,
} from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logoImage, setLogoImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQm7093jgVNBcksGpxCAaQvJVGC7tbt0v54g&s");
  const location = useLocation();
  const active = location.pathname === "/" ? "home" : location.pathname.substring(1);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/home-profile`);
        const data = await res.json();
        if (data.success && data.data && data.data.smallImage) {
          const url = data.data.smallImage;
          setLogoImage(url.startsWith('/uploads') ? `${apiBaseUrl}${url}` : url);
        }
      } catch (error) {
        console.error("Failed to load logo image", error);
      }
    };
    fetchLogo();
  }, [apiBaseUrl]);

  const menuItems = [
    { name: "home", icon: <FaHome /> },
    { name: "projects", icon: <FaProjectDiagram /> },
    { name: "about", icon: <FaUser /> },
    { name: "contact", icon: <FaEnvelope /> },
    { name: "help", icon: <FaQuestionCircle /> },
    { name: "chatbot", icon: <FaRobot /> },
  ];

  /* Scroll
     - Measure nav height and expose as CSS variable `--nav-height` so
       anchored sections can use `scroll-margin-top` and anchor jumps
       won't be hidden under the fixed nav. */
  useEffect(() => {
    const navEl = document.querySelector("nav");

    const updateNavHeight = () => {
      const navHeight = navEl ? navEl.getBoundingClientRect().height : 80;
      document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);

    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      
      if (docHeight > 0) {
        setProgress((scrollTop / docHeight) * 100);
      } else {
        setProgress(0);
      }
    };

    window.addEventListener("scroll", onScroll);
    // run once to initialize state
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateNavHeight);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 z-[999] h-1 w-full bg-transparent">
        <div
          className="h-full bg-indigo-400 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl
        border-b border-white/10 transition-all duration-500
        ${scrolled ? "bg-slate-950/90 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.35)]" : "bg-slate-950/70 py-5"}
        text-slate-100`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <img
              src={logoImage}
              alt="Portfolio Logo"
              className={`rounded-full border border-white/15 object-cover transition
              ${scrolled ? "h-8 w-8" : "h-10 w-10"}`}
            />
            <h1
              className={`font-semibold tracking-[0.18em] uppercase text-slate-100
              ${scrolled ? "text-sm" : "text-base md:text-lg"}`}
            >
              Nir P Esh
            </h1>
          </Motion.div>

          <ul className="hidden md:flex space-x-6 font-semibold">
            {menuItems.map((item) => (
              <li key={item.name} className="relative group">
                <Link
                  to={item.name === "home" ? "/" : `/${item.name}`}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all
                  ${
                    active === item.name
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.name.toUpperCase()}
                </Link>
                <span className="absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 bg-indigo-400 transition-transform duration-300 group-hover:scale-x-100" />
              </li>
            ))}
          </ul>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-slate-200 transition hover:text-white"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <Motion.ul
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="md:hidden flex w-full flex-col items-center
              bg-slate-950/95 backdrop-blur-xl py-8 space-y-6 font-semibold border-t border-white/10"
            >
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.name === "home" ? "/" : `/${item.name}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all
                    ${
                      active === item.name
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.name.toUpperCase()}
                  </Link>
                </li>
              ))}
            </Motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
