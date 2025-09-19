"use client";  // App Router 下需要声明客户端组件

import { useState } from "react";

export default function RequirementCapturePage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);

    // 模拟提交请求
    setTimeout(() => {
      console.log("User input:", description);
      setLoading(false);
      alert(
        "已提交：" +
          description +
          "\n下一步：解析需求并生成简单 UI（Entities 表单、角色菜单等）"
      );
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20 flex items-center justify-center font-semibold">
            AI
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Mini AI App Builder
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 flex-1 grid place-items-center">
        <div className="relative w-full max-w-2xl">
          {/* Glow border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-3xl blur opacity-30"></div>

          <div className="relative rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8">
            <h2 className="text-2xl font-bold">Step 1 · 需求捕获</h2>
            <p className="mt-2 text-sm text-slate-300">
              用一句话描述你要做的应用（例如：课程管理、库存系统、预订平台等）。
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm text-slate-300">应用描述</span>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl bg-white/10 ring-1 ring-white/10 focus:ring-2 focus:ring-sky-400 px-4 py-3 outline-none placeholder:text-slate-400"
                  placeholder="例如：老师可以建课，学生选课，管理员出报表"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 transition"
                aria-busy={loading}
              >
                {loading ? "提交中…" : "提交"}
              </button>
            </form>

            <div className="mt-4 text-xs text-slate-400">
              目标：后续解析出{" "}
              <span className="font-semibold">
                App Name / Entities / Roles / Features
              </span>
              ，并基于它们生成 UI。
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-xs text-slate-400">
        © {new Date().getFullYear()} Mini AI App Builder
      </footer>
    </div>
  );
}