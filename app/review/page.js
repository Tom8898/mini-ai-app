"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ReviewAndEditPage() {
  const router = useRouter();
  const [spec, setSpec] = useState({ appName: "", entities: [], roles: [], features: [], sourceText: "" });
  const [loaded, setLoaded] = useState(false);
  const [saveCodeLoaded, setSaveCodeLoaded] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // code from generate page
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // init
  useEffect(() => {
    try {
      const raw = localStorage.getItem("extractedSpec");
      if (!raw) {
        router.replace("/home");
        return;
      }
      const parsed = JSON.parse(raw);
      setSpec({
        appName: parsed.appName || "My App",
        entities: Array.isArray(parsed.entities) ? parsed.entities : [],
        roles: Array.isArray(parsed.roles) ? parsed.roles : [],
        features: Array.isArray(parsed.features) ? parsed.features : [],
        sourceText: parsed.sourceText || "",
      });
      setLoaded(true);
    } catch (e) {
      router.replace("/home");
    }
  }, [router]);

  // page operation section begin
  const updateList = (key, idx, value) => {
    setSpec((s) => {
      const arr = [...s[key]];
      arr[idx] = value;
      return { ...s, [key]: arr };
    });
  };

  const addItem = (key) => setSpec((s) => ({ ...s, [key]: [...s[key], ""] }));
  const removeItem = (key, idx) => setSpec((s) => ({ ...s, [key]: s[key].filter((_, i) => i !== idx) }));

  const goBack = () => router.push("/home");

  // reset spec to extracted
  const resetToExtracted = () => {
    const raw = localStorage.getItem("extractedSpec");

    const parsed = JSON.parse(raw);
    setSpec({
      appName: parsed.appName || "My App",
      entities: Array.isArray(parsed.entities) ? parsed.entities : [],
      roles: Array.isArray(parsed.roles) ? parsed.roles : [],
      features: Array.isArray(parsed.features) ? parsed.features : [],
      sourceText: parsed.sourceText || "",
    });
  };
  // page operation section end

  // submit spec to generate code
  const submit = () => {
    // 这里先简单展示，下一步将用于生成 UI
    const normalized = {
      appName: spec.appName?.trim() || "My App",
      entities: spec.entities.map((x) => x.trim()).filter(Boolean),
      roles: spec.roles.map((x) => x.trim()).filter(Boolean),
      features: spec.features.map((x) => x.trim()).filter(Boolean),
    };

    // send request to generate code
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/generateCode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalized),
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

    // localStorage.setItem("confirmedSpec", JSON.stringify(normalized));
    // alert(JSON.stringify(normalized, null, 2));
    // 
    //router.push("/generate");
  };

  // preview
  const openPreview = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // clip board
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // 可以添加一个简单的提示，比如改变按钮文字
      alert("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Code copied to clipboard!");
    }
  };

  // save generated code
  const saveCode = async () => {
    try {
      setSaveCodeLoaded(true);

      const postJson = {
        app_name: spec.appName?.trim() || "My App",
        entities: (spec.entities ?? []).map(x => x.trim()).filter(Boolean),
        roles: (spec.roles ?? []).map(x => x.trim()).filter(Boolean),
        features: (spec.features ?? []).map(x => x.trim()).filter(Boolean),
        code: code
      }

      // alert(JSON.stringify(postJson));

      const res = await fetch("/api/codemanagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postJson)
      });

      // handle return 
      const resBody = await res.json();
      if (res.status !== 200) {
        throw new Error(resBody?.message || JSON.stringify(resBody));
      }
      setSaveSuccess(true);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : err;
      alert(message);
    } finally {
      setSaveCodeLoaded(false);
    }
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg
            className="animate-spin h-6 w-6 text-white"
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
          <span className="text-lg">loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20 flex items-center justify-center font-semibold">AI</div>
          <h1 className="text-xl font-semibold tracking-tight">Mini AI App Builder</h1>
          <div className="ml-auto">
            <Link href="/home" className="text-sm px-3 py-1 rounded-lg ring-1 ring-white/10 hover:bg-white/10">Home</Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 flex-1 max-w-6xl w-full">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-3xl blur opacity-30" />
          <div className="relative rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8">
            <h2 className="text-2xl font-bold">Step 2 · Review and Revise</h2>
            {spec.sourceText && (
              <p className="mt-2 text-sm text-slate-300">sourc：{spec.sourceText}</p>
            )}

            {/* App Name */}
            <div className="mt-6">
              <label className="text-sm text-slate-300">App Name</label>
              <input
                className="mt-2 w-full rounded-xl bg-white/10 ring-1 ring-white/10 focus:ring-2 focus:ring-sky-400 px-4 py-3 outline-none placeholder:text-slate-400"
                placeholder="My App"
                value={spec.appName}
                onChange={(e) => setSpec({ ...spec, appName: e.target.value })}
              />
            </div>

            {/* Entities / Roles / Features 编辑区 */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {(["entities", "roles", "features"]).map((key) => (
                <div key={key} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold capitalize">{key}</h3>
                    <button onClick={() => addItem(key)} className="text-xs px-2 py-1 rounded-lg ring-1 ring-white/10 hover:bg-white/10">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {(spec[key] || []).map((val, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          className="flex-1 rounded-lg bg-white/10 ring-1 ring-white/10 focus:ring-2 focus:ring-sky-400 px-3 py-2 outline-none"
                          value={val}
                          onChange={(e) => updateList(key, idx, e.target.value)}
                          placeholder={key === "features" ? "e.g. Add course" : "e.g. Student"}
                        />
                        <button
                          onClick={() => removeItem(key, idx)}
                          className="flex-shrink-0 px-3 py-2 rounded-lg ring-1 ring-white/10 hover:bg-white/10 text-sm text-red-300 hover:text-red-200"
                          aria-label="remove"
                        >
                          delete
                        </button>
                      </div>
                    ))}
                    {(!spec[key] || spec[key].length === 0) && (
                      <p className="text-xs text-slate-400">No items yet. Click + Add in the top right to add one.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col md:flex-row gap-3">
              <button onClick={goBack} className="md:w-40 w-full rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 transition">
                Back
              </button>
              <button onClick={resetToExtracted} className="md:w-52 w-full rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 transition">
                Reset
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="md:flex-1 w-full rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <LoadingSpinner size="sm" color="white" />}
                {loading ? "Generating..." : "Submit"}
              </button>
            </div>
          </div>


          <div className="relative mt-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-3xl blur opacity-30" />
            <div className="relative rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-8 space-y-6">

              {loading && (
                <div className="text-sm text-slate-300">Generating code based on the confirmed requirements…</div>
              )}

              {!loading && code && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Code generation completed</h3>
                      <button
                        onClick={openPreview}
                        className="rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 transition"
                      >
                        Preview
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 transition"
                      >
                        Copy
                      </button>
                      <button
                        onClick={saveCode}
                        disabled={saveCodeLoaded || saveSuccess}
                        className="rounded-xl px-4 py-3 font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {saveCodeLoaded && <LoadingSpinner size="sm" color="white" />}
                        {saveCodeLoaded ? "Saving..." : saveSuccess ? "Save Success" : "Save"}
                      </button>


                    </div>
                    <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto text-sm whitespace-pre-wrap">
                      <code>{code}</code>
                    </pre>
                  </div>

                </>
              )}

              {!loading && !code && (
                <div className="text-sm text-slate-400">No code available for now</div>
              )}
            </div>
          </div>


        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-xs text-slate-400">© {new Date().getFullYear()} Mini AI App Builder</footer>
    </div>
  );
}