
import { useState } from "react";

import {
  Sparkles,
  ArrowUpRight,
  FileText,
  Mic,
  BrainCircuit,
  Code2,
  Target,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Bell,
  Search,
  Menu,
  Trophy,
  History
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

const features = [
  {
    title: "AI Resume Analyzer",
    description: "Improve your resume with AI-powered feedback.",
    icon: FileText,
    color: "purple",
    path: "/resume"
  },
  {
    title: "Resume History",
    description: "View your previous resume analysis and scores.",
    icon: History,
    color: "blue",
    path: "/resume-history"
  },
  {
    title: "Interview Preparation",
    description: "Practice technical and HR interview questions.",
    icon: Mic,
    color: "blue",
    path: "/interview"
  },
  {
    title: "Interview Performance",
    description: "Track your mock interview scores and progress.",
    icon: Trophy,
    color: "pink",
    path: "/interview-performance"
  },
  {
    title: "AI Career Assistant",
    description: "Get guidance for your career and learning journey.",
    icon: BrainCircuit,
    color: "pink",
    path: "/chat"
  },
  {
    title: "Skill Development",
    description: "Build in-demand skills with structured learning.",
    icon: Code2,
    color: "orange",
    path: "/progress"
  }
];

function Dashboard({ onNavigate, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (path) => {
    setSidebarOpen(false);
    onNavigate?.(path);
  };

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <Sidebar
        activePath="/dashboard"
        onNavigate={navigate}
        onLogout={onLogout}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">

          <div className="dashboard-header-left">

            <button
              className="dashboard-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="dashboard-breadcrumb">
                WORKSPACE / OVERVIEW
              </span>

              <h2>Dashboard</h2>
            </div>

          </div>

          <div className="dashboard-header-right">

            <button
              className="dashboard-icon-btn"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            <button
              className="dashboard-icon-btn"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="dashboard-user-avatar">
              N
            </div>

          </div>

        </header>

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="dashboard-mobile-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* DASHBOARD CONTENT */}
        <section className="dashboard-content">

          {/* WELCOME SECTION */}
          <div className="dashboard-welcome">

            <div className="welcome-content">

              <span className="welcome-tag">
                <Sparkles size={14} />
                YOUR CAREER JOURNEY STARTS HERE
              </span>

              <h1>
                Welcome to your
                <br />
                <span>future workspace.</span>
              </h1>

              <p>
                Everything you need to build skills, prepare for placements
                and shape your career — all in one place.
              </p>

              <button
                className="welcome-button"
                onClick={() => navigate("/chat")}
              >
                Explore NIXIA AI
                <ArrowUpRight size={18} />
              </button>

            </div>

            <div className="welcome-graphic">

              <div className="graphic-circle">
                <BrainCircuit size={85} strokeWidth={1.2} />
              </div>

              <div className="graphic-floating floating-one">
                <Sparkles size={20} />
              </div>

              <div className="graphic-floating floating-two">
                <Target size={22} />
              </div>

            </div>

          </div>

          {/* CAREER SNAPSHOT */}
          <div className="dashboard-section-heading">

            <div>
              <span className="section-eyebrow">
                YOUR OVERVIEW
              </span>

              <h2>Career Snapshot</h2>
            </div>

          </div>

          {/* STATS */}
          <div className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon purple">
                <Target size={21} />
              </div>

              <span>Career Goals</span>

              <h3>Get Started</h3>

              <small>Define your career direction</small>

            </div>

            <div className="stat-card">

              <div className="stat-icon blue">
                <ChartNoAxesCombined size={21} />
              </div>

              <span>Skills Progress</span>

              <h3>0 Skills</h3>

              <small>Start building your skills</small>

            </div>

            <div className="stat-card">

              <div className="stat-icon pink">
                <FileText size={21} />
              </div>

              <span>Resume Status</span>

              <h3>Not Analyzed</h3>

              <small>Analyze your resume with AI</small>

            </div>

            <div className="stat-card">

              <div className="stat-icon orange">
                <BriefcaseBusiness size={21} />
              </div>

              <span>Placement Prep</span>

              <h3>Get Ready</h3>

              <small>Prepare for opportunities</small>

            </div>

          </div>

          {/* TOOLS HEADING */}
          <div className="dashboard-section-heading tools-heading">

            <div>
              <span className="section-eyebrow">
                POWERED BY AI
              </span>

              <h2>Explore Your Tools</h2>

              <p>Everything you need to move forward.</p>
            </div>

          </div>

          {/* FEATURE CARDS */}
          <div className="dashboard-features">

            {features.map((feature) => {

              const Icon = feature.icon;

              return (
                <button
                  className="feature-card"
                  key={feature.title}
                  onClick={() => navigate(feature.path)}
                >

                  <div className={`feature-icon ${feature.color}`}>
                    <Icon size={23} />
                  </div>

                  <div className="feature-card-text">

                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>

                  </div>

                  <ArrowUpRight
                    className="feature-arrow"
                    size={20}
                  />

                </button>
              );

            })}

          </div>

          {/* FOOTER */}
          <footer className="dashboard-footer">

            <span>© 2026 NIXIA</span>

            <span>Build Skills. Shape Your Future.</span>

          </footer>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
