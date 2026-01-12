import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createAccount } from "../../services/accounts/AccountService";
import "../../styles/auth/register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    displayName: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createAccount(form);
    navigate("/login");
  }

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-card">
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
