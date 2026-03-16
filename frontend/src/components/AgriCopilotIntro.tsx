'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FaArrowRight,
    FaUserAlt,
    FaServer,
    FaBrain,
    FaSearch,
    FaGlobe,
    FaExclamationTriangle,
    FaRobot
} from 'react-icons/fa';
import clsx from 'clsx';

interface AgriCopilotIntroProps {
    href?: string;
    themeColor?: string;
}

export const AgriCopilotIntro: React.FC<AgriCopilotIntroProps> = ({
    href = "/agri-copilot",
    themeColor = "bg-blue-600"
}) => {
    const [stage, setStage] = useState('QUERY');

    const PHASES = [
        { id: 'QUERY', label: 'USER QUERY', color: '#10b981' },
        { id: 'ANALYSIS', label: 'INTENT ANALYSIS', color: '#3b82f6' },
        { id: 'TOOLS', label: 'TOOL ORCHESTRATION', color: '#8b5cf6' },
        { id: 'SYNTHESIS', label: 'RESULT SYNTHESIS', color: '#f59e0b' },
        { id: 'RESPONSE', label: 'RETURN RESPONSE', color: '#10b981' }
    ];

    useEffect(() => {
        let currentIdx = 1;
        const interval = setInterval(() => {
            setStage(PHASES[currentIdx].id);
            currentIdx = (currentIdx + 1) % PHASES.length;
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Dynamic sizes for nodes based on stage (Shrunk targets: 30-45px range)
    const geminiSize = (stage === 'ANALYSIS' || stage === 'SYNTHESIS') ? 45 : 30;
    const satelliteSize = (stage === 'ANALYSIS' || stage === 'SYNTHESIS') ? 40 : 25;

    return (
        <div 
            className="w-full h-full min-h-[400px] bg-white rounded-3xl relative flex items-center justify-center overflow-hidden mx-auto border border-slate-100 shadow-2xl"
            style={{ colorScheme: 'light' }}
        >
            {/* Title Overlay */}
            <div className="absolute top-6 left-8 z-10">
                <p className="text-slate-500 text-sm mt-1">
                    System State: <span className="font-semibold text-indigo-500">{PHASES.find(p => p.id === stage)?.label || stage}</span>
                </p>
            </div>

            <svg viewBox="0 0 1000 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="shadow-intro" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComponentTransfer in="blur" result="glow">
                            <feFuncA type="linear" slope="0.4" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <pattern id="grid-intro" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                    </pattern>
                </defs>

                <style>
                    {`
                        .dashed-path-intro {
                            stroke-dasharray: 10 10;
                            animation: dash-flow-intro 0.8s linear infinite;
                        }
                        @keyframes dash-flow-intro {
                            from { stroke-dashoffset: 20; }
                            to { stroke-dashoffset: 0; }
                        }

                        .voice-wave-intro {
                            animation: voice-pulse 1.5s ease-in-out infinite alternate;
                            transform-origin: center;
                            transform-box: fill-box;
                        }
                        .voice-bar {
                            animation: voice-bar-grow 0.4s ease-in-out infinite alternate;
                            transform-origin: center;
                            transform-box: fill-box;
                        }
                        .voice-bar-1 { animation-delay: 0s; height: 8px; }
                        .voice-bar-2 { animation-delay: 0.1s; height: 12px; }
                        .voice-bar-3 { animation-delay: 0.2s; height: 16px; }
                        .voice-bar-4 { animation-delay: 0.3s; height: 12px; }
                        .voice-bar-5 { animation-delay: 0.4s; height: 8px; }
                        @keyframes voice-pulse {
                            0% { transform: scale(0.95); opacity: 0.8; }
                            100% { transform: scale(1.05); opacity: 1; }
                        }
                        @keyframes voice-bar-grow {
                            0% { transform: scaleY(0.3); }
                            100% { transform: scaleY(1.2); }
                        }

                        .send-btn-group-intro {
                            animation: button-press-intro 2.5s infinite;
                        }
                        @keyframes button-press-intro {
                            0%, 10%, 100% { transform: translateY(0); }
                            5% { transform: translateY(3px); }
                        }

                        .sparkle-intro {
                            animation: twinkle-intro 2s ease-in-out infinite;
                        }
                        .sparkle-1-intro { transform-origin: 435px 125px; }
                        .sparkle-2-intro { transform-origin: 203px 223px; animation-delay: 1s; }
                        .sparkle-3-intro { transform-origin: 733px 323px; animation-delay: 1s; }
                        .sparkle-4-intro { transform-origin: 500px 420px; animation-delay: 1s; }
                        @keyframes twinkle-intro {
                            0%, 100% { transform: scale(0.5); opacity: 0.2; }
                            50% { transform: scale(1.5); opacity: 1; }
                        }

                        .led-blink-1-intro { animation: blink-intro 1.5s infinite; }
                        .led-blink-2-intro { animation: blink-intro 2s infinite 0.5s; }
                        .led-blink-3-intro { animation: blink-intro 1.2s infinite 1s; }
                        @keyframes blink-intro {
                            0%, 100% { fill: #4ade80; opacity: 0.4; }
                            50% { fill: #22c55e; opacity: 1; filter: drop-shadow(0 0 2px rgba(34,197,94,0.5)); }
                        }

                        .server-float-intro {
                            animation: float-intro 3s ease-in-out infinite;
                        }
                        @keyframes float-intro {
                            0%, 100% { transform: translate(0, -90px); }
                            50% { transform: translate(0, -95px); }
                        }
                        
                        .gemini-pulse-intro {
                            animation: g-pulse-intro 2s ease-in-out infinite;
                            transform-origin: center;
                        }
                        @keyframes g-pulse-intro {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.1); }
                        }

                        .satellite-drift-intro {
                            animation: s-drift-intro 4s ease-in-out infinite;
                        }
                        @keyframes s-drift-intro {
                            0%, 100% { transform: translate(0, 0) rotate(0deg); }
                            50% { transform: translate(-5px, 5px) rotate(2deg); }
                        }

                        .node-transition-intro {
                            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                    `}
                </style>

                {/* Background Grid */}
                <rect width="100%" height="100%" fill="url(#grid-intro)" />

                {/* Sparkles */}
                <g className="sparkles">
                    <path d="M 430 120 L 435 110 L 440 120 L 450 125 L 440 130 L 435 140 L 430 130 L 420 125 Z" fill="#fbbf24" className="sparkle-intro sparkle-1-intro" />
                    <path d="M 200 220 L 205 210 L 210 220 L 220 225 L 210 230 L 205 240 L 200 230 L 190 225 Z" fill="#7dd3fc" className="sparkle-intro sparkle-2-intro" />
                    <path d="M 730 320 L 735 310 L 740 320 L 750 325 L 740 330 L 735 340 L 730 330 L 720 325 Z" fill="#4ade80" className="sparkle-intro sparkle-3-intro" />
                    <path d="M 495 420 L 500 410 L 505 420 L 515 425 L 505 430 L 500 440 L 495 430 L 485 425 Z" fill="#f87171" className="sparkle-intro sparkle-4-intro" />
                </g>

                {/* Phone 1 (Upscaled for Visibility) */}
                <g transform="translate(140, 410)">
                    {/* Depth */}
                    <g transform="translate(0, 15)">
                        <g transform="scale(0.9, 0.45) rotate(45)">
                            <rect x="-70" y="-120" width="140" height="240" rx="20" fill="#bae6fd" />
                        </g>
                    </g>
                    {/* Surface */}
                    <g transform="scale(0.9, 0.45) rotate(45)">
                        <rect x="-70" y="-120" width="140" height="240" rx="20" fill="#e0f2fe" />
                        <rect x="-60" y="-110" width="120" height="220" rx="12" fill="#ffffff" />

                        {/* Screen Content */}
                        <text x="0" y="-40" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="#4ade80" textAnchor="middle">SmartAgri</text>

                        {/* Voice Button */}
                        <g className="send-btn-group-intro">
                            <rect x="-40" y="50" width="80" height="26" rx="13" fill="#38bdf8" />
                            <text x="-12" y="67" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">VOICE</text>

                            {/* Tiny Wave */}
                            <g className="voice-wave-intro" transform="translate(18, 67)">
                                <animate attributeName="opacity" values="1;1;0.2;0.2;1;1" keyTimes="0;0.25;0.27;0.73;0.75;1" dur="10s" repeatCount="indefinite" />
                                <circle cx="0" cy="0" r="18" fill="#38bdf8" opacity="0.2" />
                                <rect className="voice-bar voice-bar-1" x="-6" y="-3" width="2" rx="1" fill="#e44545ff" />
                                <rect className="voice-bar voice-bar-3" x="0" y="-7" width="2" rx="1" fill="#e44545ff" />
                                <rect className="voice-bar voice-bar-5" x="6" y="-3" width="2" rx="1" fill="#e44545ff" />
                            </g>
                        </g>
                    </g>
                </g>

                {/* Dashed Paths (Widened horizontal scale) */}
                <g opacity="0.4">
                    <path d="M 140 410 Q 250 150 500 250" fill="none" stroke="#14c735ff" strokeWidth="3" className="dashed-path-intro" />
                    <path d="M 500 250 Q 700 50 880 120" fill="none" stroke="#c4b5fd" strokeWidth="3" className="dashed-path-intro" />
                    <path d="M 500 250 Q 700 450 880 450" fill="none" stroke="#7dd3fc" strokeWidth="3" className="dashed-path-intro" />
                    <path d="M 500 250 Q 725 275 880 300" fill="none" stroke="#488fecff" strokeWidth="3" className="dashed-path-intro" />
                </g>

                {/* Server Node (Centered in 1000px viewBox) */}
                <g transform="translate(500, 250)">
                    {/* Shadow */}
                    <path d="M -14 7 L 56 42 L 14 63 L -56 28 Z" fill="#000000" filter="url(#shadow-intro)" opacity="0.2" />

                    {/* Blade 1 (Bottom) */}
                    <g transform="translate(0, 20)">
                        <path d="M -14 -28 L 56 7 L 14 28 L -56 -7 Z" fill="#dcfce7" />
                        <path d="M -56 -7 L 14 28 L 14 42 L -56 7 Z" fill="#bbf7d0" />
                        <path d="M 14 28 L 56 7 L 56 21 L 14 42 Z" fill="#86efac" />
                        <circle cx="-35" cy="10" r="1.5" fill="#22c55e" className="led-blink-1-intro" />
                        <circle cx="-21" cy="17" r="1.5" fill="#22c55e" className="led-blink-2-intro" />
                    </g>

                    {/* Blade 2 (Middle) */}
                    <g transform="translate(0, 0)">
                        <path d="M -14 -28 L 56 7 L 14 28 L -56 -7 Z" fill="#dcfce7" />
                        <path d="M -56 -7 L 14 28 L 14 42 L -56 7 Z" fill="#bbf7d0" />
                        <path d="M 14 28 L 56 7 L 56 21 L 14 42 Z" fill="#86efac" />
                        <circle cx="-35" cy="10" r="1.5" fill="#22c55e" className="led-blink-2-intro" />
                        <circle cx="-21" cy="17" r="1.5" fill="#22c55e" className="led-blink-1-intro" />
                    </g>

                    {/* Blade 3 (Top) */}
                    <g transform="translate(0, -20)">
                        <path d="M -14 -28 L 56 7 L 14 28 L -56 -7 Z" fill="#dcfce7" />
                        <path d="M -56 -7 L 14 28 L 14 42 L -56 7 Z" fill="#bbf7d0" />
                        <path d="M 14 28 L 56 7 L 56 21 L 14 42 Z" fill="#86efac" />
                        <circle cx="-35" cy="10" r="1.5" fill="#22c55e" className="led-blink-3-intro" />
                        <circle cx="-21" cy="17" r="1.5" fill="#22c55e" className="led-blink-1-intro" />
                    </g>

                    {/* Google Cloud Logo (Smaller) */}
                    <g className="server-float-intro">
                        <g transform="scale(0.2) translate(-128, -100)">
                            <path fill="#EA4335" d="M170.2,56.8 L192.5,34.5 L193.9,25.1 C153.4,-11.6 88.9,-7.4 52.4,33.9 C42.2,45.4 34.7,59.7 30.7,74.5 L38.6,73.4 L83.1,66.1 L86.6,62.5 C106.4,40.8 139.8,37.9 162.7,56.4 L170.2,56.8 Z" />
                            <path fill="#4285F4" d="M224.2,73.9 C219,55 208.5,38.1 193.9,25.1 L162.7,56.4 C175.9,67.2 183.4,83.4 183.1,100.4 L183.1,106 C198.4,106 210.9,118.4 210.9,133.8 C210.9,149.1 198.4,161.2 183.1,161.2 L127.4,161.2 L121.9,167.2 L121.9,200.5 L127.4,205.7 L183.1,205.7 C223,206.1 255.6,174.3 255.9,134.3 C256.1,110.1 244.2,87.4 224.2,73.9" />
                            <path fill="#34A853" d="M71.8,205.7 L127.4,205.7 L127.4,161.2 L71.8,161.2 C67.9,161.2 64,160.4 60.4,158.7 L52.5,161.2 L30.1,183.4 L28.2,191 C40.7,200.5 56.1,205.8 71.8,205.7" />
                            <path fill="#FBBC05" d="M71.8,61.4 C31.9,61.6 -0.2,94.2 0,134.1 C0.1,156.4 10.5,177.4 28.2,191 L60.4,158.7 C46.4,152.4 40.2,136 46.5,122 C52.9,108 69.3,101.8 83.3,108.1 C89.5,110.9 94.4,115.8 97.2,122 L129.4,89.7 C115.7,71.8 94.4,61.3 71.8,61.4" />
                        </g>
                    </g>
                </g>

                {/* Gemini Node (Repositioned Right) */}
                <g transform="translate(880, 120)">
                    <g className="node-transition-intro" style={{ transform: `scale(${geminiSize / 25})`, transformBox: 'fill-box', transformOrigin: 'center' }}>
                        <circle cx="0" cy="0" r="30" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1" filter="url(#shadow-intro)" />
                        <path d="M 0 -21 C -4.5 -10.5 -10.5 -4.5 -21 0 C -10.5 4.5 -4.5 10.5 0 21 C 4.5 10.5 10.5 4.5 21 0 C 10.5 -4.5 4.5 -10.5 0 -21 Z" fill="url(#gemini_gradient_intro)" />
                        <defs>
                            <linearGradient id="gemini_gradient_intro" x1="-21" y1="-21" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4285F4" />
                                <stop offset="0.5" stopColor="#9b72cb" />
                                <stop offset="1" stopColor="#d96570" />
                            </linearGradient>
                        </defs>
                    </g>
                </g>

                {/* Satellite Node (Repositioned Right) */}
                <g transform="translate(880, 450)">
                    <g className="node-transition-intro" style={{ transform: `scale(${satelliteSize / 20})`, transformBox: 'fill-box', transformOrigin: 'center' }}>
                        <circle cx="0" cy="0" r="25" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" filter="url(#shadow-intro)" />
                        <g transform="rotate(-15) scale(0.9)">
                            <rect x="-18" y="-6" width="12" height="12" rx="2" fill="#0ea5e9" />
                            <rect x="6" y="-6" width="12" height="12" rx="2" fill="#0ea5e9" />
                            <rect x="-4" y="-8" width="8" height="16" rx="2" fill="#f8fafc" />
                            <circle cx="0" cy="-17" r="1.5" fill="#ef4444" />
                        </g>
                    </g>
                </g>

                {/* External Tools Cluster Node (Repositioned Right) */}
                <g transform="translate(880, 300)">
                    <circle cx="0" cy="0" r="32" fill="#f0f9ff" stroke="#7dd3fc" strokeWidth="1" filter="url(#shadow-intro)" opacity="0.8" />
                    <g transform="scale(1.0) translate(-15, -15)">
                        <g transform="translate(0, 0)">
                            <FaSearch className="text-sky-500 text-xs" />
                        </g>
                        <g transform="translate(15, 10)">
                            <FaGlobe className="text-blue-500 text-xs" />
                        </g>
                        <g transform="translate(0, 20)">
                            <FaExclamationTriangle className="text-amber-500 text-xs" />
                        </g>
                    </g>
                </g>

                {/* --- Sequential Animation Loop (10s Total Cycle) --- */}

                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.02;0.18;0.2;1" dur="10s" repeatCount="indefinite" />
                        <g className="voice-wave-intro">
                            <circle cx="0" cy="0" r="40" fill="#05c663ff" opacity="0.2" />
                            <circle cx="0" cy="0" r="35" fill="#05c663ff" opacity="0.4" />
                            <g fill="#ffffff">
                                <g transform="translate(-16, 0) scale(0.9)">
                                    <rect x="-10" y="-8" width="20" height="16" rx="2" />
                                    <circle cx="0" cy="0" r="4" stroke="#05c663" strokeWidth="2" fill="none" />
                                </g>
                                <rect x="10" y="-4" width="2" height="16" rx="1" className="voice-bar voice-bar-1" />
                                <rect x="14" y="-8" width="2" height="32" rx="1" className="voice-bar voice-bar-3" />
                                <rect x="18" y="-4" width="2" height="16" rx="1" className="voice-bar voice-bar-5" />
                            </g>
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 140 410 Q 250 150 500 250"
                        calcMode="spline"
                        keyTimes="0; 0.2; 1"
                        keyPoints="0; 1; 1"
                        keySplines="0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 2. Forward Query (Server -> Gemini): 2s - 4s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.2;0.22;0.38;0.4;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade">
                            <text x="0" y="4" fontFamily="monospace" fontSize="30" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`{    }`}</text>
                            <circle cx="0" cy="-10" r="12" fill="#c4b5fd" filter="url(#shadow-intro)" />
                            <circle cx="0" cy="-10" r="8" fill="#ffffff" />
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 500 250 Q 700 50 880 120"
                        calcMode="spline"
                        keyTimes="0; 0.2; 0.4; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 3. Forward Query (Server -> Satellite): 2s - 4s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.2;0.22;0.38;0.4;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade">
                            <text x="0" y="4" fontFamily="monospace" fontSize="30" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`{    }`}</text>
                            <circle cx="0" cy="-10" r="12" fill="#7dd3fc" filter="url(#shadow-intro)" />
                            <circle cx="0" cy="-10" r="8" fill="#ffffff" />
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 500 250 Q 700 450 880 450"
                        calcMode="spline"
                        keyTimes="0; 0.2; 0.4; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 4. Tool Execution (Server -> Tools): 4s - 6s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.4;0.42;0.58;0.6;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade" transform="scale(0.8)">
                            <FaRobot className="text-sky-400" />
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 500 250 Q 725 275 880 300"
                        calcMode="spline"
                        keyTimes="0; 0.4; 0.6; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 5. Response Token (Gemini -> Server): 6s - 8s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.6;0.62;0.78;0.8;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade">
                            <text x="-24" y="4" fontFamily="monospace" fontSize="30" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`{`}</text>
                            <g transform="translate(0, -2) scale(1.4)">
                                <g transform="translate(0, -8)">
                                    <text x="0" y="0" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="900" fill="#4285F4">abc</text>
                                </g>
                                <g transform="translate(0, 0) scale(0.5)">
                                    <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#EA4335" />
                                    <circle cx="0" cy="0" r="4" stroke="#ffffff" strokeWidth="2" fill="none" />
                                </g>
                            </g>
                            <text x="24" y="4" fontFamily="monospace" fontSize="30" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`}`}</text>
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 880 120 Q 700 50 500 250"
                        calcMode="spline"
                        keyTimes="0; 0.6; 0.8; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 6. Response Token (Satellite -> Server): 6s - 8s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.6;0.62;0.78;0.8;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade">
                            <text x="-24" y="4" fontFamily="monospace" fontSize="30" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`{`}</text>
                            <g transform="translate(0, -1) scale(1.0)">
                                <path d="M -15 5 C -20 5 -20 -5 -10 -5 C -10 -15 10 -15 15 -5 C 25 -5 25 5 15 5 Z" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="2" />
                                <path d="M 2 -6 L -4 2 L 1 2 L -2 10 L 6 -1 L 1 -1 Z" fill="#fbbf24" />
                            </g>
                            <text x="24" y="4" fontFamily="monospace" fontSize="30" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`}`}</text>
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 880 450 Q 700 450 500 250"
                        calcMode="spline"
                        keyTimes="0; 0.6; 0.8; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 7. Tool Result (Tools -> Server): 6s - 8s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.6;0.62;0.78;0.8;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade" transform="translate(0, -5)">
                            <rect x="-15" y="-10" width="30" height="20" rx="3" fill="#bae6fd" />
                            <path d="M -8 -2 L 8 -2 M -8 2 L 4 2" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 880 300 Q 725 275 500 250"
                        calcMode="spline"
                        keyTimes="0; 0.6; 0.8; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 8. Return Voice (Server -> Smartphone): 8s - 10s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.8;0.82;0.98;1" dur="10s" repeatCount="indefinite" />
                        <g className="voice-wave-intro">
                            <circle cx="0" cy="0" r="25" fill="#fbbf24" opacity="0.15" />
                            <circle cx="0" cy="0" r="20" fill="#fbbf24" opacity="0.3" />
                            <g fill="#ffffff">
                                <g transform="translate(-8, 0) scale(0.6)">
                                    <rect x="-10" y="-8" width="20" height="16" rx="2" />
                                    <circle cx="0" cy="0" r="4" stroke="#05c663" strokeWidth="3" fill="none" />
                                </g>
                                <rect x="5" y="-2" width="1.5" height="4" rx="1" fill="#ffffff" className="voice-bar voice-bar-1" />
                                <rect x="8" y="-4" width="1.5" height="8" rx="1" fill="#ffffff" className="voice-bar voice-bar-3" />
                            </g>
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 500 250 Q 300 150 140 410"
                        calcMode="spline"
                        keyTimes="0; 0.8; 1"
                        keyPoints="0; 0; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1"
                    />
                </g>

                {/* Node Captions (Refined for Tools) */}
                <g className="captions-intro" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#64748b" textAnchor="middle">
                    <text x="140" y="520">FARMER APP</text>
                    <text x="500" y="375">AGENT ORCHESTRATOR</text>
                    <text x="500" y="395" fontSize="11" opacity="0.8">[GOOGLE CLOUD]</text>
                    <text x="880" y="360">TOOL ENGINE</text>
                    <text x="880" y="375" fontSize="10" opacity="0.7">SEARCH / SCRAPER</text>
                    <text x="880" y="200">GEMINI</text>
                    <text x="880" y="225" fontSize="11">MULTIMODAL REASONING</text>
                    <text x="880" y="525">WEATHER API</text>
                </g>

            </svg>
            {/* Launch Agent CTA Overlay - Smaller and Bottom Centered */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                <Link
                    href={href}
                    className={clsx(
                        "flex items-center gap-2 text-white px-6 py-2.5 rounded-full font-bold text-base shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group whitespace-nowrap",
                        themeColor,
                        themeColor.replace('600', '700').replace('bg-', 'hover:bg-')
                    )}
                >
                    Launch Agent
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};
