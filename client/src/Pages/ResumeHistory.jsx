
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  Calendar,
  Trophy,
  RefreshCw,
  History
} from "lucide-react";

import "./ResumeHistory.css";

function ResumeHistory() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumeHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/resume/history",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch resume history"
          );
        }

        setResumes(data.resumes || []);

      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchResumeHistory();
  }, []);

  return (
    <div className="resume-history-page">

      <div className="resume-history-container">

        {/* HEADER */}

        <button
          className="resume-history-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="resume-history-header">

          <div>
            <h1>Resume History</h1>

            <p>
              Track all your previous AI resume analyses.
            </p>
          </div>

          <History size={40} />

        </div>

        {/* LOADING */}

        {loading && (
          <div className="resume-history-message">

            <RefreshCw className="resume-history-loader" />

            <p>Loading your resume history...</p>

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="resume-history-message">

            <p>{error}</p>

          </div>
        )}

        {/* EMPTY STATE */}

        {!loading && !error && resumes.length === 0 && (

          <div className="resume-history-empty">

            <FileText size={48} />

            <h2>No Resume History Found</h2>

            <p>
              Analyze your first resume to see your results here.
            </p>

            <button onClick={() => navigate("/resume")}>
              Analyze Resume
            </button>

          </div>

        )}

        {/* RESUME HISTORY LIST */}

        {!loading && !error && resumes.length > 0 && (

          <>

            <div className="resume-history-count">

              <h2>
                Your Previous Analyses
              </h2>

              <span>
                {resumes.length} Analyses
              </span>

            </div>

            <div className="resume-history-list">

              {resumes.map((resume, index) => (

                <div
                  className="resume-history-card"
                  key={resume._id}
                >

                  <div className="resume-history-card-top">

                    <div className="resume-history-icon">
                      <FileText size={25} />
                    </div>

                    <div>

                      <h2>
                        Resume Analysis #{resumes.length - index}
                      </h2>

                      <p>
                        <Calendar size={14} />

                        {new Date(
                          resume.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>

                    </div>

                  </div>

                  <div className="resume-history-score">

                    <Trophy size={22} />

                    <span>
                      {resume.score}/100
                    </span>

                  </div>

                  <div className="resume-history-ats">

                    <span>ATS Compatibility</span>

                    <strong>
                      {resume.atsCompatibility}
                    </strong>

                  </div>

                  <div className="resume-history-summary">

                    <h3>AI Summary</h3>

                    <p>
                      {resume.summary || "No summary available."}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            <button
              className="resume-history-analyze"
              onClick={() => navigate("/resume")}
            >
              <FileText size={17} />
              Analyze New Resume
            </button>

          </>

        )}

      </div>

    </div>
  );
}

export default ResumeHistory;
