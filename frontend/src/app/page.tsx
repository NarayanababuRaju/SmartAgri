'use client';

import React, { useState } from "react";
import Link from "next/link";
import { LiveAPIProvider } from "@/contexts/LiveAPIContext";
import clsx from "clsx";
import { FaMicrophone, FaLeaf, FaRobot, FaArrowRight, FaLandmark, FaMoneyBillWave, FaExclamationTriangle } from "react-icons/fa";

import { AgriAdvisorIntro } from "@/components/AgriAdvisorIntro";
import { AgriCopilotIntro } from "@/components/AgriCopilotIntro";
import { NexusAnimation } from "@/components/NexusAnimation";
import CultivationStageWidget from "@/components/CultivationStageWidget";

// Agri Co-pilot Components
import {
  WeatherDashboardWidget,
  AlertsDashboardWidget,
  QuickActionWidget
} from '@/components/agri-copilot/DashboardWidgets';

export default function Home() {
  const [activeAgent, setActiveAgent] = useState<'live-advisor' | 'virtual-soil' | 'agri-copilot'>('live-advisor');
  const [dummyStage, setDummyStage] = useState("Field Prep & Sowing");
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

  return (
    <LiveAPIProvider options={{ apiKey: API_KEY, apiVersion: "v1alpha", httpOptions: { apiVersion: "v1alpha" } }}>
      <div className="h-[calc(100vh-73px)] bg-slate-50 overflow-hidden flex flex-col">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col min-h-0">

          {/* Hero Section - Compact */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Welcome to <span className="text-emerald-600">SmartAgri</span>
            </h1>
            <p className="text-lg text-slate-600">
              Intelligent Agents with AI-First Voice, Predictive Physics, and Multi-modal Analysis.
            </p>
          </div>

          {/* Main Layout Grid - Fixed Height */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1 min-h-0">

            {/* Left Sidebar: Agents (4 columns) - Scrollable */}
            <div className="lg:col-span-4 h-full flex flex-col min-h-0">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 flex-shrink-0">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                SmartAgri Agents
              </h3>

              <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar pb-8">

                {/* Agent 1: Live Agri-Advisor (Active) */}
                <div
                  onClick={() => setActiveAgent('live-advisor')}
                  onMouseEnter={() => setActiveAgent('live-advisor')}
                  className={clsx(
                    "w-full text-left group relative bg-white rounded-3xl p-6 transition-all duration-300 overflow-hidden outline-none block cursor-pointer",
                    activeAgent === 'live-advisor'
                      ? "ring-2 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] scale-[1.02] z-10"
                      : "border border-slate-200 hover:border-red-200 shadow-sm"
                  )}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-[80px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform flex-shrink-0 shadow-sm",
                      activeAgent === 'live-advisor' ? "bg-red-600 text-white scale-110" : "bg-red-100 text-red-600 group-hover:scale-110"
                    )}>
                      <FaMicrophone />
                    </div>
                    <h2 className={clsx("text-lg font-bold line-clamp-1", activeAgent === 'live-advisor' ? "text-slate-900" : "text-slate-700")}>
                      Live Agri-Advisor
                    </h2>
                  </div>
                  <p className="text-slate-600 mb-2 text-sm leading-relaxed">
                    A Voice-First bidirectional assistant. Speak naturally in local languages.
                  </p>
                </div>

                {/* Agent 2: Virtual-Soil-Nutrition */}
                <button
                  onClick={() => setActiveAgent('virtual-soil')}
                  className={clsx(
                    "w-full text-left group relative bg-white rounded-3xl p-6 transition-all duration-300 overflow-hidden outline-none",
                    activeAgent === 'virtual-soil'
                      ? "ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02] z-10"
                      : "border border-slate-200 hover:border-emerald-200 shadow-sm"
                  )}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[80px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform flex-shrink-0 shadow-sm",
                      activeAgent === 'virtual-soil' ? "bg-emerald-600 text-white scale-110" : "bg-emerald-50 text-emerald-600 group-hover:scale-110"
                    )}>
                      <FaLeaf />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className={clsx("text-lg font-bold line-clamp-1", activeAgent === 'virtual-soil' ? "text-slate-900" : "text-slate-700")}>
                          Virtual Soil Nutrition
                        </h2>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded-full whitespace-nowrap">Soon</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Upload photos of your soil for instant ML-driven nutrient deficiency detection and recommendations.
                  </p>
                </button>

                {/* Agent 3: Agri-CoPilot */}
                <div
                  onClick={() => setActiveAgent('agri-copilot')}
                  onMouseEnter={() => setActiveAgent('agri-copilot')}
                  className={clsx(
                    "w-full text-left group relative bg-white rounded-3xl p-6 transition-all duration-300 overflow-hidden outline-none block cursor-pointer",
                    activeAgent === 'agri-copilot'
                      ? "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] scale-[1.02] z-10"
                      : "border border-slate-200 hover:border-blue-200 shadow-sm"
                  )}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[80px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform flex-shrink-0 shadow-sm",
                      activeAgent === 'agri-copilot' ? "bg-blue-600 text-white scale-110" : "bg-blue-100 text-blue-600 group-hover:scale-110"
                    )}>
                      <FaRobot />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className={clsx("text-lg font-bold line-clamp-1", activeAgent === 'agri-copilot' ? "text-slate-900" : "text-slate-700")}>
                          Agri-CoPilot
                        </h2>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    Autonomous agent managing Government Schemes/Subsidies and Disaster-Relief application submission.
                  </p>
                </div>

              </div>
            </div>

            {/* Right Section: Dynamic Animation Overlay */}
            <div className="lg:col-span-8 h-full flex flex-col min-h-0 bg-white/30 rounded-[40px] border border-slate-100 shadow-inner overflow-hidden relative">
              <h3 className="text-xl font-bold text-slate-800 p-8 flex items-center gap-2 flex-shrink-0 uppercase tracking-widest text-xs opacity-50">
                <span className={clsx(
                  "w-2 h-8 rounded-full",
                  activeAgent === 'live-advisor' ? "bg-red-500" : activeAgent === 'virtual-soil' ? "bg-emerald-500" : "bg-blue-500"
                )}></span>
                {activeAgent === 'live-advisor' ? "System Architecture" : activeAgent === 'virtual-soil' ? "Crop Intelligence" : "System Architecture"}
              </h3>

              <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
                <div key={activeAgent} className="w-full h-full max-w-5xl">
                  {activeAgent === 'live-advisor' && (
                    <div className="animate-in fade-in zoom-in-95 duration-500 h-full w-full">
                      <AgriAdvisorIntro />
                    </div>
                  )}
                  {activeAgent === 'virtual-soil' && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 h-full w-full flex flex-col items-center justify-center text-center p-12">
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner">🌱</div>
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">Virtual Soil Nutrition</h4>
                      <p className="text-slate-500 max-w-sm mb-8">
                        Advanced ML models for deficiency detection and localized recommendations are currently being trained.
                      </p>
                      <div className="px-6 py-2 bg-emerald-500 text-white font-black uppercase text-xs tracking-widest rounded-full shadow-lg shadow-emerald-200">
                        Coming Soon
                      </div>
                    </div>
                  )}
                  {activeAgent === 'agri-copilot' && (
                    <div className="animate-in fade-in zoom-in-95 duration-500 h-full w-full">
                      <AgriCopilotIntro themeColor="bg-blue-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </LiveAPIProvider>
  );
}
