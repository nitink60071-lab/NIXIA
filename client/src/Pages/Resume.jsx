
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import API_BASE_URL from "../api";

import {
  Upload,
  FileText,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Target,
  Lightbulb,
  Code2,
  GraduationCap,
  ListChecks,
  Download
} from "lucide-react";

import "./Resume.css";

function Resume() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select your resume PDF first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again to continue.");
      }

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(
        `${API_BASE_URL}/api/resume/analyze`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Resume analysis failed.");
      }

      if (!data.analysis || typeof data.analysis !== "object") {
        throw new Error("Invalid analysis received. Please try again.");
      }

      setAnalysis(data.analysis);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // PDF DOWNLOAD FUNCTION
  const handleDownloadPDF = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    let y = 20;

    const addText = (heading, content) => {
      if (
        content === undefined ||
        content === null ||
        content === ""
      ) {
        return;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);

      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(heading, 15, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const text = Array.isArray(content)
        ? content.map(item => `- ${item}`).join("\n")
        : String(content);

      const lines = doc.splitTextToSize(text, 180);

      lines.forEach(line => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }

        doc.text(line, 15, y);
        y += 6;
      });

      y += 6;
    };

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("NIXIA", 15, y);

    y += 10;

    doc.setFontSize(15);
    doc.text("Resume Analysis Report", 15, y);

    y += 15;

    addText("Resume Score", `${analysis.score ?? "N/A"}/100`);
    addText("ATS Compatibility", analysis.atsCompatibility);
    addText("Overall Review", analysis.summary);
    addText("Key Strengths", analysis.strengths);
    addText("Technical Skills", analysis.technicalSkills);
    addText("Recommended Skills", analysis.missingSkills);
    addText("Project Improvements", analysis.projectImprovements);
    addText("Education & Experience", analysis.experienceEducationReview);
    addText("Formatting Suggestions", analysis.formattingSuggestions);
    addText("Recommendations", analysis.recommendations);

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");

    if (y > 275) {
      doc.addPage();
      y = 20;
    }

    doc.text(
      "AI-generated feedback is an estimate, not a guaranteed ATS score or hiring outcome.",
      15,
      y
    );

    doc.save("NIXIA-Resume-Analysis.pdf");
  };

  const renderList = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return <p>No information available.</p>;
    }

    return (
      <ul className="analysis-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="resume-page">

      <div className="resume-header">

        <button
          className="resume-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="resume-heading">

          <div className="resume-icon">
            <FileText size={28} />
          </div>

          <h1>AI Resume Analyzer</h1>

          <p>
            Get AI-powered feedback to improve your resume.
          </p>

        </div>
      </div>

      <div className="resume-upload-card">

        <div className="resume-upload-icon">
          <Upload size={30} />
        </div>

        <h2>Upload Your Resume</h2>

        <p>Choose your PDF resume (Maximum size: 5 MB)</p>

        <label className="resume-file-label">

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              setFile(e.target.files[0] || null);
              setError("");
              setAnalysis(null);
            }}
          />

          <FileText size={18} />

          {file ? file.name : "Choose PDF File"}

        </label>

        {file && (
          <p className="resume-file-info">
            Selected: {file.name}
          </p>
        )}

        <button
          className="resume-analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !file}
        >
          {loading ? (
            <>
              <Loader2 className="resume-spinner" size={19} />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Sparkles size={19} />
              Analyze My Resume
            </>
          )}
        </button>

        {error && (
          <p className="resume-error">
            <AlertCircle size={17} />
            {error}
          </p>
        )}

      </div>

      {analysis && (
        <div className="resume-result-card">

          <h2>
            <Sparkles size={22} />
            AI Analysis Results
          </h2>

          <div className="resume-score-grid">

            <div className="resume-score-card score-visual-card">

              <span>Overall Resume Score</span>

              <div
                className="score-circle"
                style={{
                  background: `conic-gradient(#8b5cf6 ${Math.max(
                    0,
                    Math.min(100, Number(analysis.score) || 0)
                  )}%, #273149 0)`
                }}
              >
                <div className="score-circle-inner">
                  <strong>{analysis.score ?? "N/A"}</strong>
                  <small> / 100</small>
                </div>
              </div>

              <p className="score-caption">
                AI Resume Assessment
              </p>

            </div>

            <div className="resume-score-card ats-visual-card">

              <CheckCircle2 size={30} />

              <span>ATS Compatibility</span>

              <strong className="ats-status">
                {analysis.atsCompatibility || "N/A"}
              </strong>

              <p className="score-caption">
                Estimated ATS assessment
              </p>

            </div>

          </div>

          <section className="analysis-section">
            <h3>
              <Target size={19} />
              Overall Resume Review
            </h3>
            <p>{analysis.summary || "No summary available."}</p>
          </section>

          <section className="analysis-section">
            <h3>
              <CheckCircle2 size={19} />
              Key Strengths
            </h3>
            {renderList(analysis.strengths)}
          </section>

          <section className="analysis-section">
            <h3>
              <Code2 size={19} />
              Technical Skills Identified
            </h3>
            {renderList(analysis.technicalSkills)}
          </section>

          <section className="analysis-section">
            <h3>
              <Lightbulb size={19} />
              Recommended Skills
            </h3>
            {renderList(analysis.missingSkills)}
          </section>

          <section className="analysis-section">
            <h3>Project Improvements</h3>
            {renderList(analysis.projectImprovements)}
          </section>

          <section className="analysis-section">
            <h3>
              <GraduationCap size={19} />
              Education & Experience
            </h3>
            <p>
              {analysis.experienceEducationReview || "No review available."}
            </p>
          </section>

          <section className="analysis-section">
            <h3>Formatting Suggestions</h3>
            {renderList(analysis.formattingSuggestions)}
          </section>

          <section className="analysis-section">
            <h3>
              <ListChecks size={19} />
              Actionable Recommendations
            </h3>
            {renderList(analysis.recommendations)}
          </section>

          <button
            className="resume-analyze-btn"
            onClick={handleDownloadPDF}
          >
            <Download size={19} />
            Download Analysis Report
          </button>

          <p className="resume-disclaimer">
            AI-generated feedback is an estimate, not a guaranteed ATS score
            or hiring outcome.
          </p>

        </div>
      )}

    </div>
  );
}

export default Resume;
