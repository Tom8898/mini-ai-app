"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HistoryPage() {
    const [username, setUsername] = useState("");
    const [appname, setAppname] = useState("");
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerCode, setViewerCode] = useState("");

    const openViewer = (code) => {
        const full = typeof code === "string" ? code : JSON.stringify(code ?? "", null, 2);
        setViewerCode(full);
        setViewerOpen(true);
    };

    const copyCode = async (code) => {
        const full = typeof code === "string" ? code : JSON.stringify(code ?? "");
        try {
            await navigator.clipboard.writeText(full);
            // simple feedback
            alert("Code copied to clipboard");
        } catch (e) {
            console.error(e);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const qs = new URLSearchParams();
            if (username.trim()) qs.set("username", username.trim());
            if (appname.trim()) qs.set("appname", appname.trim());
            const res = await fetch(`/api/codemanagement?${qs.toString()}`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex flex-col">
            <header className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/20 flex items-center justify-center font-semibold">AI</div>
                    <h1 className="text-xl font-semibold tracking-tight">History</h1>
                    <div className="ml-auto">
                        <Link href="/home" className="text-sm px-3 py-1 rounded-lg ring-1 ring-white/10 hover:bg-white/10">Back</Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 flex-1 w-full">
                <div className="relative rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-6">
                    {/* Search Area */}
                    <div className="grid sm:grid-cols-3 gap-3">
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="rounded-xl bg-white/10 ring-1 ring-white/10 px-3 py-2 outline-none"
                        />
                        <input
                            value={appname}
                            onChange={(e) => setAppname(e.target.value)}
                            placeholder="App Name"
                            className="rounded-xl bg-white/10 ring-1 ring-white/10 px-3 py-2 outline-none"
                        />
                        <div className="flex gap-2">
                            <button onClick={fetchData} className="rounded-xl px-4 py-2 font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15">Search</button>
                            <button onClick={() => { setUsername(""); setAppname(""); setItems([]); fetchData(); }} className="rounded-xl px-4 py-2 font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15">Reset</button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-slate-300">
                                <tr>
                                    <th className="py-2 pr-4">Username</th>
                                    <th className="py-2 pr-4">App Name</th>
                                    <th className="py-2 pr-4">Roles</th>
                                    <th className="py-2 pr-4">Entities</th>
                                    <th className="py-2 pr-4">Features</th>
                                    <th className="py-2 pr-4">Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td className="py-3" colSpan={6}>Loading…</td></tr>
                                ) : items.length === 0 ? (
                                    <tr><td className="py-3" colSpan={6}>No data</td></tr>
                                ) : (
                                    items.map((it, idx) => (
                                        <tr key={idx} className="align-top border-t border-white/10">
                                            <td className="py-2 pr-4">{it.user_name || it.userId || "-"}</td>
                                            <td className="py-2 pr-4">{it.app_name || "-"}</td>
                                            <td className="py-2 pr-4 whitespace-pre-wrap">{Array.isArray(it.roles) ? it.roles.join(", ") : String(it.roles ?? "-")}</td>
                                            <td className="py-2 pr-4 whitespace-pre-wrap">{Array.isArray(it.entities) ? it.entities.join(", ") : String(it.entities ?? "-")}</td>
                                            <td className="py-2 pr-4 whitespace-pre-wrap">{Array.isArray(it.features) ? it.features.join(", ") : String(it.features ?? "-")}</td>
                                            <td className="py-2 pr-4 max-w-[360px] whitespace-pre-wrap break-words">
                                                <div className="space-y-2">
                                                    <div>
                                                        {typeof it.code === "string"
                                                            ? it.code.slice(0, 360)
                                                            : String(it.code == null ? "" : JSON.stringify(it.code)).slice(0, 360)}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openViewer(it.code)}
                                                            className="text-xs px-2 py-1 rounded-lg ring-1 ring-white/10 hover:bg-white/10"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => copyCode(it.code)}
                                                            className="text-xs px-2 py-1 rounded-lg ring-1 ring-white/10 hover:bg-white/10"
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {viewerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setViewerOpen(false)} />
                    <div className="relative z-10 w-[90vw] max-w-5xl h-[80vh] rounded-2xl bg-slate-900 ring-1 ring-white/10 p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">Code</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyCode(viewerCode)}
                                    className="text-xs px-2 py-1 rounded-lg ring-1 ring-white/10 hover:bg-white/10"
                                >
                                    Copy
                                </button>
                                <button
                                    onClick={() => setViewerOpen(false)}
                                    className="text-xs px-2 py-1 rounded-lg ring-1 ring-white/10 hover:bg-white/10"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        <pre className="flex-1 overflow-auto bg-black/50 rounded-xl p-4 text-sm whitespace-pre-wrap break-words">
                            {viewerCode}
                        </pre>
                    </div>
                </div>
            )}

            <footer className="container mx-auto px-4 py-6 text-xs text-slate-400">© {new Date().getFullYear()} Mini AI App Builder</footer>
        </div>
    );
}


