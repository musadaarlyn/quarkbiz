import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth/AuthService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


export default function Login() {
  const { login: saveToken } = useAuth();
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
      localStorage.setItem("jwtToken", token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2f3234] font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#414547] p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Login
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md bg-[#2f3234] text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[#05b7f5]"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md bg-[#2f3234] text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[#05b7f5]"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#05b7f5] text-white py-2 rounded-md font-medium
                     hover:bg-[#049fd6] transition-colors"
        >
          Login
        </button>
        {/* Register link */}
        <p className="mt-4 text-center text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#05b7f5] hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
