
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BrainCircuit,
  Trophy,
  Target,
  ClipboardCheck,
  TrendingUp,
  Loader2,
  RefreshCw
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

import "./InterviewPerformance.css";

function InterviewPerformance() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [rolePerformance, setRolePerformance] = useState([]);
  const [recentPerformance, setRecentPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        "http://localhost:5000/api/interview/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load performance.");
      }

      setStats(data.stats);
      setRolePerformance(data.rolePerformance || []);
      setRecentPerformance(data.recentPerformance || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = recentPerformance.map((item, index) => ({
    attempt: `Attempt ${index + 1}`,
    score: item.score,
    role: item.role
  }));

  const roleChartData = rolePerformance.map((item) => ({
    role: item.role,
    score: item.averageScore
  }));

  if (loading) {
    return (
      <div className="performance-state">
        <Loader2 className="performance-spinner" size={38} />
        <p>Loading performance dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-state">
        <p>{error}</p>
        <button onClick={fetchStats}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="performance-page">
      <header className="performance-header">
        <button
          className="performance-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="performance-heading">
          <div className="performance-heading-icon">
            <TrendingUp size={28} />
          </div>

          <div>
            <h1>Interview Performance</h1>
            <p>Track your progress and improve your interview skills.</p>
          </div>
        </div>
      </header>

      <main className="performance-container">
        <div className="performance-topbar">
          <div>
            <h2>Your Performance Overview</h2>
            <p>Based on your completed mock interviews</p>
          </div>

          <button
            className="performance-refresh-btn"
            onClick={fetchStats}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <section className="performance-stats-grid">
          <div className="performance-stat-card">
            <div className="performance-stat-icon purple">
              <BrainCircuit size={23} />
            </div>
            <p>Total Interviews</p>
            <h2>{stats?.totalInterviews || 0}</h2>
            <span>All attempts</span>
          </div>

          <div className="performance-stat-card">
            <div className="performance-stat-icon blue">
              <ClipboardCheck size={23} />
            </div>
            <p>Completed Interviews</p>
            <h2>{stats?.completedInterviews || 0}</h2>
            <span>Successfully finished</span>
          </div>

          <div className="performance-stat-card">
            <div className="performance-stat-icon green">
              <Target size={23} />
            </div>
            <p>Average Score</p>
            <h2>{stats?.averageScore || 0}<small>/10</small></h2>
            <span>Across completed attempts</span>
          </div>

          <div className="performance-stat-card">
            <div className="performance-stat-icon orange">
              <Trophy size={23} />
            </div>
            <p>Best Score</p>
            <h2>{stats?.bestScore || 0}<small>/10</small></h2>
            <span>Your highest average</span>
          </div>
        </section>

        <section className="performance-charts-grid">
          <div className="performance-chart-card">
            <div className="performance-chart-heading">
              <h3>Score Improvement</h3>
              <p>Your average score across completed attempts</p>
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#263149" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="attempt"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#151c30",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      color: "#fff"
                    }}
                    formatter={(value) => [`${value}/10`, "Score"]}
                    labelFormatter={(label, payload) =>
                      payload?.[0]?.payload?.role
                        ? `${label} - ${payload[0].payload.role}`
                        : label
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#a78bfa"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#a78bfa" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="performance-no-chart">
                Complete an interview to see your score progress.
              </div>
            )}
          </div>

          <div className="performance-chart-card">
            <div className="performance-chart-heading">
              <h3>Role-wise Performance</h3>
              <p>Average scores by interview role</p>
            </div>

            {roleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={roleChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 35 }}
                >
                  <CartesianGrid stroke="#263149" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="role"
                    stroke="#94a3b8"
                    tick={{ fontSize: 10 }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#151c30",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      color: "#fff"
                    }}
                    formatter={(value) => [`${value}/10`, "Average Score"]}
                  />
                  <Bar
                    dataKey="score"
                    fill="#818cf8"
                    radius={[7, 7, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="performance-no-chart">
                Complete interviews in different roles to compare performance.
              </div>
            )}
          </div>
        </section>

        <section className="performance-role-section">
          <div className="performance-section-heading">
            <h2>Role-wise Statistics</h2>
            <p>Your performance in different job roles</p>
          </div>

          {rolePerformance.length > 0 ? (
            <div className="performance-role-list">
              {rolePerformance.map((item, index) => (
                <div className="performance-role-item" key={item.role}>
                  <div>
                    <span className="performance-role-number">
                      {index + 1}
                    </span>
                    <div>
                      <h3>{item.role}</h3>
                      <p>{item.attempts} attempt(s)</p>
                    </div>
                  </div>

                  <strong>{item.averageScore}/10</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="performance-empty">
              <Trophy size={30} />
              <h3>No Performance Data Yet</h3>
              <p>
                Complete your first mock interview to see your statistics.
              </p>
              <button onClick={() => navigate("/interview")}>
                Start Mock Interview
              </button>
            </div>
          )}
        </section>

        <div className="performance-bottom-action">
          <button onClick={() => navigate("/interview-history")}>
            View Interview History
          </button>
        </div>
      </main>
    </div>
  );
}

export default InterviewPerformance;
