import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { IconMail, IconLock, IconListTodo, IconLoader } from "../components/Icons.jsx";

export default function Login() {
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
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your TaskFlow dashboard</p>
        </div>

        {error && (
          <div className="alert-error" role="alert" style={{ marginBottom: "1.25rem" }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">
              Email address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconMail size={17} />
              </span>
              <input
                id="login-email"
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
            <label className="input-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconLock size={17} />
              </span>
              <input
                id="login-password"
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn-submit" disabled={loading}>
            {loading ? (
              <>
                <IconLoader size={18} />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
