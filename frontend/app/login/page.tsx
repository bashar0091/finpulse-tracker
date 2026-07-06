"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Store the JWT token securely in localStorage for session handling
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.user.email);
        alert("Login successful!");
        router.push("/dashboard");
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("[login-error]:", error);
      alert("Something went wrong. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans text-black">
      <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-black uppercase tracking-wide mb-2">FinPulse / Sign In</h2>
        <p className="text-sm font-medium text-zinc-600 mb-6">Enter your security credentials to access your financial vault.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">Email Address Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-black p-3 font-medium outline-none focus:bg-zinc-50"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-black p-3 font-medium outline-none focus:bg-zinc-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-black bg-black py-3 font-black text-white uppercase tracking-widest transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(63,63,70,1)] disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? "Authenticating Vault..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}