"use client";
import React from "react";
import { FaBrain, FaInfoCircle, FaSeedling, FaHistory, FaChevronRight } from "react-icons/fa";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { CROP_MODELS } from "./CultivationStageWidget";
import clsx from "clsx";

export function AgriIntelligenceFeed() {
    const context = useLiveAPIContext();
    const { currentStage: contextStage, crop: contextCrop } = context as any;

    const cropModel = CROP_MODELS[contextCrop] || CROP_MODELS["Rice"];
    const activeStage = contextStage || cropModel.stages[0];
    const activeIndex = cropModel.stages.indexOf(activeStage);

    return (
        <div className="space-y-6">
            {/* Advice Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FaBrain className="text-8xl" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                            Gemini Intelligence
                        </span>
                        <span className="bg-emerald-400 text-emerald-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                            Live Feed
                        </span>
                    </div>
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Active Guidance: {activeStage}</h2>
                </div>
            </div>

            {/* Main Advice Content */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Section 1: Context */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <FaInfoCircle /> Historical Context & Contextual Awareness
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                                "Based on the previously locked activities and the progress in the {activeStage} phase, the soil moisture levels are stabilizing. External NeuralGCM projections suggest a favorable window for the next 72 hours."
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Active Guidance */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <FaSeedling /> Strategic Guidance for {activeStage}
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-900">Recommended Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="font-bold text-emerald-800 text-sm mb-1">Optimized Timing</div>
                                    <p className="text-emerald-600 text-[11px] leading-snug">Proceed with intensive monitoring of sub-stages to exploit the current climate window.</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div className="font-bold text-blue-800 text-sm mb-1">Risk Mitigation</div>
                                    <p className="text-blue-600 text-[11px] leading-snug">NeuralGCM indicates potential shifting wind patterns; ensure temporary shade structures are ready.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Insight */}
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2">
                        <FaHistory /> Last generated 2m ago
                    </span>
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:underline">
                        Refresh Insights
                    </button>
                </div>
            </div>
        </div>
    );
}
