"use client";  // App Router 下需要声明客户端组件

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RequirementCapturePage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description }),
      });
      const data = await res.json();

      // 将解析结果保存在 localStorage，供下一步页面编辑使用
      localStorage.setItem("extractedSpec", JSON.stringify({
        appName: data.appName || "My App",
        entities: Array.isArray(data.entities) ? data.entities : ["Item"],
        roles: Array.isArray(data.roles) ? data.roles : ["User"],
        features: Array.isArray(data.features) ? data.features : ["View dashboard"],
        sourceText: description.trim(),
      }));

      router.push("/review");
    } catch (err) {
      console.error(err);
      alert("Extraction failed.");
    } finally {
      setLoading(false);
    }
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


          <div className="ml-auto">
            <Link href="/history" className="text-sm px-3 py-1 rounded-lg ring-1 ring-white/10 hover:bg-white/10">
              History
            </Link>
          </div>


          
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 flex-1 grid place-items-center">
        <div className="relative w-full max-w-2xl">

          {/* Glow border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-3xl blur opacity-30"></div>

          <div className="relative rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8">
            <h2 className="text-2xl font-bold">Step 1 · requirements capture</h2>
            <p className="mt-2 text-sm text-slate-300">
              Describe your app in one sentence （e.g.：I want develop a website called welcome to China. It help newcomers to China get used to here. It provides some services like how to apply bank card, how to apply traffic card, and job or study guide.）
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm text-slate-300">App Description:</span>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl bg-white/10 ring-1 ring-white/10 focus:ring-2 focus:ring-sky-400 px-4 py-3 outline-none placeholder:text-slate-400"
                  placeholder=""
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 transition flex items-center justify-center gap-2"
                aria-busy={loading}
              >
                {loading && (
                  <svg 
                    className="animate-spin h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>

            <div className="mt-4 text-xs text-slate-400">
              Goal: Parse the  
              <span className="font-semibold">
                : App Name / Entities / Roles / Features &nbsp;
              </span>
              from the input, then generate the UI from them.
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