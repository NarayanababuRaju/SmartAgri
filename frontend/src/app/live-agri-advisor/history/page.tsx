"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaHistory, FaBrain, FaCalendarAlt, FaLeaf, FaQuoteLeft } from "react-icons/fa";
import clsx from "clsx";

function formatTimestamp(timestamp: string) {
    if (!timestamp) return 'N/A';
    try {
        const now = new Date();
        const date = new Date(timestamp);

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sessionDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHour = Math.floor(diffMs / 3600000);

        if (today.getTime() === sessionDay.getTime()) {
            if (diffMin < 60) {
                return `Today ${Math.max(1, diffMin)}min ago`;
            } else {
                return `Today ${diffHour}hour${diffHour > 1 ? 's' : ''} ago`;
            }
        }

        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (yesterday.getTime() === sessionDay.getTime()) {
            return "Yesterday";
        }

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
}

export default function AdviceHistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullScreenImage, setIsFullScreenImage] = useState(false);

    useEffect(() => {
        // 1. Initial hydration from local cache (Offline First)
        const cachedHistory = localStorage.getItem("agri_advisor_history");
        if (cachedHistory) {
            try {
                const parsed = JSON.parse(cachedHistory);
                setHistory(parsed);
                if (parsed.length > 0) setSelectedSession(parsed[0]);
                setIsLoading(false); // Can stop loading immediately if we have cache
            } catch (e) {
                console.error("Cache parsing error:", e);
            }
        }

        // 2. Background Sync with Server
        async function fetchHistory() {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const res = await fetch(`${API_BASE}/api/advice-history`);
                const data = await res.json();
                if (data.status === "success") {
                    setHistory(data.history);
                    if (data.history.length > 0 && !selectedSession) {
                        setSelectedSession(data.history[0]);
                    }
                    // Persist for next session
                    localStorage.setItem("agri_advisor_history", JSON.stringify(data.history));
                }
            } catch (e) {
                console.error("Error fetching history:", e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchHistory();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 h-20 shadow-sm relative z-20">
                <div className="flex items-center gap-4">
                    <Link
                        href="/live-agri-advisor"
                        className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500 hover:text-emerald-600 border border-slate-100"
                    >
                        <FaArrowLeft className="text-sm" />
                    </Link>
                    <div>
                        <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <FaHistory className="text-emerald-500" /> Advice History
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Knowledge Archive</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Archive Active</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden">
                {/* Sidebar: Session History List */}
                <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <FaCalendarAlt /> Session Log
                        </h3>
                    </div>
                    <div className="flex-grow overflow-y-auto custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 italic text-[11px] font-bold leading-relaxed">
                                <FaLeaf className="mx-auto mb-3 opacity-20 text-3xl" />
                                Your milestone archive is empty.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {history.map((session) => (
                                    <button
                                        key={session.id}
                                        onClick={() => setSelectedSession(session)}
                                        className={clsx(
                                            "w-full text-left p-6 transition-all border-l-4",
                                            selectedSession?.id === session.id
                                                ? "bg-emerald-50 border-emerald-500"
                                                : "hover:bg-slate-50 border-transparent"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {formatTimestamp(session.timestamp)}
                                            </span>
                                            <span className="bg-white/80 border border-slate-200 text-[9px] font-black px-2 py-0.5 rounded-full text-slate-600 uppercase">
                                                {session.crop}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-800 mb-1 line-clamp-1">
                                            {session.current_stage && session.sub_stage
                                                ? `${session.current_stage} - ${session.sub_stage}`
                                                : session.advice?.summary || "General Consultation"}
                                        </h4>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Detail Area */}
                <main className="flex-grow flex flex-col overflow-hidden bg-slate-50">
                    {selectedSession ? (
                        <div className="flex-grow flex flex-col h-full overflow-hidden">

                            {/* Fixed Content Stage (Zero-Scroll Chat Architecture) */}
                            <div className="flex-grow overflow-hidden flex flex-col items-center p-2 sm:p-6 lg:p-8">
                                {/* Conversation Stage (STRICTLY Zero-scroll) */}
                                <div className="w-full max-w-5xl flex flex-col h-full space-y-4 lg:space-y-6 overflow-hidden px-2 sm:px-6 pb-12 lg:pb-0">

                                    {/* 1. Farmer Bubble (Compact context) */}
                                    <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-500 shrink-0">
                                        <div className="max-w-[80%] bg-emerald-600 text-white rounded-[1.5rem] rounded-tr-none p-4 sm:p-5 shadow-lg shadow-emerald-900/5 relative group">
                                            <div className="absolute -top-3 -right-1 text-xl">👨‍🌾</div>
                                            <p className="text-[13px] sm:text-sm font-medium leading-relaxed italic">
                                                "{selectedSession.input}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* 2. Gemini Response Card (High-Density Intelligence) */}
                                    <div className="flex-grow flex flex-col items-start animate-in fade-in slide-in-from-left-4 duration-700 delay-200 overflow-hidden">
                                        <div className="w-full h-full bg-white border border-slate-200 rounded-[2rem] rounded-tl-none p-6 sm:p-8 lg:p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden flex flex-col">
                                            {/* Gemini Branding Header */}
                                            <div className="flex items-center gap-3 mb-4 lg:mb-6 shrink-0">
                                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 animate-pulse">
                                                    <FaBrain className="text-white text-sm lg:text-lg" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[10px] lg:text-xs font-black text-slate-800 uppercase tracking-widest leading-none">Gemini Agri-Intelligence</h3>
                                                    <p className="text-[8px] lg:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Strategic Response</p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => setIsFullScreenImage(true)}
                                                        className="bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center gap-2"
                                                    >
                                                        Infographic  <span className="text-lg">🖼️</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Summary Section (High Density) */}
                                            <div className="mb-4 lg:mb-6 shrink-0">
                                                <div className="bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-100 italic">
                                                    <p className="text-slate-700 text-base lg:text-lg font-bold leading-relaxed line-clamp-2">
                                                        {selectedSession.advice?.summary || (typeof selectedSession.advice === 'string' ? selectedSession.advice : "Analysis complete.")}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Strategic Action Plan (2-Column Grid for Zero-Scroll) */}
                                            <div className="flex-grow overflow-y-auto lg:overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 pb-2">
                                                {selectedSession.advice?.action_plan && Object.entries(selectedSession.advice.action_plan).map(([key, value]: [string, any]) => (
                                                    <div key={key} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-emerald-200 transition-all group/item">
                                                        <div className="flex items-center justify-center shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white shadow-sm transition-transform group-hover/item:scale-110 text-xl lg:text-2xl">
                                                            {key.includes('Nutrient') ? '🌱' : key.includes('Pest') ? '🛡️' : key.includes('Water') ? '💧' : '📋'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 truncate">{key}</h4>
                                                            <p className="text-xs lg:text-[13px] text-slate-700 leading-snug font-bold line-clamp-3">
                                                                {value as string}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Full Screen Image Modal */}
                            {isFullScreenImage && selectedSession.assetUrl && (
                                <div
                                    className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-12 animate-in fade-in zoom-in duration-300"
                                    onClick={() => setIsFullScreenImage(false)}
                                >
                                    <button
                                        onClick={() => setIsFullScreenImage(false)}
                                        className="absolute top-10 right-10 w-14 h-14 bg-white hover:bg-slate-100 text-slate-900 rounded-full flex items-center justify-center text-2xl transition-all z-10 shadow-2xl"
                                    >
                                        ✕
                                    </button>
                                    <div
                                        className="relative w-full h-full max-w-7xl flex items-center justify-center"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img
                                            src={selectedSession.assetUrl}
                                            alt="Full Screen Infographic"
                                            className="max-w-full max-h-full object-contain rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/20"
                                        />
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-xl px-10 py-4 rounded-3xl text-white text-[10px] font-black tracking-widest uppercase border border-white/10 shadow-2xl">
                                            Visual Intelligence Dashboard
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <div className="text-center">
                                <FaHistory className="text-8xl mx-auto mb-6 opacity-20 animate-pulse" />
                                <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Select Intelligence Milestone</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
