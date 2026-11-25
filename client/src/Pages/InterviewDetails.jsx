
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../api";

import {
  ArrowLeft,
  BrainCircuit,
  CalendarDays,
  Trophy,
  MessageSquare,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./InterviewDetails.css";

function InterviewDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again.");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/interview/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load interview.");
        }

        setInterview(data.interview);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="interview-details-state">
        <Loader2 className="details-spinner" size={38} />
        <p>Loading interview details...</p>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="interview-details-state">
        <AlertCircle size={38} />
        <h2>Unable to Load Interview</h2>
        <p>{error || "Interview not found."}</p>
        <button onClick={() => navigate("/interview-history")}>
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="interview-details-page">
      <header className="details-header">
        <button
          className="details-back-btn"
          onClick={() => navigate("/interview-history")}
        >
          <ArrowLeft size={18} />
          Back to History
        </button>

        <div className="details-heading">
          <div className="details-heading-icon">
            <BrainCircuit size={28} />
          </div>

          <div>
            <h1>Interview Details</h1>
            <p>Review your answers and AI performance feedback.</p>
          </div>
        </div>
      </header>

      <main className="details-container">
        <section className="details-summary">
          <div>
            <span className="details-label">Interview Role</span>
            <h2>{interview.role}</h2>
            <p>{interview.level}</p>
          </div>

          <div className="details-summary-stats">
            <div>
              <MessageSquare size={20} />
              <strong>{interview.questions?.length || 0}</strong>
              <span>Questions</span>
            </div>

            <div>
              <Trophy size={20} />
              <strong>{interview.totalScore || 0}</strong>
              <span>Total Score</span>
            </div>

            <div>
              <CalendarDays size={20} />
              <strong>{formatDate(interview.createdAt)}</strong>
              <span>Interview Date</span>
            </div>
          </div>

          <span className={`details-status ${
            interview.status === "Completed"
              ? "details-completed"
              : "details-progress"
          }`}>
            {interview.status}
          </span>
        </section>

        <section className="details-questions-section">
          <div className="details-section-heading">
            <h2>Questions & Answers</h2>
            <p>Your complete interview performance</p>
          </div>

          {interview.questions?.map((item, index) => (
            <article className="details-question-card" key={index}>
              <div className="details-question-top">
                <span className="details-question-number">
                  Question {index + 1}
                </span>

                <span className="details-question-score">
                  <Trophy size={16} />
                  {item.score}/10
                </span>
              </div>

              <h3>{item.question}</h3>

              <div className="details-answer">
                <h4>Your Answer</h4>
                <p>{item.answer || "No answer submitted."}</p>
              </div>

              <div className="details-feedback">
                <h4>
                  <CheckCircle size={18} />
                  AI Feedback
                </h4>

                {item.feedback ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {item.feedback}
                  </ReactMarkdown>
                ) : (
                  <p>Feedback is not available for this question.</p>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default InterviewDetails;
