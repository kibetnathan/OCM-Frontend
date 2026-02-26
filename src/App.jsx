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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} >
          <Route path="/feed/" element={<FeedChannel/>}/>
          <Route path="upload/" element={<PostForm/>}/>
        </Route>
        <Route path="/auth" element={<AuthPage />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignUpForm />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard/>}>
          <Route path="/dashboard/" element={<DashboardOverview/>}/>
          <Route path="groups/fellowship" element={<Fellowships/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
