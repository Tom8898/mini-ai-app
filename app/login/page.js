"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setUsername("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    try {
      // TODO: 集成真实鉴权逻辑（/api/login）。当前仅做示例。
      await new Promise((r) => setTimeout(r, 500));
      alert(`Welcome, ${username}! (demo)`);
      // 可选：登录后跳转到首页或需求页
      // router.push("/requirement");
    } catch (err) {
      console.error(err);
      alert("Login failed (demo)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20 flex items-center justify-center font-semibold">AI</div>
          <h1 className="text-xl font-semibold tracking-tight">Mini AI App Builder</h1>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 flex-1 grid place-items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-3xl blur opacity-30" />
          <div className="relative rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8">
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="mt-2 text-sm text-slate-300">Enter your username and password. </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {/* Username */}
              <label className="block">
                <span className="text-sm text-slate-300">Username</span>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl bg-white/10 ring-1 ring-white/10 focus:ring-2 focus:ring-sky-400 px-4 py-3 outline-none placeholder:text-slate-400"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>

              {/* Password */}
              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Password</span>
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="text-xs px-2 py-1 rounded-lg ring-1 ring-white/10 hover:bg-white/10"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPwd ? "text" : "password"}
                  className="mt-2 w-full rounded-xl bg-white/10 ring-1 ring-white/10 focus:ring-2 focus:ring-sky-400 px-4 py-3 outline-none placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>

              {/* Actions */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="sm:w-40 w-full rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 transition"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading || !username.trim() || !password}
                  className="sm:flex-1 w-full rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 transition"
                >
                  {loading ? "login…" : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-xs text-slate-400">© {new Date().getFullYear()} Mini AI App Builder</footer>
    </div>
  );
}