
import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import Profile from "./Pages/Profile";
import Resume from "./Pages/Resume";
import Interview from "./Pages/Interview";

import AIChat from "./components/AIChat";
import Auth from "./components/Auth";
import Dashboard from "./Pages/Dashboard";
import InterviewHistory from "./Pages/InterviewHistory";
import InterviewDetails from "./Pages/InterviewDetails";
import InterviewPerformance from "./Pages/InterviewPerformance";
import Progress from "./Pages/Progress";
import ResumeHistory from "./Pages/ResumeHistory";

import "./App.css";

import {
  ArrowRight,
  BrainCircuit,
  FileText,
  Code2,
  BriefcaseBusiness,
  Mic,
  ChartNoAxesCombined,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Zap
} from "lucide-react";


// LANDING PAGE
const LandingPage = ({ onGetStarted }) => {

  const features = [
    {
      icon: FileText,
      title: "AI Resume Analyzer",
      description:
        "Analyze your resume and discover opportunities to improve it."
    },
    {
      icon: BrainCircuit,
      title: "AI Career Assistant",
      description:
        "Get personalized career guidance and learning roadmaps."
    },
    {
      icon: Code2,
      title: "Coding Preparation",
      description:
        "Improve your programming and problem-solving skills."
    },
    {
      icon: BriefcaseBusiness,
      title: "Placement Preparation",
      description:
        "Prepare for interviews and placement opportunities."
    },
    {
      icon: Mic,
      title: "Interview Practice",
      description:
        "Practice technical and HR interview questions."
    },
    {
      icon: ChartNoAxesCombined,
      title: "Progress Tracking",
      description:
        "Track your learning progress and career development."
    }
  ];

  return (
    <div className="landing-page">

      <nav className="navbar">

        <div className="logo">
          <Sparkles size={24} />
          <span>NIXIA</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <button
          className="nav-cta"
          onClick={onGetStarted}
        >
          Get Started
          <ArrowRight size={17} />
        </button>

      </nav>

      <section className="hero-section" id="home">

        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={15} />
            AI POWERED CAREER PLATFORM
          </div>

          <h1>
            Build Skills.
            <br />
            <span>Shape Your Future.</span>
          </h1>

          <p>
            Your all-in-one AI-powered career development
            platform. Learn new skills, improve your resume,
            prepare for interviews and move closer to your dream job.
          </p>

          <button
            className="hero-btn"
            onClick={onGetStarted}
          >
            Start Your Journey
            <ArrowRight size={19} />
          </button>

          <div className="hero-trust">
            <CheckCircle2 size={17} />
            Everything you need to become career-ready
          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-card">

            <div className="hero-card-icon">
              <BrainCircuit size={34} />
            </div>

            <h3>Your Career. Your Future.</h3>

            <p>
              Learn, practice and grow with NIXIA AI.
            </p>

            <div className="hero-card-stats">

              <div>
                <strong>AI</strong>
                <span>Powered</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Learning</span>
              </div>

              <div>
                <strong>360°</strong>
                <span>Growth</span>
              </div>

            </div>

          </div>

          <div className="floating-card">
            <Zap size={18} />
            Your future starts today!
          </div>

        </div>

      </section>

      <section className="features-section" id="features">

        <div className="section-heading">

          <span>OUR FEATURES</span>

          <h2>Everything You Need to Succeed</h2>

          <p>
            Powerful AI tools to help you prepare for your career.
          </p>

        </div>

        <div className="features-grid">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (
              <div
                className="feature-card"
                key={index}
              >

                <div className="feature-icon">
                  <Icon size={25} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

              </div>
            );

          })}

        </div>

      </section>

      <section className="about-section" id="about">

        <div>

          <span>ABOUT NIXIA</span>

          <h2>
            Your journey towards a better career begins here.
          </h2>

          <p>
            NIXIA brings career guidance, AI assistance,
            skill development and placement preparation
            together in one platform.
          </p>

          <button
            className="hero-btn"
            onClick={onGetStarted}
          >
            Explore NIXIA
            <ArrowRight size={18} />
          </button>

        </div>

        <div className="about-icon">
          <GraduationCap size={100} />
        </div>

      </section>

      <footer className="landing-footer">

        <div className="logo">
          <Sparkles size={21} />
          <span>NIXIA</span>
        </div>

        <p>Build Skills. Shape Your Future.</p>

        <span>
          © {new Date().getFullYear()} NIXIA. All rights reserved.
        </span>

      </footer>

    </div>
  );
};


// PROTECTED ROUTE
const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};


// APP ROUTES
const AppRoutes = () => {

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );


  // LOGIN
  const handleLogin = () => {

    setLoggedIn(true);

    navigate("/dashboard", {
      replace: true
    });

  };


  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedIn(false);

    // Navigate without reloading the complete application
    navigate("/", {
      replace: true
    });

  };


  // NAVIGATION
  const handleNavigation = (path) => {
    navigate(path);
  };


  return (
    <Routes>

      {/* HOME / LANDING PAGE */}
      <Route
        path="/"
        element={
          <LandingPage
            onGetStarted={() => navigate("/auth")}
          />
        }
      />

      {/* LOGIN / SIGNUP */}
      <Route
        path="/auth"
        element={
          loggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Auth onLogin={handleLogin} />
          )
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard
              onNavigate={handleNavigation}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      {/* AI CHAT */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AIChat onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile
              onBack={() => navigate("/dashboard")}
            />
          </ProtectedRoute>
        }
      />

      {/* RESUME */}
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />

      {/* RESUME HISTORY */}
      <Route
        path="/resume-history"
        element={
          <ProtectedRoute>
            <ResumeHistory />
          </ProtectedRoute>
        }
      />

      {/* INTERVIEW */}
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        }
      />

      {/* INTERVIEW HISTORY */}
      <Route
        path="/interview-history"
        element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        }
      />

      {/* INTERVIEW DETAILS */}
      <Route
        path="/interview-history/:id"
        element={
          <ProtectedRoute>
            <InterviewDetails />
          </ProtectedRoute>
        }
      />

      {/* INTERVIEW PERFORMANCE */}
      <Route
        path="/interview-performance"
        element={
          <ProtectedRoute>
            <InterviewPerformance />
          </ProtectedRoute>
        }
      />

      {/* PROGRESS */}
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN ROUTES */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};


// MAIN APP
function App() {

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );

}

export default App;
