"use client";

import type React from "react";
import { useState } from "react";
import { login as apiLogin } from "@/api/authService";
import { useAuth } from "@/context/AuthContext";
import Spinner from "../ui/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, email: userEmail } = await apiLogin(email, password);

      if (!userEmail) {
        setError("User data is missing or invalid");
        return;
      }

      login(token, { id: "", email: userEmail });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-start justify-center px-4 pt-32">
      <div className="w-full max-w-md">
        <div className="bg-[#1f1f1f] p-8 rounded border border-[#333333]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded p-4 text-red-200 mb-4">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-white font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#252525] border border-[#333333] rounded p-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFCC00] focus:ring-[#FFCC00] transition-colors duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-white font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#252525] border border-[#333333] rounded p-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFCC00] focus:ring-[#FFCC00] transition-colors duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 rounded-md font-medium flex items-center justify-center gap-4 transition-all duration-300 ${
                loading
                  ? "bg-[#333333] text-gray-400 cursor-not-allowed"
                  : "bg-[#FFCC00] text-black hover:bg-[#FFD700]"
              }`}
            >
              {loading ? "Signing in..." : "Log In"}
              {loading && <Spinner size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
