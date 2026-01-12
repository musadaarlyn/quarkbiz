import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createAccount } from "../../services/accounts/AccountService";
import "../../styles/auth/register.css";
import logo from "../../assets/img/quarkbiz-logo.png";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
  }>({});

  function validate() {
    const newErrors: typeof errors = {};

    if (form.username.length < 6 || form.username.length > 60) {
      newErrors.username = "Username must be 6–60 characters";
    }

    if (form.password.length < 6 || form.password.length > 60) {
      newErrors.password = "Password must be 6–60 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (form.displayName.length < 2 || form.displayName.length > 60) {
      newErrors.displayName = "Display name must be 2–60 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    await createAccount(form);
    navigate("/login");
  }

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-card">
        {/* Logo */}
        <img src={logo} alt="Quarkbiz Logo" className="auth-logo" />
        <h2 className="register-title">Create Account</h2>

        {/* Username */}
        <div className="register-field">
          <label className="register-label">Username</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="register-input"
          />
          {/* Error message if username is invalid */}
          {errors.username && (
            <p className="register-error">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="register-field">
          <label className="register-label">Password</label>
          <input
            type="password"
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="register-input"
          />
          {/* Error message if password is invalid */}
          {errors.password && (
            <p className="register-error">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password  */}
        <div className="register-field">
          <label className="register-label">Confirm Password</label>
          <input
            type="password"
            required
            className="register-input"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          {errors.confirmPassword && (
            <p className="register-error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Display Name */}
        <div className="register-field mb-6">
          <label className="register-label">Display Name</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setForm({ ...form, displayName: e.target.value })
            }
            className="register-input"
          />
          {/* Error message if display name is invalid */}
          {errors.displayName && (
            <p className="register-error">{errors.displayName}</p>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="register-button">
          Register
        </button>

        {/* Back to login */}
        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
