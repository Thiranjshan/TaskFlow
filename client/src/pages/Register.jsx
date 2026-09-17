import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { IconUser, IconMail, IconLock, IconListTodo, IconLoader } from "../components/Icons.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page-top-actions">
        <ThemeToggle />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <IconListTodo size={28} />
          </div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Get started with TaskFlow today</p>
        </div>

        {error && (
          <div className="alert-error" role="alert" style={{ marginBottom: "1.25rem" }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label" htmlFor="register-name">
              Full name
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconUser size={17} />
              </span>
              <input
                id="register-name"
                className="auth-input"
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="register-email">
              Email address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconMail size={17} />
              </span>
              <input
                id="register-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="register-password">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconLock size={17} />
              </span>
              <input
                id="register-password"
                className="auth-input"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn-submit" disabled={loading}>
            {loading ? (
              <>
                <IconLoader size={18} />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Get started</span>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
