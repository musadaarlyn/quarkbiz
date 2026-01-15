import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth/AuthService";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "../../styles/auth/Login.css"
import logo from "../../assets/img/quarkbiz-logo.png";


export default function Login() {
  const { loginContext: saveToken } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const token = await login({ username, password });
      saveToken(token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-card">
        {/* Logo */}
        <img src={logo} alt="Quarkbiz Logo" className="auth-logo" />
        <h2 className="login-title">Login</h2>

        {/* Username */}
        <div className="login-field">
          <label className="login-label">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
        </div>

        {/* Password */}
        <div className="login-field mb-6">
          <label className="login-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>

        {/* Error */}
        {error && <div className="login-error">{error}</div>}

        {/* Submit */}
        <button type="submit" className="login-button">
          Login
        </button>

        {/* Register link */}
        <p className="login-footer">
          Don’t have an account?{" "}
          <Link to="/register" className="login-link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
