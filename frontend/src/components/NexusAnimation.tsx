import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

interface NexusAnimationProps {
    isProcessing: boolean;
    latestAdvice: string | null;
}

enum AnimationStage {
    IDLE = 'System Standby',
    INPUT = 'Streaming Multimodal Field Data...',
    REASONING = 'Gemini Multi-modal Reasoning & Weather Risk Assessment...',
    SYNTHESIS = 'Synthesizing Localized Advice & Weather Forecast...',
    OUTPUT = 'Farming Advice Finalized & Transmitted'
}

export const NexusAnimation: React.FC<NexusAnimationProps> = ({ isProcessing, latestAdvice }) => {
    const [stage, setStage] = useState<AnimationStage>(AnimationStage.IDLE);

    useEffect(() => {
        if (isProcessing) {
            setStage(AnimationStage.INPUT);
            const t1 = setTimeout(() => setStage(AnimationStage.REASONING), 2500);
            const t2 = setTimeout(() => setStage(AnimationStage.SYNTHESIS), 5000);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        } else if (latestAdvice) {
            setStage(AnimationStage.OUTPUT);
            const timer = setTimeout(() => {
                setStage(AnimationStage.IDLE);
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            setStage(AnimationStage.IDLE);
        }
    }, [isProcessing, latestAdvice]);

    return (
        <div className="w-full flex-1 min-h-[300px] relative flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 800 600" className="w-full h-full max-h-[400px]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="shadow-nexus" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComponentTransfer in="blur" result="glow">
                            <feFuncA type="linear" slope="0.3" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <linearGradient id="gemini_gradient_nexus" x1="-21" y1="-21" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4285F4" />
                        <stop offset="0.5" stopColor="#9b72cb" />
                        <stop offset="1" stopColor="#d96570" />
                    </linearGradient>

                    <linearGradient id="phone_body_nexus" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#bae6fd" />
                        <stop offset="50%" stopColor="#e0f2fe" />
                        <stop offset="100%" stopColor="#bae6fd" />
                    </linearGradient>

                    <linearGradient id="server_blade_nexus" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#dcfce7" />
                        <stop offset="50%" stopColor="#bbf7d0" />
                        <stop offset="100%" stopColor="#86efac" />
                    </linearGradient>
                </defs>

                <style>
                    {`
                        .dashed-path-nexus {
                            stroke-dasharray: 10 10;
                            animation: dash-flow-nexus 1s linear infinite;
                        }
                        @keyframes dash-flow-nexus {
                            from { stroke-dashoffset: 20; }
                            to { stroke-dashoffset: 0; }
                        }

                        .voice-bar-nexus {
                            animation: voice-bar-grow-nexus 0.4s ease-in-out infinite alternate;
                            transform-origin: center;
                            transform-box: fill-box;
                        }
                        @keyframes voice-bar-grow-nexus {
                            0% { transform: scaleY(0.4); }
                            100% { transform: scaleY(1.2); }
                        }

                        .led-blink-nexus { animation: blink-nexus 1.5s infinite; }
                        @keyframes blink-nexus {
                            0%, 100% { fill: #4ade80; opacity: 0.4; }
                            50% { fill: #22c55e; opacity: 1; }
                        }

                        .float-nexus {
                            animation: float-anim-nexus 3s ease-in-out infinite;
                        }
                        @keyframes float-anim-nexus {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-8px); }
                        }

                        .pulse-nexus {
                            animation: pulse-anim-nexus 2s ease-in-out infinite;
                        }
                        @keyframes pulse-anim-nexus {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                        }
                        
                        .packet-nexus {
                            transition: opacity 0.5s ease-in-out;
                        }
                    `}
                </style>

                {/* --- Static Paths --- */}
                <g opacity="0.4">
                    <path d="M 100 400 Q 250 200 400 300" fill="none" stroke="#236ac6ff" strokeWidth="2" strokeDasharray="5 5" />
                    <path d="M 400 300 Q 550 100 700 200" fill="none" stroke="#236ac6ff" strokeWidth="2" strokeDasharray="5 5" />
                    <path d="M 400 300 Q 550 500 700 450" fill="none" stroke="#236ac6ff" strokeWidth="2" strokeDasharray="5 5" />
                </g>

                {/* --- Active Paths (State Driven) --- */}
                {stage === AnimationStage.INPUT && (
                    <path d="M 100 400 Q 250 200 400 300" fill="none" stroke="#34d399" strokeWidth="3" className="dashed-path-nexus" />
                )}
                {(stage === AnimationStage.REASONING || stage === AnimationStage.SYNTHESIS) && (
                    <g>
                        <path d="M 400 300 Q 550 100 700 200" fill="none" stroke={stage === AnimationStage.REASONING ? "#c084fc" : "#fb7185"} strokeWidth="3" className="dashed-path-nexus" style={{ animationDirection: stage === AnimationStage.SYNTHESIS ? 'reverse' : 'normal' }} />
                        <path d="M 400 300 Q 550 500 700 450" fill="none" stroke={stage === AnimationStage.REASONING ? "#38bdf8" : "#818cf8"} strokeWidth="3" className="dashed-path-nexus" style={{ animationDirection: stage === AnimationStage.SYNTHESIS ? 'reverse' : 'normal' }} />
                    </g>
                )}
                {stage === AnimationStage.OUTPUT && (
                    <path d="M 400 300 Q 250 200 100 400" fill="none" stroke="#fbbf24" strokeWidth="3" className="dashed-path-nexus" />
                )}

                {/* --- Node 1: Smartphone (Left) --- */}
                <g transform="translate(100, 400)">
                    {/* Depth/Case shadow */}
                    <g transform="translate(0, 15)">
                        <g transform="scale(1.0, 0.5) rotate(45)">
                            <rect x="-70" y="-120" width="140" height="240" rx="24" fill="#bae6fd" />
                        </g>
                    </g>
                    {/* Surface */}
                    <g transform="scale(0.8, 0.4) rotate(45)">
                        {/* Case */}
                        <rect x="-70" y="-120" width="140" height="240" rx="24" fill="url(#phone_body_nexus)" stroke="#bae6fd" strokeWidth="2" />
                        {/* Screen */}
                        <rect x="-60" y="-110" width="120" height="220" rx="14" fill="#ffffff" />

                        {/* Interactive UI element on phone: Voice Bars */}
                        <g transform="translate(0, 40)">
                            {/* Title - Skewed with the plane for correct isometric look */}
                            <text x="0" y="-100" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="#077931ff" textAnchor="middle">Agri-Advisor</text>
                            <circle cx="0" cy="0" r="22" fill={(stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) ? '#34d399' : '#f8fafc'} stroke="#e2e8f0" strokeWidth="2" className={clsx((stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) && "pulse-nexus")} />
                            <g transform="translate(-12, 0)">
                                <rect x="0" y="-8" width="4" height="16" rx="2" fill={(stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) ? '#ffffff' : '#94a3b8'} className={clsx((stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) && "voice-bar-nexus")} />
                                <rect x="7" y="-12" width="4" height="24" rx="2" fill={(stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) ? '#ffffff' : '#94a3b8'} className={clsx((stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) && "voice-bar-nexus")} style={{ animationDelay: '0.1s' }} />
                                <rect x="14" y="-10" width="4" height="20" rx="2" fill={(stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) ? '#ffffff' : '#94a3b8'} className={clsx((stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) && "voice-bar-nexus")} style={{ animationDelay: '0.2s' }} />
                                <rect x="21" y="-6" width="4" height="12" rx="2" fill={(stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) ? '#ffffff' : '#94a3b8'} className={clsx((stage === AnimationStage.INPUT || stage === AnimationStage.OUTPUT) && "voice-bar-nexus")} style={{ animationDelay: '0.3s' }} />
                            </g>
                        </g>
                    </g>
                    <text y="120" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#236ac6" fontFamily="sans-serif">FARMER APP</text>
                </g>

                {/* --- Node 2: HUB / Orchestrator (Center) --- */}
                <g transform="translate(400, 300)">
                    <g className="float-nexus" transform="scale(2.0)">
                        {/* Stacked Blades */}
                        <g transform="translate(0, 20)">
                            <path d="M -40 -20 L 40 0 L 0 20 L -80 0 Z" fill="url(#server_blade_nexus)" stroke="#86efac" strokeWidth="1" />
                            <circle cx="-30" cy="5" r="3" className="led-blink-nexus" fill="#22c55e" />
                        </g>
                        <g transform="translate(0, 0)">
                            <path d="M -40 -20 L 40 0 L 0 20 L -80 0 Z" fill="url(#server_blade_nexus)" stroke="#86efac" strokeWidth="1" />
                            <circle cx="-30" cy="5" r="3" className="led-blink-nexus" fill="#22c55e" style={{ animationDelay: '0.2s' }} />
                        </g>
                        {/* Bottom Base */}
                        <g transform="translate(0, 40)">
                            <path d="M -40 -20 L 40 0 L 0 20 L -80 0 Z" fill="#bbf7d0" opacity="0.4" />
                        </g>
                        {/* Google Cloud Logo (Simplified) */}
                        <g transform="translate(-50, -100) scale(0.2)">
                            <path fill="#EA4335" d="M170.2517,56.8186 L192.5047,34.5656 L193.9877,25.1956 C153.4367,-11.6774 88.9757,-7.4964 52.4207,33.9196 C42.2667,45.4226 34.7337,59.7636 30.7167,74.5726 L38.6867,73.4496 L83.1917,66.1106 L86.6277,62.5966 C106.4247,40.8546 139.8977,37.9296 162.7557,56.4286 L170.2517,56.8186 Z" />
                            <path fill="#4285F4" d="M224.2048,73.9182 C219.0898,55.0822 208.5888,38.1492 193.9878,25.1962 L162.7558,56.4282 C175.9438,67.2042 183.4568,83.4382 183.1348,100.4652 L183.1348,106.0092 C198.4858,106.0092 210.9318,118.4542 210.9318,133.8052 C210.9318,149.1572 198.4858,161.2902 183.1348,161.2902 L127.4638,161.2902 L121.9978,167.2242 L121.9978,200.5642 L127.4638,205.7952 L183.1348,205.7952 C223.0648,206.1062 255.6868,174.3012 255.9978,134.3712 C256.1858,110.1682 244.2528,87.4782 224.2048,73.9182" />
                            <path fill="#34A853" d="M71.8704,205.7957 L127.4634,205.7957 L127.4634,161.2897 L71.8704,161.2897 C67.9094,161.2887 64.0734,160.4377 60.4714,158.7917 L52.5844,161.2117 L30.1754,183.4647 L28.2234,191.0387 C40.7904,200.5277 56.1234,205.8637 71.8704,205.7957" />
                            <path fill="#FBBC05" d="M71.8704,61.4255 C31.9394,61.6635 -0.2366,94.2275 0.0014,134.1575 C0.1344,156.4555 10.5484,177.4455 28.2234,191.0385 L60.4714,158.7915 C46.4804,152.4705 40.2634,136.0055 46.5844,122.0155 C52.9044,108.0255 69.3704,101.8085 83.3594,108.1285 C89.5244,110.9135 94.4614,115.8515 97.2464,122.0155 L129.4944,89.7685 C115.7734,71.8315 94.4534,61.3445 71.8704,61.4255" />
                        </g>
                    </g>
                    <text y="100" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#236ac6" fontFamily="sans-serif">ORCHESTRATOR</text>
                </g>

                {/* --- Node 3: Gemini (Top Right) --- */}
                <g transform="translate(700, 200)">
                    <g transform="scale(1.0)">
                        <circle cx="0" cy="0" r="55" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="2" />
                        <circle cx="0" cy="0" r="45" fill="#ddd6fe" />
                        <g className={clsx((stage === AnimationStage.REASONING || stage === AnimationStage.SYNTHESIS) && "pulse-nexus")}>
                            <path d="M 0 -21 C -4.5 -10.5 -10.5 -4.5 -21 0 C -10.5 4.5 -4.5 10.5 0 21 C 4.5 10.5 10.5 4.5 21 0 C 10.5 -4.5 4.5 -10.5 0 -21 Z" fill="url(#gemini_gradient_nexus)" />
                        </g>
                    </g>
                    <text y="100" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#64748b" fontFamily="sans-serif">GEMINI</text>
                </g>

                {/* --- Node 4: NeuralGCM (Bottom Right) --- */}
                <g transform="translate(700, 450)">
                    <g transform="scale(1.0)">
                        <circle cx="0" cy="0" r="55" fill="#f0fbff" stroke="#e0f2fe" strokeWidth="2" />
                        <circle cx="0" cy="0" r="45" fill="#bae6fd" />
                        <rect x="-18" y="-6" width="12" height="12" rx="2" fill="#0ea5e9" />
                        <rect x="6" y="-6" width="12" height="12" rx="2" fill="#0ea5e9" />
                        <rect x="-4" y="-8" width="8" height="16" rx="2" fill="#ffffff" stroke="#0ea5e9" strokeWidth="1" />
                        <circle cx="0" cy="-10" r="2" fill="#ef4444" className="led-blink-nexus" />
                    </g>
                    <text y="100" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#64748b" fontFamily="sans-serif">NEURAL-GCM</text>
                </g>

                {/* --- Animated Packets (State Driven) --- */}

                {/* Packet 1: Input (Smartphone -> HUB) */}
                {stage === AnimationStage.INPUT && (
                    <g>
                        <animateMotion dur="2.5s" repeatCount="indefinite" path="M 100 400 Q 250 200 400 300" />
                        <g transform="scale(0.8)">
                            <circle cx="0" cy="0" r="30" fill="#34d399" opacity="0.2" />
                            {/* Camera Icon */}
                            <g transform="translate(-10, 0) scale(0.6)">
                                <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#ffffff" />
                                <circle cx="0" cy="0" r="4" stroke="#34d399" strokeWidth="2" fill="none" />
                            </g>
                            {/* Voice Bars */}
                            <g transform="translate(10, 0) scale(0.5)">
                                <rect x="0" y="-10" width="3" height="20" rx="1.5" fill="#ffffff" className="voice-bar-nexus" />
                                <rect x="6" y="-6" width="3" height="12" rx="1.5" fill="#ffffff" className="voice-bar-nexus" style={{ animationDelay: '0.1s' }} />
                            </g>
                        </g>
                    </g>
                )}

                {/* Packet 2: Query (HUB -> Gemini/NeuralGCM) */}
                {stage === AnimationStage.REASONING && (
                    <g>
                        <g>
                            <animateMotion dur="1s" repeatCount="indefinite" path="M 400 300 Q 550 100 700 200" />
                            <circle cx="0" cy="0" r="10" fill="#c084fc" filter="url(#shadow-nexus)" />
                        </g>
                        <g>
                            <animateMotion dur="1s" repeatCount="indefinite" path="M 400 300 Q 550 500 700 450" />
                            <circle cx="0" cy="0" r="10" fill="#38bdf8" filter="url(#shadow-nexus)" />
                        </g>
                    </g>
                )}

                {/* Packet 3: Synthesis (Gemini/NeuralGCM -> HUB) */}
                {stage === AnimationStage.SYNTHESIS && (
                    <g>
                        <g>
                            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 700 200 Q 550 100 400 300" />
                            <circle cx="0" cy="0" r="12" fill="#c084fc" filter="url(#shadow-nexus)" />
                        </g>
                        <g>
                            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 700 450 Q 550 500 400 300" />
                            <circle cx="0" cy="0" r="12" fill="#38bdf8" filter="url(#shadow-nexus)" />
                        </g>
                    </g>
                )}

                {/* Packet 4: Response (HUB -> Smartphone) */}
                {stage === AnimationStage.OUTPUT && (
                    <g>
                        <animateMotion dur="2.5s" repeatCount="indefinite" path="M 400 300 Q 250 200 100 400" />
                        <g transform="scale(0.9)">
                            <text x="-30" y="5" fontFamily="monospace" fontSize="40" fontWeight="bold" fill="#fbbf24">{`{`}</text>
                            {/* Standardized Response Icons Stack */}
                            <g transform="translate(0, -5)">
                                <text x="0" y="-12" textAnchor="middle" fontSize="10" fontWeight="900" fill="#4285F4">abc</text>
                                <g transform="translate(0, 5) scale(0.5)">
                                    <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#EA4335" />
                                    <circle cx="0" cy="0" r="4" stroke="#ffffff" strokeWidth="2" fill="none" />
                                </g>
                                <g transform="translate(-6, 20) scale(0.5)">
                                    <rect x="0" y="-2" width="2" height="6" rx="1" fill="#FBBC05" className="voice-bar-nexus" />
                                    <rect x="4" y="-2" width="2" height="10" rx="1" fill="#FBBC05" className="voice-bar-nexus" style={{ animationDelay: '0.2s' }} />
                                    <rect x="8" y="-2" width="2" height="6" rx="1" fill="#FBBC05" className="voice-bar-nexus" style={{ animationDelay: '0.4s' }} />
                                </g>
                            </g>
                            <text x="25" y="5" fontFamily="monospace" fontSize="40" fontWeight="bold" fill="#fbbf24">{`}`}</text>
                        </g>
                    </g>
                )}
            </svg>

            {/* Status Overlay */}
            <div className="absolute bottom-6 left-0 w-full text-center">
                <p className={clsx(
                    "text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500",
                    stage === AnimationStage.IDLE ? "text-slate-400" :
                        stage === AnimationStage.INPUT ? "text-emerald-500" :
                            stage === AnimationStage.REASONING ? "text-purple-500" :
                                stage === AnimationStage.SYNTHESIS ? "text-rose-500" :
                                    "text-amber-500"
                )}>
                    {stage}
                </p>
            </div>
        </div>
    );
};
