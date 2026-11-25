
import { useState } from "react";
import { motion } from "framer-motion";
import API_BASE_URL from "../api";
import {
  BrainCircuit,
  Mail,
  Lock,
  User,
  ArrowRight
} from "lucide-react";

import "./Auth.css";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "signup";

      const response = await fetch(
        `${API_BASE_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Authentication failed."
        );
      }

      // LOGIN OR SIGNUP SUCCESS
      if (data.token) {
        localStorage.setItem("token", data.token);

        setFormData({
          name: "",
          email: "",
          password: ""
        });

        onLogin();
      } else {
        throw new Error(
          isLogin
            ? "Login successful response did not contain a token."
            : "Account created, but automatic login is not enabled by the backend yet."
        );
      }

    } catch (err) {
      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >

        <div className="auth-brand">
          <div className="auth-logo">
            <BrainCircuit size={28} />
          </div>

          <h1>
            NIXIA<span>.</span>
          </h1>

          <p>Build Skills. Shape Your Future.</p>
        </div>

        <div className="auth-heading">
          <h2>
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          <p>
            {isLogin
              ? "Login to continue your career journey."
              : "Join NIXIA and start building your future."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="auth-field">
              <User size={19} />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
              />
            </div>
          )}

          <div className="auth-field">
            <Mail size={19} />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <Lock size={19} />

            <input
              type="password"
              name="password"
              placeholder="Password (minimum 8 characters)"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login to NIXIA"
              : "Create Account"}

            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="auth-switch">

          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>

        </div>

      </motion.div>
    </div>
  );
};

export default Auth;
