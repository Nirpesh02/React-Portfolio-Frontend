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
import ProfileBioModal from "./ProfileBioModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logoImage, setLogoImage] = useState("");
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [brandName, setBrandName] = useState("NIRPESH");
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [profileBioData, setProfileBioData] = useState(null);
  const location = useLocation();
  const active = location.pathname === "/" ? "home" : location.pathname.substring(1);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "https://react-portfolio-backend-jwfc.onrender.com";

  const resolveImageUrl = (url, fallback = "") => {
    if (!url) return fallback;
    if (url.startsWith("data:")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads")) return `${apiBaseUrl}${url}`;
    return url;
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        // Priority 1: Fetch Admin profile avatar, bio & name
        const res = await fetch(`${apiBaseUrl}/api/auth/profile`);
        const data = await res.json();
        if (data.success && data.data) {
          let n = data.data.name?.trim() || "NIRPESH";
          if (n.toLowerCase() === "nir p esh" || n.toLowerCase() === "nir p esh.") n = "NIRPESH";
          setBrandName(n);

          const fullAvatar = resolveImageUrl(data.data.avatar);
          if (data.data.avatar) {
            setLogoImage(fullAvatar);
          }

          setProfileBioData({
            ...data.data,
            name: n,
            avatar: fullAvatar,
            title: data.data.title || "Full Stack Developer",
            bio: data.data.bio || "Passionate full-stack developer dedicated to building responsive, scalable, and user-friendly digital experiences.",
            location: data.data.location || "Remote / Nepal",
            availability: data.data.availability || "Available for new projects",
            email: data.data.email || "nirpeshdhungel7@gmail.com",
            github: data.data.github || "",
            linkedin: data.data.linkedin || "",
            twitter: data.data.twitter || "",
            website: data.data.website || "",
            phone: data.data.phone || ""
          });

          if (data.data.avatar) {
            return;
          }
        }

        // Priority 2: Fallback to home-profile
        const homeRes = await fetch(`${apiBaseUrl}/api/home-profile`);
        const homeData = await homeRes.json();
        if (homeData.success && homeData.data) {
          const img = homeData.data.largeImage;
          if (img) {
            setLogoImage(resolveImageUrl(img));
          }
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

  // Auto close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="fixed top-0 left-0 z-[999] h-1 w-full bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.6)] transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-2xl
        border-b transition-all duration-300
        ${scrolled 
          ? "bg-slate-950/90 py-2.5 sm:py-3 border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.55)]" 
          : "bg-slate-950/70 py-3.5 sm:py-4 border-white/5"
        }
        text-slate-100`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <button
              type="button"
              onClick={() => setIsBioModalOpen(true)}
              title="Click to view Bio & Profile"
              className="flex items-center gap-3 flex-shrink-0 group cursor-pointer focus:outline-none text-left bg-transparent border-0 p-0"
            >
              <div className="relative flex-shrink-0">
                {logoImage ? (
                  <img
                    src={logoImage}
                    alt="Portfolio Logo"
                    onLoad={() => setLogoLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = "none";
                    }}
                    className={`rounded-full border-2 border-indigo-500/40 object-cover transition-all duration-300 group-hover:border-indigo-400 group-hover:scale-105 flex-shrink-0 ${
                      logoLoaded ? "opacity-100" : "opacity-0"
                    } ${
                      scrolled ? "h-8 w-8 sm:h-9 sm:w-9" : "h-9 w-9 sm:h-10 sm:w-10"
                    }`}
                  />
                ) : null}
                {!logoLoaded && (
                  <div
                    className={`rounded-full border-2 border-indigo-500/30 bg-slate-800/80 animate-pulse flex-shrink-0 ${
                      scrolled ? "h-8 w-8 sm:h-9 sm:w-9" : "h-9 w-9 sm:h-10 sm:w-10"
                    }`}
                  />
                )}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
              </div>
              <div className="flex flex-col flex-shrink-0 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-[0.14em] uppercase text-slate-100 text-sm sm:text-base whitespace-nowrap flex-shrink-0 transition-colors group-hover:text-indigo-300">
                    {brandName}<span className="text-indigo-400">.</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium group-hover:bg-indigo-500/20 transition-colors hidden sm:inline-block">
                    Bio
                  </span>
                </div>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium whitespace-nowrap hidden sm:block">
                  {profileBioData?.title || "Developer"}
                </span>
              </div>
            </button>
          </Motion.div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center flex-shrink-0">
            <ul className="flex items-center gap-1 lg:gap-1.5 p-1 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg shadow-black/25">
              {menuItems.map((item) => {
                const isActive = active === item.name;
                return (
                  <li key={item.name} className="relative flex-shrink-0">
                    <Link
                      to={item.name === "home" ? "/" : `/${item.name}`}
                      className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.45)]"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={`text-xs ${isActive ? "text-white" : "text-indigo-400"}`}>
                        {item.icon}
                      </span>
                      <span>{item.name.toUpperCase()}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 transition-all hover:bg-white/10 hover:text-white active:scale-95 flex items-center justify-center focus:outline-none"
            aria-label="Toggle navigation"
          >
            {isOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <Motion.div
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden px-4 pt-2 pb-4"
            >
              <div className="rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2.5 overflow-hidden">
                <ul className="flex flex-col space-y-1">
                  {menuItems.map((item) => {
                    const isActive = active === item.name;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.name === "home" ? "/" : `/${item.name}`}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30"
                              : "text-slate-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className={`text-base ${isActive ? "text-white" : "text-indigo-400"}`}>
                            {item.icon}
                          </span>
                          <span className="tracking-wide">{item.name.toUpperCase()}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Profile Bio Modal */}
      <ProfileBioModal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        profileData={profileBioData}
      />
    </>
  );
}
