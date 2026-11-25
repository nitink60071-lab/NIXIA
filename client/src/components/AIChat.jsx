
import "./AIChat.css";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Send,
  Bot,
  User,
  Sparkles,
  Plus,
  MessageSquare,
  Menu,
  X,
  LogOut
} from "lucide-react";

const AIChat = ({ onLogout }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm NIXIA AI, your personal career assistant. How can I help you today?"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage }
    ]);

    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to use NIXIA AI.");
      }

      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: userMessage
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.message || "Unable to connect to NIXIA AI."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm NIXIA AI. What would you like to learn today?"
      }
    ]);

    setInput("");
  };

  const suggestions = [
    "Create a Data Science roadmap",
    "How to prepare for placements?",
    "Improve my resume",
    "Prepare me for a Java interview"
  ];

  return (
    <div className="nixia-chat">

      <aside
        className={`chat-sidebar ${
          sidebarOpen ? "open" : "closed"
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>

          <span>NIXIA</span>

          <button
            className="icon-btn mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <button className="new-chat-btn" onClick={newChat}>
          <Plus size={19} />
          New Chat
        </button>

        <button
          className="new-chat-btn"
          onClick={onLogout}
        >
          <LogOut size={19} />
          Logout
        </button>

        <div className="sidebar-label">
          YOUR ASSISTANT
        </div>

        <div className="sidebar-item active">
          <MessageSquare size={18} />
          AI Career Assistant
        </div>

        <div className="sidebar-footer">
          <div className="footer-avatar">N</div>

          <div>
            <strong>NIXIA AI</strong>
            <span>Career Development</span>
          </div>
        </div>
      </aside>

      <main className="chat-main">

        <header className="chat-header">
          <div className="header-left">
            <button
              className="icon-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu size={21} />
            </button>

            <div>
              <h3>AI Career Assistant</h3>

              <span className="online-status">
                <span className="online-dot"></span>
                Powered by Gemini AI
              </span>
            </div>
          </div>

          <div className="header-badge">
            <Sparkles size={15} />
            NIXIA Intelligence
          </div>
        </header>

        <section className="chat-messages">

          <div className="welcome-section">
            <div className="welcome-icon">
              <Sparkles size={30} />
            </div>

            <h1>
              Your Career Journey
              <br />
              Starts Here.
            </h1>

            <p>
              Ask anything about careers, skills, resumes,
              interviews and placements.
            </p>
          </div>

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`message-row ${message.role}`}
            >
              <div className="message-avatar">
                {message.role === "assistant" ? (
                  <Bot size={19} />
                ) : (
                  <User size={19} />
                )}
              </div>

              <div className="message-content">
                <span className="message-name">
                  {message.role === "assistant"
                    ? "NIXIA AI"
                    : "You"}
                </span>

                <div className="markdown-content">
                  {message.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="message-avatar">
                <Bot size={19} />
              </div>

              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />

        </section>

        <div className="chat-bottom">

          {messages.length === 1 && (
            <div className="suggestion-list">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form
            className="chat-input-area"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              placeholder="Ask NIXIA anything about your career..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="send-btn"
            >
              <Send size={19} />
            </button>
          </form>

          <p className="disclaimer">
            NIXIA AI can make mistakes. Verify important career information.
          </p>

        </div>
      </main>
    </div>
  );
};

export default AIChat;
