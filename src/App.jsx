import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import Feed from "./pages/Feed";
import FeedChannel from "./components/FeedChannel";
import PostForm from "./components/PostForm";
import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./components/DashboardOverview";
import Fellowships from "./components/Fellowships";
import CourseDashboard from "./components/CourseDashboard";
import DepartmentDashboard from "./components/DepartmentDashboard";
import ServicesDashboard from "./components/ServicesDashboard";
import UsersDashboard from "./components/UsersDashboard";
import LeadershipDashboard from "./components/LeadershipDashboard";
import PostView from "./components/PostView";
import ThreadsPage from "./pages/ThreadsPage";
import useAuthStore from "./zustand/authStore";
import { useEffect } from "react";
import BiblePage from "./pages/BiblePage";
import StreamingPage from "./pages/StreamingPage";
import MobileProfile from "./pages/MobileProfile";
import PageNotFound from "./pages/PageNotFound";
import ComingSoon from "./pages/ComingSoon";

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const loading = useAuthStore((state) => state.loading);
  const wipUrls = [
    "/plans",
    "/streaming",
  ]

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f0d] gap-6">
        {/* Logo */}
        <div className="font-cormorant text-3xl font-semibold tracking-[0.15em] text-stone-100">
          O<span className="text-amber-500">C</span>M
        </div>

        {/* Animated bar */}
        <div className="w-32 h-px bg-stone-800 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-amber-500"
            style={{
              width: "40%",
              animation: "slide 1.4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Label */}
        <p className="font-coptic text-[0.55rem] uppercase tracking-[0.3em] text-stone-600">
          Loading, Please wait...
        </p>

        <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(300%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/bible" element={<BiblePage />} />
        {/* <Route path="/streaming" element={<StreamingPage />} />*/}
        <Route path="/feed" element={<Feed />}>
          <Route path="/feed/" element={<FeedChannel />} />
          <Route path="/feed/post/:postId" element={<PostView />} />
          <Route path="upload/" element={<PostForm />} />
        </Route>
        <Route path="/auth" element={<AuthPage />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignUpForm />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard/" element={<DashboardOverview />} />
          <Route path="groups/fellowship" element={<Fellowships />} />
          <Route path="groups/courses" element={<CourseDashboard />} />
          <Route path="groups/departments" element={<DepartmentDashboard />} />
          <Route path="groups/services" element={<ServicesDashboard />} />
          <Route path="users/all" element={<UsersDashboard />} />
          <Route path="users/leadership" element={<LeadershipDashboard />} />
        </Route>
        <Route path="/profile" element={<MobileProfile />} />
        <Route path="*" element={<PageNotFound />} />
        {wipUrls.map((path) =>
          (<Route key={path} path={path} element={<ComingSoon/>}/>))}
      </Routes>
    </Router>
  );
}

export default App;
