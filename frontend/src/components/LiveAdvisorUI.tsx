"use client";

import React, { useState } from "react";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { FaMicrophone, FaStop, FaSpinner, FaBolt } from "react-icons/fa";
import clsx from "clsx";

export default function LiveAdvisorUI() {
    const {
        isRecording,
        isProcessing,
        startRecording,
        stopRecording,
        volume,
        audioElementRef,
        currentStage
    } = useLiveAPIContext() as any; // Cast for now due to Context TS changes

    const [isHovered, setIsHovered] = useState(false);

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else if (!isProcessing) {
            startRecording();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white text-gray-800 w-full rounded-2xl">
            {/* Hidden audio element for playback */}
            <audio ref={audioElementRef} className="hidden" />

            <div className="relative flex items-center justify-center mb-10 w-48 h-48">
                {/* Dynamic Voice Indicator Ring (Listening or Speaking) */}
                <div
                    className={clsx(
                        "absolute inset-0 rounded-full bg-green-200 opacity-30 transition-all duration-75",
                        (isRecording || volume > 0) ? "animate-pulse" : "hidden"
                    )}
                    style={{
                        transform: `scale(${1 + volume * 5})`, // Amplify volume for vis
                        opacity: Math.min(0.8, 0.3 + volume * 2)
                    }}
                />

                <button
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={clsx(
                        "relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center text-white text-4xl shadow-2xl transition-all duration-300",
                        isProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : isRecording
                                ? "bg-red-500 hover:bg-red-600 hover:scale-105"
                                : "bg-gradient-to-br from-green-500 to-emerald-700 hover:from-green-400 hover:to-emerald-600 hover:scale-105"
                    )}
                >
                    {isProcessing ? (
                        <FaSpinner className="animate-spin" />
                    ) : isRecording ? (
                        <FaStop />
                    ) : (
                        <FaMicrophone />
                    )}
                </button>
            </div>

            <div className="text-center w-full max-w-sm space-y-4 h-24">
                <h2 className="text-2xl font-bold flex flex-col items-center justify-center gap-2">
                    <span className="text-gray-600 text-sm font-normal uppercase tracking-wider">Status</span>
                    <span className={clsx(
                        isProcessing ? "text-amber-500" :
                            isRecording ? "text-red-500" :
                                volume > 0 ? "text-green-600" : "text-gray-400"
                    )}>
                        {isProcessing ? "Navratna is thinking..." :
                            isRecording ? "Listening to you..." :
                                volume > 0 ? "Navratna is speaking..." : "Tap mic to speak"}
                    </span>
                </h2>
                {(isRecording || isProcessing || volume > 0) && (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 py-2 px-4 rounded-full text-sm font-medium border border-emerald-100 mx-auto w-max">
                        <FaBolt className="animate-pulse" /> NeuralGCM Link Active
                    </div>
                )}
            </div>
        </div>
    );
}
