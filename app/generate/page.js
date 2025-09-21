"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const router = useRouter();
  const [spec, setSpec] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  // 页面加载：读取 confirmedSpec，并自动请求生成代码
  useEffect(() => {
    try {
      const raw = localStorage.getItem("confirmedSpec");
      if (!raw) {
        router.replace("/review");
        return;
      }
      const parsed = JSON.parse(raw);
      setSpec(parsed);
      (async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/generateCode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed),
          });
          const data = await res.json();
          setCode(data.code || "<!-- empty code -->");
        } catch (err) {
          console.error(err);
          setCode("<!-- generation failed -->");
        } finally {
          setLoading(false);
        }
      })();
    } catch {
      router.replace("/review");
    }
  }, [router]);

  const openPreview = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20 flex items-center justify-center font-semibold">AI</div>
          <h1 className="text-xl font-semibold">Mini AI App Builder – Step 3</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 flex-1 max-w-5xl w-full">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-3xl blur opacity-30" />
          <div className="relative rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 space-y-6">
            <h2 className="text-2xl font-bold">生成静态页面代码</h2>

            {loading && (
              <div className="text-sm text-slate-300">正在根据已确认的需求生成代码…</div>
            )}

            {!loading && code && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">代码</h3>
                  <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto text-sm whitespace-pre-wrap">
                    <code>{code}</code>
                  </pre>
                </div>
                <button
                  onClick={openPreview}
                  className="rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 transition"
                >
                  在新标签中预览
                </button>
                {preview && (
                  <iframe
                    title="preview"
                    className="w-full h-[600px] rounded-xl border border-white/20"
                    srcDoc={code}
                  />
                )}
              </>
            )}

            {!loading && !code && (
              <div className="text-sm text-slate-400">暂无代码。</div>
            )}
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-xs text-slate-400">© {new Date().getFullYear()} Mini AI App Builder</footer>
    </div>
  );
}