'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import clsx from 'clsx';

interface AgriAdvisorIntroProps {
    href?: string;
    themeColor?: string;
}

export const AgriAdvisorIntro: React.FC<AgriAdvisorIntroProps> = ({
    href = "/live-agri-advisor",
    themeColor = "bg-red-600"
}) => {
    const [stage, setStage] = useState('idle');

    const STATES = [
        'MULTIMODAL_INPUT_STREAMING',
        'REASONING_QUERY & PHYSICS_SYNC_QUERY',
        'ADVICE_SUMMARY & WEATHER_FORECAST_READY',
        'MULTIMODAL_OUTPUT_STREAMING'
    ];

    // Cycle through stages for demonstration
    useEffect(() => {
        let startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) % 10000;
            if (elapsed < 2500) setStage(STATES[0]);
            else if (elapsed < 5000) setStage(STATES[1]);
            else if (elapsed < 7500) setStage(STATES[2]);
            else setStage(STATES[3]);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const geminiSize = (stage === STATES[1] || stage === STATES[2]) ? 60 : 40;
    const satelliteSize = (stage === STATES[1] || stage === STATES[2]) ? 55 : 35;

    return (
        <div
            className="w-full h-full min-h-[400px] bg-white rounded-3xl relative flex items-center justify-center overflow-hidden mx-auto border border-slate-100 shadow-2xl"
            style={{ colorScheme: 'light' }}
        >
            {/* Title Overlay */}
            <div className="absolute top-8 left-8 z-10">
                <p className="text-slate-500 text-sm mt-1">
                    System State: <span className="font-semibold text-indigo-500">{stage.replace(/_/g, ' ')}</span>
                </p>
            </div>

            <svg viewBox="0 0 800 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
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
                            stroke-dasharray: 12 12;
                            animation: dash-flow-intro 1s linear infinite;
                        }
                        @keyframes dash-flow-intro {
                            from { stroke-dashoffset: 24; }
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
                            5% { transform: translateY(4px); }
                        }

                        .sparkle-intro {
                            animation: twinkle-intro 2s ease-in-out infinite;
                        }
                        .sparkle-1-intro { transform-origin: 285px 125px; }
                        .sparkle-2-intro { transform-origin: 113px 223px; animation-delay: 1s; }
                        .sparkle-3-intro { transform-origin: 583px 323px; animation-delay: 1s; }
                        .sparkle-4-intro { transform-origin: 350px 420px; animation-delay: 1s; }
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
                            0%, 100% { transform: translate(0, -110px); }
                            50% { transform: translate(0, -115px); }
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

                {/* Sparkles shifted 100px left from original */}
                <g className="sparkles">
                    <path d="M 280 120 L 285 110 L 290 120 L 300 125 L 290 130 L 285 140 L 280 130 L 270 125 Z" fill="#fbbf24" className="sparkle-intro sparkle-1-intro" />
                    <path d="M 110 220 L 115 210 L 120 220 L 130 225 L 120 230 L 115 240 L 110 230 L 100 225 Z" fill="#7dd3fc" className="sparkle-intro sparkle-2-intro" />
                    <path d="M 580 320 L 585 310 L 590 320 L 600 325 L 590 330 L 585 340 L 580 330 L 570 325 Z" fill="#4ade80" className="sparkle-intro sparkle-3-intro" />
                    <path d="M 345 420 L 350 410 L 355 420 L 365 425 L 355 430 L 350 440 L 345 430 L 335 425 Z" fill="#f87171" className="sparkle-intro sparkle-4-intro" />
                </g>

                {/* Phone 1 (Sender - Pastel Blue) shifted further right to prevent clipping */}
                <g transform="translate(110, 350)">
                    {/* Shadow - Removed as requested */}
                    {/* Depth */}
                    <g transform="translate(0, 15)">
                        <g transform="scale(1, 0.5) rotate(45)">
                            <rect x="-70" y="-120" width="140" height="240" rx="20" fill="#bae6fd" />
                        </g>
                    </g>
                    {/* Surface */}
                    <g transform="scale(1, 0.5) rotate(45)">
                        <rect x="-70" y="-120" width="140" height="240" rx="20" fill="#e0f2fe" />
                        <rect x="-60" y="-110" width="120" height="220" rx="12" fill="#ffffff" />

                        {/* Screen Content */}
                        {/* SmartAgri */}
                        <text x="0" y="-40" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="#4ade80" textAnchor="middle">SmartAgri</text>

                        {/* Voice Button on Smartphone */}
                        <g className="send-btn-group-intro">
                            <rect x="-40" y="50" width="80" height="26" rx="13" fill="#38bdf8" />
                            <text x="-12" y="67" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#ffffff" textAnchor="middle">VOICE</text>

                            {/* Tiny Wave inside button - Sync with calling phases (0-2.5s and 7.5-10s) */}
                            <g className="voice-wave-intro" transform="translate(18, 67)">
                                <animate attributeName="opacity" values="1;1;0.2;0.2;1;1" keyTimes="0;0.25;0.27;0.73;0.75;1" dur="10s" repeatCount="indefinite" />
                                <circle cx="0" cy="0" r="18" fill="#38bdf8" opacity="0.2" />
                                <rect className="voice-bar voice-bar-1" x="-6" y="-3" width="2" rx="1" fill="#e44545ff" />
                                <rect className="voice-bar voice-bar-2" x="-3" y="-5" width="2" rx="1" fill="#e44545ff" />
                                <rect className="voice-bar voice-bar-3" x="0" y="-7" width="2" rx="1" fill="#e44545ff" />
                                <rect className="voice-bar voice-bar-4" x="3" y="-5" width="2" rx="1" fill="#e44545ff" />
                                <rect className="voice-bar voice-bar-5" x="6" y="-3" width="2" rx="1" fill="#e44545ff" />
                            </g>
                        </g>
                    </g>
                </g>

                {/* Dashed Path (from Phone 1 button to Server) - Shifted Left */}
                <path
                    d="M 68 371 Q 150 150 350 250"
                    fill="none"
                    stroke="#14c735ff"
                    strokeWidth="3"
                    className="dashed-path-intro"
                />

                {/* Dashed Path (from Server to Gemini) - Curved */}
                <path
                    d="M 350 250 Q 500 50 700 120"
                    fill="none"
                    stroke="#c4b5fd"
                    strokeWidth="3"
                    className="dashed-path-intro"
                />

                {/* Dashed Path (from Server to Satellite) - Curved */}
                <path
                    d="M 350 250 Q 500 450 700 450"
                    fill="none"
                    stroke="#7dd3fc"
                    strokeWidth="3"
                    className="dashed-path-intro"
                />

                {/* Server Node (Receiver - Pastel Green) shifted 100px left */}
                <g transform="translate(350, 250)">
                    {/* Shadow */}
                    <path d="M -20 10 L 80 60 L 20 90 L -80 40 Z" fill="#000000" filter="url(#shadow-intro)" opacity="0.3" />

                    {/* Blade 1 (Bottom) */}
                    <g transform="translate(0, 30)">
                        <path d="M -20 -40 L 80 10 L 20 40 L -80 -10 Z" fill="#dcfce7" />
                        <path d="M -80 -10 L 20 40 L 20 60 L -80 10 Z" fill="#bbf7d0" />
                        <path d="M 20 40 L 80 10 L 80 30 L 20 60 Z" fill="#86efac" />
                        {/* LEDs */}
                        <circle cx="-50" cy="15" r="2.5" fill="#22c55e" className="led-blink-1-intro" />
                        <circle cx="-30" cy="25" r="2.5" fill="#22c55e" className="led-blink-2-intro" />
                        <circle cx="-10" cy="35" r="2.5" fill="#22c55e" className="led-blink-3-intro" />
                    </g>

                    {/* Blade 2 (Middle) */}
                    <g transform="translate(0, 0)">
                        <path d="M -20 -40 L 80 10 L 20 40 L -80 -10 Z" fill="#dcfce7" />
                        <path d="M -80 -10 L 20 40 L 20 60 L -80 10 Z" fill="#bbf7d0" />
                        <path d="M 20 40 L 80 10 L 80 30 L 20 60 Z" fill="#86efac" />
                        {/* LEDs */}
                        <circle cx="-50" cy="15" r="2.5" fill="#22c55e" className="led-blink-2-intro" />
                        <circle cx="-30" cy="25" r="2.5" fill="#22c55e" className="led-blink-3-intro" />
                        <circle cx="-10" cy="35" r="2.5" fill="#22c55e" className="led-blink-1-intro" />
                    </g>

                    {/* Blade 3 (Top) */}
                    <g transform="translate(0, -30)">
                        <path d="M -20 -40 L 80 10 L 20 40 L -80 -10 Z" fill="#dcfce7" />
                        <path d="M -80 -10 L 20 40 L 20 60 L -80 10 Z" fill="#bbf7d0" />
                        <path d="M 20 40 L 80 10 L 80 30 L 20 60 Z" fill="#86efac" />
                        {/* LEDs */}
                        <circle cx="-50" cy="15" r="2.5" fill="#22c55e" className="led-blink-3-intro" />
                        <circle cx="-30" cy="25" r="2.5" fill="#22c55e" className="led-blink-1-intro" />
                        <circle cx="-10" cy="35" r="2.5" fill="#22c55e" className="led-blink-2-intro" />
                    </g>

                    {/* Google Cloud Logo - Fixed Stitching, Scale and Centered above Server */}
                    <g className="server-float-intro">
                        <g transform="scale(0.3) translate(-128, -103)">
                            {/* Top Red Section */}
                            <path fill="#EA4335" stroke="#EA4335" strokeWidth="0.5" d="M170.2517,56.8186 L192.5047,34.5656 L193.9877,25.1956 C153.4367,-11.6774 88.9757,-7.4964 52.4207,33.9196 C42.2667,45.4226 34.7337,59.7636 30.7167,74.5726 L38.6867,73.4496 L83.1917,66.1106 L86.6277,62.5966 C106.4247,40.8546 139.8977,37.9296 162.7557,56.4286 L170.2517,56.8186 Z" />
                            {/* Right Blue Section */}
                            <path fill="#4285F4" stroke="#4285F4" strokeWidth="0.5" d="M224.2048,73.9182 C219.0898,55.0822 208.5888,38.1492 193.9878,25.1962 L162.7558,56.4282 C175.9438,67.2042 183.4568,83.4382 183.1348,100.4652 L183.1348,106.0092 C198.4858,106.0092 210.9318,118.4542 210.9318,133.8052 C210.9318,149.1572 198.4858,161.2902 183.1348,161.2902 L127.4638,161.2902 L121.9978,167.2242 L121.9978,200.5642 L127.4638,205.7952 L183.1348,205.7952 C223.0648,206.1062 255.6868,174.3012 255.9978,134.3712 C256.1858,110.1682 244.2528,87.4782 224.2048,73.9182" />
                            {/* Bottom Green Section */}
                            <path fill="#34A853" stroke="#34A853" strokeWidth="0.5" d="M71.8704,205.7957 L127.4634,205.7957 L127.4634,161.2897 L71.8704,161.2897 C67.9094,161.2887 64.0734,160.4377 60.4714,158.7917 L52.5844,161.2117 L30.1754,183.4647 L28.2234,191.0387 C40.7904,200.5277 56.1234,205.8637 71.8704,205.7957" />
                            {/* Left Yellow Section */}
                            <path fill="#FBBC05" stroke="#FBBC05" strokeWidth="0.5" d="M71.8704,61.4255 C31.9394,61.6635 -0.2366,94.2275 0.0014,134.1575 C0.1344,156.4555 10.5484,177.4455 28.2234,191.0385 L60.4714,158.7915 C46.4804,152.4705 40.2634,136.0055 46.5844,122.0155 C52.9044,108.0255 69.3704,101.8085 83.3594,108.1285 C89.5244,110.9135 94.4614,115.8515 97.2464,122.0155 L129.4944,89.7685 C115.7734,71.8315 94.4534,61.3445 71.8704,61.4255" />
                        </g>
                    </g>
                </g>

                {/* Gemini Node (Top Right) shifted left */}
                <g transform="translate(700, 120)">
                    <g
                        className="node-transition-intro"
                        style={{
                            transform: `scale(${geminiSize / 25})`,
                            transformBox: 'fill-box',
                            transformOrigin: 'center'
                        }}
                    >
                        {/* Base */}
                        <circle cx="0" cy="0" r="30" fill="#ede9fe" />
                        <circle cx="0" cy="0" r="25" fill="#ddd6fe" />
                        {/* 4-Pointed Star (Gemini Icon) - Centered and Enlarged */}
                        <path d="M 0 -21 C -4.5 -10.5 -10.5 -4.5 -21 0 C -10.5 4.5 -4.5 10.5 0 21 C 4.5 10.5 10.5 4.5 21 0 C 10.5 -4.5 4.5 -10.5 0 -21 Z" fill="url(#gemini_gradient)" />
                        <defs>
                            <linearGradient id="gemini_gradient" x1="-21" y1="-21" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4285F4" />
                                <stop offset="0.5" stopColor="#9b72cb" />
                                <stop offset="1" stopColor="#d96570" />
                            </linearGradient>
                        </defs>
                    </g>
                </g>

                {/* Satellite Node (Bottom Right) shifted left */}
                <g transform="translate(700, 450)">
                    <g
                        className="node-transition-intro"
                        style={{
                            transform: `scale(${satelliteSize / 20})`,
                            transformBox: 'fill-box',
                            transformOrigin: 'center'
                        }}
                    >
                        {/* Base */}
                        <circle cx="0" cy="0" r="25" fill="#e0f2fe" />
                        <circle cx="0" cy="0" r="20" fill="#bae6fd" />

                        {/* Satellite Icon */}
                        <g transform="rotate(-15)">
                            {/* Solar Panels */}
                            <rect x="-18" y="-6" width="12" height="12" rx="2" fill="#0ea5e9" />
                            <rect x="6" y="-6" width="12" height="12" rx="2" fill="#0ea5e9" />
                            {/* Panel Grid Lines */}
                            <line x1="-12" y1="-6" x2="-12" y2="6" stroke="#38bdf8" strokeWidth="1" />
                            <line x1="12" y1="-6" x2="12" y2="6" stroke="#38bdf8" strokeWidth="1" />
                            {/* Body */}
                            <rect x="-4" y="-8" width="8" height="16" rx="2" fill="#f8fafc" />
                            {/* Antenna */}
                            <path d="M -2 -8 L -6 -14 M 2 -8 L 6 -14 M 0 -8 L 0 -16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="0" cy="-17" r="1.5" fill="#ef4444" />
                        </g>
                    </g>
                </g>

                {/* --- Sequential Animation Loop (10s Total Cycle) --- */}

                {/* 1. Forward Call (Smartphone -> Server): 0s - 2.5s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.02;0.23;0.25;1" dur="10s" repeatCount="indefinite" />
                        <g className="voice-wave-intro">
                            <circle cx="0" cy="0" r="40" fill="#05c663ff" opacity="0.2" />
                            <circle cx="0" cy="0" r="35" fill="#05c663ff" opacity="0.4" />
                            {/* Multi-modal Input: Camera (Photo) + Voice (Audio) */}
                            <g fill="#ffffff">
                                {/* Camera Icon */}
                                <g transform="translate(-16, 0) scale(0.9)">
                                    <rect x="-10" y="-8" width="20" height="16" rx="2" />
                                    <circle cx="0" cy="0" r="4" stroke="#05c663" strokeWidth="2" fill="none" />
                                    <rect x="-4" y="-11" width="8" height="3" rx="1" />
                                    <circle cx="6" cy="-5" r="1.2" fill="#05c663" />
                                </g>
                                {/* Voice Bars shifted right */}
                                <rect x="10" y="-4" width="2" height="16" rx="1" className="voice-bar voice-bar-1" />
                                <rect x="14" y="-8" width="2" height="32" rx="1" className="voice-bar voice-bar-2" />
                                <rect x="18" y="-10" width="2" height="40" rx="1" className="voice-bar voice-bar-3" />
                                <rect x="22" y="-8" width="2" height="32" rx="1" className="voice-bar voice-bar-4" />
                                <rect x="26" y="-4" width="2" height="16" rx="1" className="voice-bar voice-bar-5" />
                            </g>
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 68 371 Q 150 150 350 250"
                        calcMode="spline"
                        keyTimes="0; 0.25; 1"
                        keyPoints="0; 1; 1"
                        keySplines="0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 2. Forward Query (Server -> Gemini): 2.5s - 5s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.25;0.27;0.48;0.5;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade">
                            <text x="0" y="4" fontFamily="monospace" fontSize="50" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`{    }`}</text>
                            <circle cx="0" cy="-10" r="20" fill="#c4b5fd" filter="url(#shadow-intro)" />
                            <circle cx="0" cy="-10" r="15" fill="#ffffff" />
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 350 250 Q 500 50 700 120"
                        calcMode="spline"
                        keyTimes="0; 0.25; 0.5; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 3. Forward Query (Server -> Satellite): 2.5s - 5s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.25;0.27;0.48;0.5;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade">
                            <text x="0" y="4" fontFamily="monospace" fontSize="50" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`{    }`}</text>
                            <circle cx="0" cy="-10" r="20" fill="#7dd3fc" filter="url(#shadow-intro)" />
                            <circle cx="0" cy="-10" r="15" fill="#ffffff" />
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 350 250 Q 500 450 700 450"
                        calcMode="spline"
                        keyTimes="0; 0.25; 0.5; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 4. Response Token (Gemini -> Server): 5s - 7.5s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.5;0.52;0.73;0.75;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade">
                            <text x="-34" y="4" fontFamily="monospace" fontSize="50" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`{`}</text>
                            {/* Gemini Multi-modal Response Icon (Text, Visual, Audio) - Vertical Stack */}
                            <g transform="translate(0, -4) scale(2.0)">
                                {/* Text: Plain "ABC" Icon (Top) */}
                                <g transform="translate(0, -10.5)">
                                    <text x="0" y="0" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="900" fill="#4285F4">abc</text>
                                </g>
                                {/* Visual: Camera Icon (Middle) */}
                                <g transform="translate(0, 0) scale(0.65)">
                                    <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#EA4335" />
                                    <circle cx="0" cy="0" r="4" stroke="#ffffff" strokeWidth="2" fill="none" />
                                    <rect x="-4" y="-11" width="8" height="3" rx="1" fill="#EA4335" />
                                    <circle cx="6" cy="-5" r="1.2" fill="#ffffff" />
                                </g>
                                {/* Audio: Animated Voice Bars (Bottom) */}
                                <g transform="translate(-7.5, 11) scale(0.6)">
                                    <rect x="0" y="-2" width="2" height="4" rx="1" fill="#FBBC05" className="voice-bar voice-bar-1" />
                                    <rect x="3" y="-4" width="2" height="8" rx="1" fill="#FBBC05" className="voice-bar voice-bar-2" />
                                    <rect x="6" y="-6" width="2" height="12" rx="1" fill="#FBBC05" className="voice-bar voice-bar-3" />
                                    <rect x="9" y="-4" width="2" height="8" rx="1" fill="#FBBC05" className="voice-bar voice-bar-4" />
                                    <rect x="12" y="-2" width="2" height="4" rx="1" fill="#FBBC05" className="voice-bar voice-bar-5" />
                                </g>
                            </g>
                            <text x="34" y="4" fontFamily="monospace" fontSize="50" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`}`}</text>
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 700 120 Q 500 50 350 250"
                        calcMode="spline"
                        keyTimes="0; 0.5; 0.75; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 5. Response Token (Satellite -> Server): 5s - 7.5s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.5;0.52;0.73;0.75;1" dur="10s" repeatCount="indefinite" />
                        <g className="token-scale-fade">
                            {/* Transfer Cloud/Rain Icon */}
                            <text x="-34" y="4" fontFamily="monospace" fontSize="50" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`{`}</text>
                            {/* Transfer Cloud/Rain Icon - Increased Size */}
                            <g transform="translate(0, -1) scale(1.5)">
                                <path d="M -15 5 C -20 5 -20 -5 -10 -5 C -10 -15 10 -15 15 -5 C 25 -5 25 5 15 5 Z" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="2" />
                                <path d="M 2 -6 L -4 2 L 1 2 L -2 10 L 6 -1 L 1 -1 Z" fill="#fbbf24" />
                            </g>
                            <text x="34" y="4" fontFamily="monospace" fontSize="50" fontWeight="bold" fill="#0ea5e9" textAnchor="middle">{`}`}</text>
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 700 450 Q 500 450 350 250"
                        calcMode="spline"
                        keyTimes="0; 0.5; 0.75; 1"
                        keyPoints="0; 0; 1; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1"
                    />
                </g>

                {/* 6. Return Voice (Server -> Smartphone): 7.5s - 10s */}
                <g>
                    <g opacity="0">
                        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.75;0.77;0.98;1" dur="10s" repeatCount="indefinite" />
                        <g className="voice-wave-intro">
                            <circle cx="0" cy="0" r="40" fill="#fbbf24" opacity="0.2" />
                            <circle cx="0" cy="0" r="35" fill="#fbbf24" opacity="0.4" />
                            {/* Multi-modal Output: Imagen (Photo) + Voice (Audio) */}
                            <g fill="#ffffff">
                                {/* Image Icon */}
                                <g transform="translate(-16, 0) scale(0.9)">
                                    <rect x="-10" y="-8" width="20" height="16" rx="2" />
                                    <circle cx="0" cy="0" r="4" stroke="#05c663" strokeWidth="2" fill="none" />
                                    <rect x="-4" y="-11" width="8" height="3" rx="1" />
                                    <circle cx="6" cy="-5" r="1.2" fill="#05c663" />
                                </g>
                                {/* Voice Bars shifted right */}
                                <rect x="10" y="-4" width="2" height="16" rx="1" className="voice-bar voice-bar-1" />
                                <rect x="14" y="-8" width="2" height="32" rx="1" className="voice-bar voice-bar-2" />
                                <rect x="18" y="-10" width="2" height="40" rx="1" className="voice-bar voice-bar-3" />
                                <rect x="22" y="-8" width="2" height="32" rx="1" className="voice-bar voice-bar-4" />
                                <rect x="26" y="-4" width="2" height="16" rx="1" className="voice-bar voice-bar-5" />
                            </g>
                        </g>
                    </g>
                    <animateMotion
                        dur="10s"
                        repeatCount="indefinite"
                        path="M 350 250 Q 150 150 68 371"
                        calcMode="spline"
                        keyTimes="0; 0.75; 1"
                        keyPoints="0; 0; 1"
                        keySplines="0 0 1 1; 0.4 0 0.2 1"
                    />
                </g>

                {/* Node Captions */}
                <g className="captions-intro" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#64748b" textAnchor="middle">
                    <text x="65" y="450">FARMER APP</text>
                    <text x="350" y="370">AGENT ORCHESTRATOR</text>
                    <text x="350" y="390">[HOSTED ON GOOGLE CLOUD]</text>
                    <text x="700" y="195">GEMINI</text>
                    <text x="700" y="215">MULTIMODAL REASONING</text>
                    <text x="700" y="235">VISUAL ADVICE[Imagen 4.0]</text>
                    <text x="700" y="525">NEURAL-GCM PHYSICS</text>
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
