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
import ChatPage from "./pages/ChatPage";
import useAuthStore from "./zustand/authStore";
import { useEffect } from "react";

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    // This replaces the manual onIdTokenChanged logic 
    // because it's now encapsulated in your store
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  // VERY IMPORTANT: Prevent the app from rendering routes 
  // until we know if the user is logged in or not.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Initializing Session...</p> 
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:id" element={<ChatPage />} />
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
      </Routes>
    </Router>
  );
}

export default App;
