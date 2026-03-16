'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
    FaSearch,
    FaGlobe,
    FaExclamationTriangle,
    FaRobot
} from 'react-icons/fa';

interface CopilotSystemStatusProps {
    isProcessing: boolean;
    currentStage?: string;
    triggeredTools?: string[];
}

export const CopilotSystemStatus: React.FC<CopilotSystemStatusProps> = ({
    isProcessing,
    currentStage = 'SAHAYAK_READY_FOR_ACTION',
    triggeredTools = []
}) => {
    // Logic to bridge dashboard stages to visual phases
    // dashboard stages: MONITORING_GOVERNMENT_SCHEMES, DETECTING_DISASTER_ALERTS, ANALYZING_SUBSIDY_MARKET, SAHAYAK_READY_FOR_ACTION
    // visual phases (from Intro): QUERY, ANALYSIS, TOOLS, SYNTHESIS, RESPONSE

    const [visualStage, setVisualStage] = useState('IDLE');

    useEffect(() => {
        if (isProcessing) {
            setVisualStage('QUERY');
            const t1 = setTimeout(() => setVisualStage('ANALYSIS'), 2000);
            const t2 = setTimeout(() => setVisualStage('TOOLS'), 4000);
            const t3 = setTimeout(() => setVisualStage('SYNTHESIS'), 6000);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
            };
        } else {
            if (visualStage !== 'IDLE' && visualStage !== 'RESPONSE') {
                setVisualStage('RESPONSE');
                const timer = setTimeout(() => setVisualStage('IDLE'), 5000);
                return () => clearTimeout(timer);
            }
        }
    }, [isProcessing]);

    // Dynamic sizes for nodes (Shrunk targets: 30-45px range)
    const geminiSize = (visualStage === 'ANALYSIS' || visualStage === 'SYNTHESIS') ? 45 : 30;
    const satelliteSize = (visualStage === 'ANALYSIS' || visualStage === 'SYNTHESIS') ? 40 : 25;

    return (
        <div className="w-full h-full min-h-[400px] bg-white rounded-3xl relative flex items-center justify-center overflow-hidden mx-auto">
            <svg viewBox="0 0 800 600" className="w-full h-full max-w-4xl" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="shadow-status" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComponentTransfer in="blur" result="glow">
                            <feFuncA type="linear" slope="0.3" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <pattern id="grid-status" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                    </pattern>

                    <linearGradient id="gemini_gradient_status" x1="-14" y1="-14" x2="14" y2="14" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4285F4" />
                        <stop offset="0.5" stopColor="#9b72cb" />
                        <stop offset="1" stopColor="#d96570" />
                    </linearGradient>
                </defs>

                <style>
                    {`
                        .dashed-path-status {
                            stroke-dasharray: 10 10;
                            animation: dash-flow-status 0.8s linear infinite;
                        }
                        @keyframes dash-flow-status {
                            from { stroke-dashoffset: 20; }
                            to { stroke-dashoffset: 0; }
                        }
                        .voice-wave-status {
                            animation: voice-pulse-status 1.5s ease-in-out infinite alternate;
                            transform-origin: center;
                            transform-box: fill-box;
                        }
                        @keyframes voice-pulse-status {
                            0% { transform: scale(0.95); opacity: 0.8; }
                            100% { transform: scale(1.05); opacity: 1; }
                        }
                        .voice-bar-status {
                            animation: voice-bar-grow-status 0.4s ease-in-out infinite alternate;
                            transform-origin: center;
                            transform-box: fill-box;
                        }
                        @keyframes voice-bar-grow-status {
                            0% { transform: scaleY(0.3); }
                            100% { transform: scaleY(1.2); }
                        }
                        .led-blink-status { animation: blink-status 1.5s infinite; }
                        @keyframes blink-status {
                            0%, 100% { fill: #4ade80; opacity: 0.4; }
                            50% { fill: #22c55e; opacity: 1; filter: drop-shadow(0 0 2px rgba(34,197,94,0.5)); }
                        }
                        .node-transition-status {
                            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        .float-status {
                            animation: float-anim-status 3s ease-in-out infinite;
                        }
                        @keyframes float-anim-status {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-5px); }
                        }
                    `}
                </style>

                {/* Background Grid */}
                <rect width="100%" height="100%" fill="url(#grid-status)" />

                {/* Dashed Paths (Visual Sync) */}
                <g opacity="0.4">
                    {/* Forward Paths */}
                    <path d="M 110 410 Q 200 150 350 250" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="10 10" className={clsx(visualStage === 'QUERY' && "dashed-path-status")} />
                    <path d="M 350 250 Q 500 50 700 120" fill="none" stroke="#c4b5fd" strokeWidth="3" strokeDasharray="10 10" className={clsx(visualStage === 'ANALYSIS' && "dashed-path-status")} />
                    <path d="M 350 250 Q 525 275 700 300" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="10 10" className={clsx(visualStage === 'TOOLS' && "dashed-path-status")} />
                    <path d="M 350 250 Q 500 450 700 450" fill="none" stroke="#bae6fd" strokeWidth="3" strokeDasharray="10 10" className={clsx(visualStage === 'SYNTHESIS' && "dashed-path-status")} />

                    {/* Return Paths (Missing previously) */}
                    <path d="M 700 120 Q 500 50 350 250" fill="none" stroke="#c4b5fd" strokeWidth="3" strokeDasharray="10 10" className={clsx(visualStage === 'SYNTHESIS' && "dashed-path-status")} />
                    <path d="M 700 300 Q 525 275 350 250" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="10 10" className={clsx(visualStage === 'SYNTHESIS' && "dashed-path-status")} />
                    <path d="M 700 450 Q 500 450 350 250" fill="none" stroke="#bae6fd" strokeWidth="3" strokeDasharray="10 10" className={clsx(visualStage === 'SYNTHESIS' && "dashed-path-status")} />
                    <path d="M 350 250 Q 200 150 110 410" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="10 10" className={clsx(visualStage === 'RESPONSE' && "dashed-path-status")} />
                </g>

                {/* Phone Node */}
                <g transform="translate(110, 410)">
                    <g transform="translate(0, 12)">
                        <g transform="scale(0.8, 0.4) rotate(45)">
                            <rect x="-70" y="-120" width="140" height="240" rx="20" fill="#bae6fd" />
                        </g>
                    </g>
                    <g transform="scale(0.8, 0.4) rotate(45)">
                        <rect x="-70" y="-120" width="140" height="240" rx="20" fill="#e0f2fe" />
                        <rect x="-60" y="-110" width="120" height="220" rx="12" fill="#ffffff" />
                        <g transform="translate(-12, 50)">
                            <text x="5" y="-100" fontFamily="sans-serif" fontSize="18" fontWeight="bold" fill="#077931ff" textAnchor="middle">Agri-Copilot</text>
                            <rect x="0" y="-8" width="4" height="16" rx="2" fill={(visualStage === 'QUERY' || visualStage === 'RESPONSE') ? '#10b981' : '#cbd5e1'} className={clsx((visualStage === 'QUERY' || visualStage === 'RESPONSE') && "voice-bar-status")} />
                            <rect x="7" y="-12" width="4" height="24" rx="2" fill={(visualStage === 'QUERY' || visualStage === 'RESPONSE') ? '#10b981' : '#cbd5e1'} className={clsx((visualStage === 'QUERY' || visualStage === 'RESPONSE') && "voice-bar-status")} style={{ animationDelay: '0.1s' }} />
                            <rect x="14" y="-10" width="4" height="20" rx="2" fill={(visualStage === 'QUERY' || visualStage === 'RESPONSE') ? '#10b981' : '#cbd5e1'} className={clsx((visualStage === 'QUERY' || visualStage === 'RESPONSE') && "voice-bar-status")} style={{ animationDelay: '0.2s' }} />
                        </g>
                    </g>
                    <text y="100" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#236ac6" fontFamily="sans-serif">FARMER APP</text>
                </g>

                {/* Server Node */}
                <g transform="translate(350, 250)">
                    <g transform="translate(0, 20)">
                        <path d="M -14 -28 L 56 7 L 14 28 L -56 -7 Z" fill="#dcfce7" />
                    </g>
                    <g transform="translate(0, 0)">
                        <path d="M -14 -28 L 56 7 L 14 28 L -56 -7 Z" fill="#dcfce7" />
                        <circle cx="-35" cy="10" r="1.5" fill="#22c55e" className="led-blink-status" style={{ animationDelay: '0.5s' }} />
                    </g>
                    <g transform="translate(0, -20)">
                        <path d="M -14 -28 L 56 7 L 14 28 L -56 -7 Z" fill="#dcfce7" />
                        <circle cx="-35" cy="10" r="1.5" fill="#22c55e" className="led-blink-status" style={{ animationDelay: '1s' }} />
                    </g>
                    {/* Google Cloud Logo (Simplified) */}
                    <g transform="translate(-50, -100) scale(0.2)">
                        <path fill="#EA4335" d="M170.2517,56.8186 L192.5047,34.5656 L193.9877,25.1956 C153.4367,-11.6774 88.9757,-7.4964 52.4207,33.9196 C42.2667,45.4226 34.7337,59.7636 30.7167,74.5726 L38.6867,73.4496 L83.1917,66.1106 L86.6277,62.5966 C106.4247,40.8546 139.8977,37.9296 162.7557,56.4286 L170.2517,56.8186 Z" />
                        <path fill="#4285F4" d="M224.2048,73.9182 C219.0898,55.0822 208.5888,38.1492 193.9878,25.1962 L162.7558,56.4282 C175.9438,67.2042 183.4568,83.4382 183.1348,100.4652 L183.1348,106.0092 C198.4858,106.0092 210.9318,118.4542 210.9318,133.8052 C210.9318,149.1572 198.4858,161.2902 183.1348,161.2902 L127.4638,161.2902 L121.9978,167.2242 L121.9978,200.5642 L127.4638,205.7952 L183.1348,205.7952 C223.0648,206.1062 255.6868,174.3012 255.9978,134.3712 C256.1858,110.1682 244.2528,87.4782 224.2048,73.9182" />
                        <path fill="#34A853" d="M71.8704,205.7957 L127.4634,205.7957 L127.4634,161.2897 L71.8704,161.2897 C67.9094,161.2887 64.0734,160.4377 60.4714,158.7917 L52.5844,161.2117 L30.1754,183.4647 L28.2234,191.0387 C40.7904,200.5277 56.1234,205.8637 71.8704,205.7957" />
                        <path fill="#FBBC05" d="M71.8704,61.4255 C31.9394,61.6635 -0.2366,94.2275 0.0014,134.1575 C0.1344,156.4555 10.5484,177.4455 28.2234,191.0385 L60.4714,158.7915 C46.4804,152.4705 40.2634,136.0055 46.5844,122.0155 C52.9044,108.0255 69.3704,101.8085 83.3594,108.1285 C89.5244,110.9135 94.4614,115.8515 97.2464,122.0155 L129.4944,89.7685 C115.7734,71.8315 94.4534,61.3445 71.8704,61.4255" />
                    </g>
                    <FaRobot x="-15" y="-55" size={30} color="#10b981" className="float-status" />
                    <text y="100" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#236ac6" fontFamily="sans-serif">ORCHESTRATOR</text>
                </g>

                {/* Gemini Node */}
                <g transform="translate(700, 120)">
                    <g className="node-transition-status" style={{ transform: `scale(${geminiSize / 30})`, transformBox: 'fill-box', transformOrigin: 'center' }}>
                        <circle cx="0" cy="0" r="25" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1" filter="url(#shadow-status)" />
                        <path d="M 0 -14 C -3 -7 -7 -3 -14 0 C -7 3 -3 7 0 14 C 3 7 7 3 14 0 C 7 -3 3 -7 0 -14 Z" fill="url(#gemini_gradient_status)" />
                    </g>
                    <text y="70" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#64748b" fontFamily="sans-serif">GEMINI</text>
                </g>

                {/* Tool Engine Node */}
                <g transform="translate(700, 300)">
                    <circle cx="0" cy="0" r="30" fill="#f0f9ff" stroke="#7dd3fc" strokeWidth="1" filter="url(#shadow-status)" opacity="0.8" />
                    <g transform="scale(0.8) translate(-15, -15)">
                        <FaSearch size={14} className={clsx("text-sky-500", triggeredTools.includes('get_agri_schemes') && "animate-pulse")} />
                        <FaGlobe size={14} x="16" y="8" className={clsx("text-blue-500", triggeredTools.includes('analyze_subsidies') && "animate-pulse")} />
                        <FaExclamationTriangle size={14} y="16" className={clsx("text-amber-500", triggeredTools.includes('check_disaster_alerts') && "animate-pulse")} />
                    </g>
                    <text y="70" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#64748b" fontFamily="sans-serif">TOOLS_ENGINE</text>
                </g>

                {/* Satellite / Weather Node */}
                <g transform="translate(700, 450)">
                    <g className="node-transition-status" style={{ transform: `scale(${satelliteSize / 25})`, transformBox: 'fill-box', transformOrigin: 'center' }}>
                        <circle cx="0" cy="0" r="22" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" filter="url(#shadow-status)" />
                        <g transform="rotate(-15) scale(0.8)">
                            <rect x="-14" y="-5" width="10" height="10" rx="1.5" fill="#0ea5e9" />
                            <rect x="4" y="-5" width="10" height="10" rx="1.5" fill="#0ea5e9" />
                            <rect x="-3" y="-6" width="6" height="12" rx="1.5" fill="#64748b" />
                        </g>
                    </g>
                    <text y="70" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#64748b" fontFamily="sans-serif">WEATHER ENGINE</text>
                </g>

                {/* Animated Packets (Live Data) */}
                {visualStage === 'IDLE' && (
                    <g>
                        <circle r="4" fill="#0ea5e9" opacity="0.4" filter="url(#shadow-status)">
                            <animateMotion dur="4s" repeatCount="indefinite" path="M 350 250 Q 500 450 700 450" />
                        </circle>
                    </g>
                )}
                {visualStage === 'QUERY' && (
                    <g>
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 110 410 Q 200 150 350 250" />
                        <circle r="6" fill="#10b981" filter="url(#shadow-status)" />
                    </g>
                )}
                {visualStage === 'TOOLS' && (
                    <g>
                        <animateMotion dur="1s" repeatCount="indefinite" path="M 350 250 Q 525 275 700 300" />
                        <circle r="6" fill="#38bdf8" filter="url(#shadow-status)" />
                    </g>
                )}
                {visualStage === 'ANALYSIS' && (
                    <g>
                        <animateMotion dur="1s" repeatCount="indefinite" path="M 350 250 Q 500 50 700 120" />
                        <circle r="6" fill="#8b5cf6" filter="url(#shadow-status)" />
                    </g>
                )}
                {visualStage === 'SYNTHESIS' && (
                    <g>
                        {/* Gemini -> Server */}
                        <g>
                            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 700 120 Q 500 50 350 250" />
                            <circle r="5" fill="#8b5cf6" filter="url(#shadow-status)" />
                        </g>
                        {/* Tools -> Server */}
                        <g>
                            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 700 300 Q 525 275 350 250" />
                            <circle r="5" fill="#38bdf8" filter="url(#shadow-status)" />
                        </g>
                        {/* Weather -> Server */}
                        <g>
                            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 700 450 Q 500 450 350 250" />
                            <circle r="5" fill="#0ea5e9" filter="url(#shadow-status)" />
                        </g>
                    </g>
                )}
                {visualStage === 'RESPONSE' && (
                    <g>
                        <animateMotion dur="2s" repeatCount="indefinite" path="M 350 250 Q 200 150 110 410" />
                        <circle r="8" fill="#10b981" filter="url(#shadow-status)" />
                    </g>
                )}
            </svg>

            {/* Status Text Overlay */}
            <div className="absolute bottom-30 left-0 w-full text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 bg-white/50 backdrop-blur-sm inline-block px-4 py-1 rounded-full border border-indigo-100">
                    {currentStage.replace(/_/g, ' ')}
                </p>
            </div>
        </div>
    );
};
