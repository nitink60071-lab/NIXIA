
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BrainCircuit,
  CalendarDays,
  Trophy,
  Clock,
  Loader2,
  MessageSquare,
  RefreshCw
} from "lucide-react";

import "./InterviewHistory.css";

function InterviewHistory() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        "http://localhost:5000/api/interview/history",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load history.");
      }

      setInterviews(data.interviews || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="interview-history-page">

      <header className="history-header">

        <button
          className="history-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="history-heading">
          <div className="history-heading-icon">
            <BrainCircuit size={28} />
          </div>

          <div>
            <h1>Interview History</h1>
            <p>Track your mock interview attempts and performance.</p>
          </div>
        </div>

      </header>

      <main className="history-container">

        <div className="history-topbar">
          <div>
            <h2>Your Previous Interviews</h2>
            <p>
              {interviews.length} interview
              {interviews.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <button
            className="history-refresh-btn"
            onClick={fetchHistory}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="history-state">
            <Loader2 className="history-spinner" size={35} />
            <p>Loading interview history...</p>
          </div>
        ) : error ? (
          <div className="history-state history-error">
            <p>{error}</p>
            <button onClick={fetchHistory}>Try Again</button>
          </div>
        ) : interviews.length === 0 ? (
          <div className="history-empty">
            <div className="history-empty-icon">
              <MessageSquare size={35} />
            </div>

            <h2>No Interview History Yet</h2>

            <p>
              Your completed interview attempts will appear here.
              Start your first mock interview to begin tracking progress.
            </p>

            <button
              className="history-start-btn"
              onClick={() => navigate("/interview")}
            >
              Start Mock Interview
            </button>
          </div>
        ) : (
          <div className="history-grid">

            {interviews.map((item) => (
              <div className="history-card" key={item._id}>

                <div className="history-card-top">
                  <div className="history-role-icon">
                    <BrainCircuit size={22} />
                  </div>

                  <span className={`history-status ${
                    item.status === "Completed"
                      ? "status-completed"
                      : "status-progress"
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3>{item.role}</h3>

                <p className="history-level">
                  {item.level}
                </p>

                <div className="history-card-details">

                  <div>
                    <MessageSquare size={16} />
                    <span>{item.questions?.length || 0} Questions</span>
                  </div>

                  <div>
                    <Trophy size={16} />
                    <span>
                      {item.totalScore || 0} Score
                    </span>
                  </div>

                  <div>
                    <CalendarDays size={16} />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>

                </div>

                <button
                  className="history-view-btn"
                  onClick={() =>
                    navigate(`/interview-history/${item._id}`)
                  }
                >
                  View Details
                </button>

              </div>
            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default InterviewHistory;
