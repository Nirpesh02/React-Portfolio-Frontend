import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import Projects from "./pages/Projects.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Help from "./pages/Help.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminBlogs from "./pages/admin/AdminBlogs.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminHomeProfile from "./pages/admin/AdminHomeProfile.jsx";
import AdminInquiries from "./pages/admin/AdminInquiries.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminResetAttempts from "./pages/admin/AdminResetAttempts.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import { BlogAuthProvider } from "./context/BlogAuthContext.jsx";
import "./App.css";

const MainLayout = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
    <Navbar />
    <main className="pt-20">
      <Outlet />
    </main>
  </div>
);

export default function App() {
  return (
    <BlogAuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blog/:slugOrId" element={<BlogDetail />} />
          <Route path="/blogs/:slugOrId" element={<BlogDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="home-images" element={<AdminHomeProfile />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="reset-attempts" element={<AdminResetAttempts />} />
        </Route>
      </Routes>
    </BlogAuthProvider>
  );
}
