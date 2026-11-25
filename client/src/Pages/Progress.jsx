
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";

import {
  ArrowLeft,
  Target,
  Trophy,
  BookOpen,
  BriefcaseBusiness,
  TrendingUp
} from "lucide-react";

import "./Progress.css";

function Progress() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState({
    skills: 0,
    interviews: 0,
    resume: 0,
    learning: 0
  });

  const [interviewStats, setInterviewStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    bestScore: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/interview/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load interview progress."
          );
        }

        const stats = data.stats;

        setInterviewStats(stats);

        setProgress((previous) => ({
          ...previous,
          interviews: Math.min(
            100,
            Math.round((stats.averageScore || 0) * 10)
          )
        }));

      } catch (err) {
        console.error("Progress Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const items = [
    {
      title: "Skills Development",
      description: "Track your technical skills development.",
      value: progress.skills,
      icon: BookOpen
    },
    {
      title: "Interview Preparation",
      description: `${interviewStats.completedInterviews} interviews completed`,
      value: progress.interviews,
      icon: Trophy
    },
    {
      title: "Resume Development",
      description: "Build and improve your professional resume.",
      value: progress.resume,
      icon: BriefcaseBusiness
    },
    {
      title: "Learning Goals",
      description: "Track your learning milestones.",
      value: progress.learning,
      icon: Target
    }
  ];

  const overallProgress = Math.round(
    Object.values(progress).reduce(
      (sum, value) => sum + value,
      0
    ) / Object.values(progress).length
  );

  return (
    <div className="progress-page">
      <div className="progress-container">

        <button
          className="progress-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="progress-header">
          <span className="progress-tag">
            <TrendingUp size={16} />
            YOUR GROWTH
          </span>

          <h1>Progress Tracking</h1>

          <p>
            Track your career preparation and stay focused on your goals.
          </p>
        </div>

        {error && (
          <div className="progress-note">
            <p>{error}</p>
          </div>
        )}

        <div className="overall-progress-card">
          <div>
            <h2>Overall Career Progress</h2>

            <p>Your journey towards career readiness.</p>

            <strong>
              {loading ? "..." : `${overallProgress}%`}
            </strong>

            <span>Overall Progress</span>
          </div>

          <div
            className="progress-circle"
            style={{
              background: `conic-gradient(#a855f7 ${
                overallProgress * 3.6
              }deg, #252b40 0deg)`
            }}
          >
            <div>
              <strong>
                {loading ? "..." : `${overallProgress}%`}
              </strong>
            </div>
          </div>
        </div>

        <div className="progress-section-heading">
          <h2>Preparation Overview</h2>
          <p>Your career development categories.</p>
        </div>

        <div className="progress-grid">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="progress-card" key={index}>
                <div className="progress-card-top">
                  <div className="progress-icon">
                    <Icon size={22} />
                  </div>

                  <strong>
                    {loading ? "..." : `${item.value}%`}
                  </strong>
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <div className="progress-bar">
                  <div
                    style={{
                      width: `${loading ? 0 : item.value}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="progress-note">
          <Trophy size={22} />

          <div>
            <h3>Interview Performance Summary</h3>

            <p>
              Total Interviews: {loading ? "..." : interviewStats.totalInterviews}
            </p>

            <p>
              Completed: {loading ? "..." : interviewStats.completedInterviews}
            </p>

            <p>
              Average Score: {loading ? "..." : `${interviewStats.averageScore}/10`}
            </p>

            <p>
              Best Score: {loading ? "..." : `${interviewStats.bestScore}/10`}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Progress;
