import { useRef, useActionState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth/register.css";
import logo from "../../assets/img/quarkbiz-logo.png";
import type { RegisterAccountActionState } from "../../types/state-types/RegisterAccountActionState";
import { RegisterAccountAction } from "../../actions/forms/auth/RegisterAccountAction";

// ---------------------------- ACTION STATE --------------

const initialActionState: RegisterAccountActionState = {
  success: false,
};
// -------------------------------------------------------- 

export default function Register() {
  const navigate = useNavigate();

    // action states
    const [state, formAction, isPending] = useActionState(
      RegisterAccountAction,
      initialActionState
    );

   // refs
   const formRef = useRef<HTMLFormElement>(null);

   // Reset form after successful submit
    useEffect(() => {
      if (state.success) {
        formRef.current?.reset();
        alert("Account created");
        navigate("/login");
      }
    }, [state.success]);

  return (
    <div className="register-page">
      <form ref={formRef} action={formAction} className="register-card">
        {/* Logo */}
        <img src={logo} alt="Quarkbiz Logo" className="auth-logo" />
        <h2 className="register-title">Create Account</h2>

        {/* Username */}
        <div className="register-field">
          <label className="register-label">Username</label>
          <input
            type="text"
            name="username"
            required
            className="register-input"
          />
          {/* Error message if username is invalid */}
          {state.fieldErrors?.username && (
            <p className="register-error">{state.fieldErrors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="register-field">
          <label className="register-label">Password</label>
          <input
            type="password"
            required
            name="password"
            className="register-input"
          />
          {/* Error message if password is invalid */}
          {state.fieldErrors?.password && (
            <p className="register-error">{state.fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password  */}
        <div className="register-field">
          <label className="register-label">Confirm Password</label>
          <input
            type="password"
            required
            name="confirm-password"
            className="register-input"
          />
          {state.fieldErrors?.confirmPassword && (
            <p className="register-error">{state.fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Display Name */}
        <div className="register-field mb-6">
          <label className="register-label">Display Name</label>
          <input
            type="text"
            required
            name="display-name"
            className="register-input"
          />
          {/* Error message if display name is invalid */}
          {state.fieldErrors?.displayName && (
            <p className="register-error">{state.fieldErrors?.displayName}</p>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={isPending} className="register-button">
          {isPending ? "Creating account..." : "Register"}
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
