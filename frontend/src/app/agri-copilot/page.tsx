'use client';

import React, { useState, useEffect, useRef } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Link from 'next/link';
import clsx from 'clsx';
import {
  FaLandmark,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
  FaMicrophone,
  FaHistory,
  FaRobot,
  FaInfoCircle,
} from 'react-icons/fa';
import {
  WeatherDashboardWidget,
  AlertsDashboardWidget,
} from '@/components/agri-copilot/DashboardWidgets';
import { CopilotSystemStatus } from '@/components/agri-copilot/CopilotSystemStatus';
import { ResultModal } from '@/components/agri-copilot/ResultModal';

export default function AgriCopilotDashboard() {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    transcript,
    listening: isListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const [stage, setStage] = useState('MONITORING_GOVERNMENT_SCHEMES');
  const [latestResponse, setLatestResponse] = useState<string | null>(null);
  const [latestSummary, setLatestSummary] = useState<string | null>(null);
  const [latestLinks, setLatestLinks] = useState<any[]>([]);
  const [triggeredTools, setTriggeredTools] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  const STATES = [
    'MONITORING_GOVERNMENT_SCHEMES',
    'DETECTING_DISASTER_ALERTS',
    'ANALYZING_SUBSIDY_MARKET',
    'SAHAYAK_READY_FOR_ACTION'
  ];

  // No longer using mock cycling, syncing with real tool triggers
  useEffect(() => {
    // Stage logic will be driven by triggeredTools and isProcessing
    if (!isProcessing && !latestResponse) {
      setStage('SAHAYAK_READY_FOR_ACTION');
    }
  }, [isProcessing, latestResponse]);

  // Fetch alerts for sync awareness
  useEffect(() => {
    async function syncAlerts() {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const res = await fetch(`${API_BASE}/api/agri-copilot/disaster/monitor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: pos.coords.latitude, lon: pos.coords.longitude })
          });
          const data = await res.json();
          if (data.status === 'success') setActiveAlerts(data.alerts || []);
        } catch (e) {}
      });
    }
    syncAlerts();
  }, []);

  // Sync transcript with input text
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser doesn't support speech recognition. Try Google Chrome.");
      return;
    }

    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleAction = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    setLatestResponse(null);

    // Get location context
    let locationContext = null;
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        locationContext = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
      }
    } catch (err) {
      console.warn("Location context unavailable for chat:", err);
    }

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE}/api/agri-copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: "user", content: inputText }],
          activeContext: "Dashboard",
          locationContext: locationContext
        })
      });

      const data = await response.json();
      if (data.status === "success") {
        setLatestResponse(data.response);
        setLatestSummary(data.summary);
        setLatestLinks(data.links || []);
        setTriggeredTools(data.triggered_tools || []);
      } else {
        setLatestResponse("I encountered an error while orchestrating your request. Please try again.");
        setLatestSummary("Sahayak Orchestration Failed.");
        setLatestLinks([]);
        setTriggeredTools([]);
      }
    } catch (err) {
      setLatestResponse("Connectivity issue: I couldn't reach the Sahayak engine.");
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (text: string) => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 3000);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes progress {
          0% { transform: scaleX(0.1); }
          50% { transform: scaleX(0.6); }
          100% { transform: scaleX(0.1); }
        }
        .animate-progress {
          animation: progress 4s ease-in-out infinite;
          transform-origin: left;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>

      <div className="p-4 max-w-full mx-auto h-[calc(100vh-80px)] flex flex-col gap-4 overflow-hidden bg-slate-50/30">
        {/* 1. Header / Breadcrumbs */}
        <div className="flex items-center justify-between w-full shrink-0 px-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-xs transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            BACK TO HUB
          </Link>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Autonomous Agent: <span className="text-emerald-500">Agri-Copilot (Sahayak)</span>
            </p>
          </div>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {/* 2. Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-4 flex-grow min-h-0">

          {/* Column 1: Left Control Panel (30%) */}
          <div className="xl:col-span-3 h-full min-h-0 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <span className="text-lg">🛠️</span> Command Center
              </h3>

              {/* Weather Widget */}
              <div className="shrink-0 scale-95 origin-top">
                <WeatherDashboardWidget />
              </div>

              {/* Quick Agent Actions */}
              { /* <div className="space-y-3 mb-6">
                  <Link href="/schemes" className="flex items-center gap-4 p-4 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl border border-emerald-100/50 transition-all group">
                      <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                          <FaLandmark />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 text-sm">Schemes & Orders</h4>
                          <p className="text-[10px] text-slate-500 font-medium">Fetch latest government updates</p>
                      </div>
                      <FaArrowRight className="ml-auto text-emerald-300 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link href="/disaster-relief" className="flex items-center gap-4 p-4 bg-red-50/50 hover:bg-red-50 rounded-2xl border border-red-100/50 transition-all group">
                      <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                          <FaExclamationTriangle />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 text-sm">Disaster Relief</h4>
                          <p className="text-[10px] text-slate-500 font-medium">Report crop damage autonomously</p>
                      </div>
                      <FaArrowRight className="ml-auto text-red-300 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link href="/subsidies" className="flex items-center gap-4 p-4 bg-blue-50/50 hover:bg-blue-50 rounded-2xl border border-blue-100/50 transition-all group">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                          <FaMoneyBillWave />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 text-sm">Subsidy Market</h4>
                          <p className="text-[10px] text-slate-500 font-medium">Apply with biometric records</p>
                      </div>
                      <FaArrowRight className="ml-auto text-blue-300 group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div> */}

              <div className="flex-grow flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                {/* Assistant Inputarea */}
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 pr-14 text-sm text-slate-700 placeholder:text-slate-400 resize-none outline-none focus:ring-2 focus:ring-emerald-200 transition-all h-40"
                    placeholder="Ask Sahayak about schemes, disaster forms, or subsidy eligibility..."
                  ></textarea>
                  <button
                    onClick={toggleListening}
                    className={clsx(
                      "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                      isListening
                        ? "bg-red-500 text-white animate-pulse shadow-red-200 shadow-lg"
                        : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 hover:shadow-md"
                    )}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                  >
                    <FaMicrophone className={clsx(isListening && "scale-110")} />
                  </button>
                </div>
              </div>

              {/* Launch Action Button */}
              <div className="mt-auto pt-4 shrink-0">
                <button
                  onClick={handleAction}
                  disabled={isProcessing || !inputText}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-[0_6px_0_0_#334155] hover:shadow-[0_3px_0_0_#334155] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
                >
                  {isProcessing ? "ORCHESTRATING..." : "SAHAYAK ASSIST"}
                  {isProcessing ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                  ) : (
                    <FaRobot />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Intelligence Nexus (50%) */}
          <div className="xl:col-span-5 h-full min-h-0 flex flex-col gap-4">
            <div className="bg-white p-2 rounded-[3.5rem] border border-slate-200 h-full relative overflow-hidden shadow-sm">

              {/* Intelligence Overlay (Top) */}
              <div className="absolute top-10 left-10 z-20 text-left space-y-2 max-w-[280px] pointer-events-none">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <span className={clsx("w-2 h-2 rounded-full", isProcessing ? "bg-emerald-500 animate-pulse" : "bg-slate-300")}></span>
                  Copilot Engine
                </h3>

                <div className="flex items-start gap-3 pointer-events-auto">
                  <div className="bg-white/60 backdrop-blur-xl p-4 rounded-3xl border border-white/50 shadow-sm overflow-hidden flex-grow group">
                    <div className="text-[11px] text-slate-800 font-bold leading-relaxed overflow-y-auto max-h-[100px] custom-scrollbar">
                      {isProcessing ? (
                        <span className="animate-pulse text-emerald-600 font-black">Sahayak is deep-searching government portals and cross-referencing your records...</span>
                      ) : latestSummary ? (
                        <span className="text-slate-800">{latestSummary}</span>
                      ) : (
                        <span className="text-slate-500 font-medium italic">Awaiting input to commence Sahayak orchestration...</span>
                      )}
                    </div>
                    {isProcessing && (
                      <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-progress origin-left"></div>
                      </div>
                    )}
                  </div>
                  {latestResponse && !isProcessing && (
                    <button
                      onClick={() => playAudio(latestResponse)}
                      className={clsx(
                        "mt-2 shrink-0 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-100 transition-all",
                        isPlayingAudio ? "text-emerald-500 scale-110 shadow-emerald-100 animate-pulse" : "text-slate-400 hover:text-emerald-600 hover:scale-105 active:scale-95"
                      )}
                      title="Play Audio"
                    >
                      <FaRobot className="text-lg" />
                    </button>
                  )}
                </div>
              </div>

              {/* Detailed Result Button (Top Right) */}
              {(latestResponse || activeAlerts.length > 0) && !isProcessing && (
                <div className="absolute top-10 right-10 z-20">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-800 transition-all border border-emerald-100 shadow-xl shadow-emerald-500/5 hover:scale-105 active:scale-95"
                  >
                    <FaInfoCircle className="text-sm" />
                    View Detailed Report
                  </button>
                </div>
              )}

              {/* Central Animation */}
              <div className="w-full h-full">
                <CopilotSystemStatus
                  isProcessing={isProcessing}
                  currentStage={stage}
                  triggeredTools={triggeredTools}
                />
              </div>

              {/* Bottom Status Feed (Floating) */}
              <div className="absolute bottom-10 left-10 right-10 z-20 flex justify-between items-end pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white flex items-center gap-4 shadow-2xl scale-90 origin-left">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <div className="text-[10px] font-black uppercase tracking-widest">
                    System Integrity: <span className="text-emerald-400">Verifying</span>
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="text-[10px] font-bold text-slate-400">
                    Lat: 11.6643 | Lon: 78.1460
                  </div>
                </div>
              </div>

              {/* Result Modal */}
              <ResultModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                content={latestResponse || (activeAlerts.length > 0 ? "URGENT DISASTER ALERTS DETECTED:\n\n" + activeAlerts.map(a => `${a.disasterType || a.alertType || 'Alert'} [${a.severity}]: ${a.summary}`).join('\n\n') : null)}
                links={latestLinks.length > 0 ? latestLinks : (activeAlerts.length > 0 ? [{title: activeAlerts[0].disasterType, type: 'disaster'}] : [])}
              />
            </div>
          </div>

          {/* Column 3: Field Intelligence (20%) */}
          <div className="xl:col-span-2 h-full min-h-0 flex flex-col gap-4">

            {/* History Log Placeholder */}
            <div className="bg-white p-5 rounded-[2rem] border border-slate-200 flex flex-col h-40 shrink-0">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <FaHistory /> Processing Journal
              </h3>
              <div className="flex-grow flex items-center justify-center text-center">
                <p className="text-[10px] text-slate-300 italic font-medium">No recent submissions detected.</p>
              </div>
            </div>

            {/* Alerts Widget */}
            <div className="flex-grow min-h-0 scale-95 origin-top">
              <AlertsDashboardWidget />
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
