
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  ArrowLeft,
  BrainCircuit,
  Sparkles,
  Send,
  Loader2,
  MessageSquare,
  RotateCcw
} from "lucide-react";

import "./Interview.css";

function Interview() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Frontend Developer");
  const [level, setLevel] = useState("Fresher");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [error, setError] = useState("");

  const [interviewId, setInterviewId] = useState(null);
  const [savedQuestions, setSavedQuestions] = useState([]);

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login again to continue.");
    }

    return token;
  };

  const callAI = async (message) => {
    const token = getToken();

    const response = await fetch(
      "http://localhost:5000/api/ai/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "AI request failed.");
    }

    return data.reply;
  };

  // Save interview session in MongoDB
  const createInterview = async (firstQuestion) => {
    const token = getToken();

    const response = await fetch(
      "http://localhost:5000/api/interview/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          role,
          level,
          questions: [
            {
              question: firstQuestion,
              answer: "",
              feedback: "",
              score: 0
            }
          ],
          totalScore: 0,
          status: "In Progress"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to save interview.");
    }

    return data.interview._id;
  };

  // Update interview session in MongoDB
  const updateInterview = async (questions, status = "In Progress") => {
    const token = getToken();

    if (!interviewId) {
      throw new Error("Interview session not found.");
    }

    const scoredQuestions = questions.filter(
      (item) => item.answer.trim() && item.feedback
    );

    const totalScore = scoredQuestions.reduce(
      (sum, item) => sum + item.score,
      0
    );

    const response = await fetch(
      `http://localhost:5000/api/interview/${interviewId}/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          questions,
          totalScore,
          status
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update interview.");
    }

    return data;
  };

  // Start Interview
  const startInterview = async () => {
    setLoading(true);
    setError("");
    setFeedback("");
    setAnswer("");
    setInterviewId(null);
    setSavedQuestions([]);

    try {
      const reply = await callAI(
        `Act as a professional technical interviewer.

Conduct a mock interview for the role: ${role}.
Candidate experience level: ${level}.

Generate only the first interview question.
Keep it relevant to the selected role and experience level.
Do not provide the answer or hints.
Ask one question only.`
      );

      const newInterviewId = await createInterview(reply);

      setInterviewId(newInterviewId);
      setSavedQuestions([
        {
          question: reply,
          answer: "",
          feedback: "",
          score: 0
        }
      ]);

      setQuestion(reply);
      setStarted(true);
      setQuestionNumber(1);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Answer and Save Feedback
  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please write your answer first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reply = await callAI(
        `Act as a professional interview evaluator.

Role: ${role}
Experience level: ${level}
Interview question: ${question}
Candidate answer: ${answer}

Evaluate the answer honestly.

Provide:
1. Score out of 10
2. What was good
3. What needs improvement
4. A better sample answer

Use clear headings and concise feedback.
Be encouraging and constructive.

Clearly write the score in this format: Score: X/10.`
      );

      const scoreMatch = reply.match(
        /Score\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i
      );

      const score = scoreMatch
        ? Math.min(10, Math.max(0, Number(scoreMatch[1])))
        : 0;

      const updatedQuestions = savedQuestions.map((item, index) =>
        index === questionNumber - 1
          ? {
              ...item,
              answer: answer.trim(),
              feedback: reply,
              score
            }
          : item
      );

      await updateInterview(updatedQuestions);

      setSavedQuestions(updatedQuestions);
      setFeedback(reply);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate Next Question
  const nextQuestion = async () => {
    setLoading(true);
    setError("");

    try {
      const nextNumber = questionNumber + 1;

      const reply = await callAI(
        `Act as a professional technical interviewer.

Role: ${role}
Experience level: ${level}

Generate interview question number ${nextNumber}.
Ask one new question only.
Avoid repeating the previous question:
${question}

Do not provide the answer or hints.`
      );

      const updatedQuestions = [
        ...savedQuestions,
        {
          question: reply,
          answer: "",
          feedback: "",
          score: 0
        }
      ];

      await updateInterview(updatedQuestions);

      setSavedQuestions(updatedQuestions);
      setQuestion(reply);
      setQuestionNumber(nextNumber);
      setAnswer("");
      setFeedback("");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Complete Interview
  const resetInterview = async () => {
    setLoading(true);
    setError("");

    try {
      if (interviewId) {
        await updateInterview(savedQuestions, "Completed");
      }

      setStarted(false);
      setQuestion("");
      setAnswer("");
      setFeedback("");
      setQuestionNumber(1);
      setInterviewId(null);
      setSavedQuestions([]);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-page">

      <header className="interview-header">

        <button
          className="interview-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="interview-title">
          <div className="interview-icon">
            <BrainCircuit size={28} />
          </div>

          <h1>AI Mock Interview</h1>

          <p>
            Practice interviews and improve your confidence with AI.
          </p>
        </div>

      </header>

      {!started ? (
        <div className="interview-setup">

          <div className="interview-card">

            <Sparkles size={30} />

            <h2>Prepare for Your Interview</h2>

            <p>
              Choose your target job role and experience level
              to begin your mock interview.
            </p>

            <label>Target Job Role</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
              <option>Data Analyst</option>
              <option>Data Scientist</option>
              <option>Machine Learning Engineer</option>
              <option>Java Developer</option>
              <option>Python Developer</option>
            </select>

            <label>Experience Level</label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>Fresher</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Experienced</option>
            </select>

            <button
              className="interview-primary-btn"
              onClick={startInterview}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="interview-spinner" size={19} />
                  Preparing Interview...
                </>
              ) : (
                <>
                  <Sparkles size={19} />
                  Start Mock Interview
                </>
              )}
            </button>

            {error && (
              <p className="interview-error">{error}</p>
            )}

          </div>

        </div>
      ) : (
        <div className="interview-workspace">

          <div className="interview-progress">
            <span>Interview in Progress</span>
            <span>Question {questionNumber}</span>
          </div>

          <div className="interview-card question-card">

            <h2>
              <MessageSquare size={22} />
              Interview Question
            </h2>

            <div className="interview-question">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {question}
              </ReactMarkdown>
            </div>

          </div>

          <div className="interview-card answer-card">

            <h2>Your Answer</h2>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your interview answer here..."
              rows={7}
              disabled={loading || Boolean(feedback)}
            />

            {!feedback && (
              <button
                className="interview-primary-btn"
                onClick={submitAnswer}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="interview-spinner" size={19} />
                    Evaluating Answer...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Answer
                  </>
                )}
              </button>
            )}

          </div>

          {feedback && (
            <div className="interview-card feedback-card">

              <h2>
                <Sparkles size={22} />
                AI Feedback
              </h2>

              <div className="interview-feedback">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {feedback}
                </ReactMarkdown>
              </div>

              <button
                className="interview-primary-btn"
                onClick={nextQuestion}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="interview-spinner" size={19} />
                    Loading Next Question...
                  </>
                ) : (
                  <>
                    Next Question
                    <Send size={18} />
                  </>
                )}
              </button>

            </div>
          )}

          {error && (
            <p className="interview-error">{error}</p>
          )}

          <button
            className="interview-reset-btn"
            onClick={resetInterview}
            disabled={loading}
          >
            <RotateCcw size={17} />
            Finish Interview
          </button>

        </div>
      )}

    </div>
  );
}

export default Interview;
