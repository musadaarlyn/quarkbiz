import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createAccount } from "../services/accounts/AccountService";

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
    <div className="min-h-screen flex items-center justify-center bg-[#2f3234] font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#414547] p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Username</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="w-full px-3 py-2 rounded-md bg-[#2f3234] text-white
                       focus:outline-none focus:ring-2 focus:ring-[#05b7f5]"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Password</label>
          <input
            type="password"
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full px-3 py-2 rounded-md bg-[#2f3234] text-white
                       focus:outline-none focus:ring-2 focus:ring-[#05b7f5]"
          />
        </div>

        {/* Display Name */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-1">Display Name</label>
          <input
            type="text"
            required
            onChange={(e) =>
              setForm({ ...form, displayName: e.target.value })
            }
            className="w-full px-3 py-2 rounded-md bg-[#2f3234] text-white
                       focus:outline-none focus:ring-2 focus:ring-[#05b7f5]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#05b7f5] text-white py-2 rounded-md font-medium
                     hover:bg-[#049fd6] transition-colors"
        >
          Register
        </button>

        {/* Back to login */}
        <p className="mt-4 text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#05b7f5] hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
