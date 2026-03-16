"use client";
import React, { useEffect, useState, useRef } from "react";
import clsx from 'clsx';
import 'regenerator-runtime/runtime';
import Link from "next/link";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaArrowLeft, FaArrowRight, FaHistory, FaBrain, FaCamera, FaMicrophone, FaRegImages, FaVolumeUp, FaPause, FaPlay, FaQuoteLeft } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";
import Image from "next/image";
import CultivationStageWidget, { CROP_MODELS } from "@/components/CultivationStageWidget";
import { AgriIntelligenceFeed } from "@/components/AgriIntelligenceFeed";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { NexusAnimation } from "@/components/NexusAnimation";
import NotebookLMInfographic from "@/components/NotebookLMInfographic";
import * as htmlToImage from 'html-to-image';
import ReactMarkdown from 'react-markdown';

function getSummary(text: string, maxSentences: number = 3) {
  if (!text) return "";
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  if (sentences.length <= maxSentences) return text;
  return sentences.slice(0, maxSentences).join(" ").trim() + "...";
}

export default function LiveAgriAdvisor() {
  const context = useLiveAPIContext();
  const { activities, currentStage, crop, processQuery, isProcessing, latestAdvice, detailedPlan, latestImage: generatedImage, latestTranscript, updateActivity, latestBlueprint } = context as any;
  const lockedActivities = activities?.filter((a: any) => a.isLocked && (a.crop === crop || !a.crop)) || [];

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const infographicRef = React.useRef<HTMLDivElement>(null);

  const [isInfographicView, setIsInfographicView] = useState(false);

  const playAudio = (text: string, segmentId: string = "global") => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop currently playing
      setIsPlayingAudio(true);
      setIsAudioPaused(false);
      setActiveSegment(segmentId);
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance; // Prevent garbage collection bug
      utterance.rate = 1.0;
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setActiveSegment(null);
      };
      utterance.onerror = (e) => {
        console.error("TTS Error:", e);
        setIsPlayingAudio(false);
        setActiveSegment(null);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const saveInfographic = async () => {
    if (infographicRef.current === null) return;
    try {
      const dataUrl = await htmlToImage.toPng(infographicRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0f172a'
      });
      const link = document.createElement('a');
      link.download = `agri-advice-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Snapshot error:', err);
      alert('Failed to save infographic. Please try again.');
    }
  };

  const toggleAudioPause = () => {
    if ('speechSynthesis' in window) {
      if (isAudioPaused) {
        window.speechSynthesis.resume();
        setIsAudioPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsAudioPaused(true);
      }
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
      setActiveSegment(null);
    }
  };

  // Stop audio when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      stopAudio();
    }
  }, [isModalOpen]);

  // react-speech-recognition implementation
  const [baseText, setBaseText] = useState("");
  const {
    transcript,
    listening: isListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const prevIsProcessingRef = useRef<boolean>(isProcessing);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser doesn't support speech recognition. Try Google Chrome.");
      return;
    }

    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      // Clear transcript before starting fresh
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true
      });
    }
  };

  // Automatically absorb transcript into baseText when listening stops
  useEffect(() => {
    if (!isListening && transcript) {
      setBaseText((prev) => prev + (prev && transcript ? " " : "") + transcript);
      resetTranscript();
    }
  }, [isListening, transcript, resetTranscript]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBaseText(e.target.value);
    resetTranscript();
  };

  const currentDisplayValue = baseText + (baseText && transcript ? " " : "") + transcript;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const cropModel = CROP_MODELS[crop] || CROP_MODELS["Rice"];
  const [selectedViewStage, setSelectedViewStage] = useState<string>(currentStage || cropModel.stages[0]);

  useEffect(() => {
    if (currentStage) {
      setSelectedViewStage(currentStage);
    }
  }, [currentStage]);

  // Sync selectedViewStage when crop changes
  useEffect(() => {
    if (!cropModel.stages.includes(selectedViewStage)) {
      setSelectedViewStage(cropModel.stages[0]);
    }
  }, [crop, cropModel.stages, selectedViewStage]);

  // Phase 66 & 70: Guarded auto-clear inputs after advice generation
  useEffect(() => {
    if (!isProcessing && latestAdvice && prevIsProcessingRef.current === true) {
      setBaseText("");
      resetTranscript();
      setUploadedImage(null);
    }
    prevIsProcessingRef.current = isProcessing;
  }, [isProcessing, latestAdvice, resetTranscript]);

  const MarkdownStyles = (
    <style jsx global>{`
      .markdown-content ul {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin-bottom: 0.75rem;
      }
      .markdown-content li {
        margin-bottom: 0.25rem;
      }
      .markdown-content p {
        margin-bottom: 0.5rem;
      }
      .markdown-content strong {
        font-weight: 800;
        color: inherit;
      }
    `}</style>
  );

  return (
    <div className="p-4 max-w-full mx-auto h-[calc(100vh-80px)] flex flex-col gap-4 overflow-hidden">
      {MarkdownStyles}
      {/* 1. Header (Compact) */}
      <div className="flex items-center justify-between w-full shrink-0 px-2">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold text-xs transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          BACK TO HUB
        </Link>
        <div className="text-center">
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Voice-First Intelligent Assistant powered by Gemini & NeuralGCM.
          </p>
        </div>
        <div className="w-20"></div> {/* Spacer for balance */}
      </div>

      {/*{isProcessing && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-emerald-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500 flex items-center gap-4">
          <div className="flex gap-1.5 item-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
          </div>
        </div>
      )} */}
      <div className="grid grid-cols-1 xl:grid-cols-10 grid-rows-[1fr_auto] gap-4 flex-grow min-h-0">
        {/* Column 1: Left Side-Bar (30%) - Full Height */}
        <div className="xl:col-span-3 xl:row-span-2 h-full min-h-0">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <span className="text-lg">⚡</span> Quick Actions
            </h3>

            <div className="flex-grow flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 min-h-0">
              {/* Image Preview Thumbnail */}
              {uploadedImage && (
                <div className="relative w-full h-100 rounded-2xl overflow-hidden border border-slate-200 mt-2 group animate-in fade-in zoom-in duration-300">
                  <img src={uploadedImage} alt="Uploaded field condition" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* 1. Image Upload / Camera */}
              <div className="flex flex-col gap-4">
                {/* Informational Upload Embedding (Static) */}
                {/* <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all">
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                    <MdAddAPhoto className="text-3xl" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Upload Image</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Supports: JPG, PNG</p>
                  </div>
                </div> */}

                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    ref={cameraInputRef}
                    onChange={handleImageFile}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={uploadInputRef}
                    onChange={handleImageFile}
                  />
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <FaCamera className="text-2xl text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Take Photo</span>
                  </button>
                  <button
                    onClick={() => uploadInputRef.current?.click()}
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <FaRegImages className="text-2xl text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Gallery</span>
                  </button>
                </div>
              </div>

              {/* 2. Voice / Text Input */}
              <div className="relative mt-2">
                <textarea
                  value={currentDisplayValue}
                  onChange={handleTextChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-12 text-sm text-slate-700 placeholder:text-slate-400 resize-none outline-none focus:ring-2 focus:ring-amber-200 transition-all h-28"
                  placeholder="Describe your current field conditions or crop health..."
                ></textarea>
                <button
                  onClick={toggleListening}
                  className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening
                    ? "bg-red-100 text-red-600 animate-pulse hover:bg-red-200"
                    : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                    }`}
                  title={isListening ? "Stop Listening" : "Start Voice Input"}
                >
                  <FaMicrophone className={isListening ? "animate-bounce" : ""} />
                </button>
              </div>
            </div>

            {/* 3. Ask Advice Button (Fixed at bottom) */}
            <div className="mt-auto pt-2 shrink-0">
              <button
                onClick={() => {
                  if (isListening) toggleListening();
                  processQuery(currentDisplayValue, uploadedImage);
                }}
                disabled={isProcessing || (!currentDisplayValue && !uploadedImage)}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm shadow-[0_6px_0_0_#334155] hover:shadow-[0_3px_0_0_#334155] hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
              >
                {isProcessing ? "PROCESSING..." : "ASK ADVICE"}
                {isProcessing ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                ) : (
                  <FaArrowRight />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Center Stage (50%) - Clean Slate for processing SVG animation */}
        <div className="xl:col-span-5 h-full min-h-0 xl:col-start-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 h-full flex flex-col justify-center text-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

            {/* Move button to top-right corner */}
            {latestAdvice && !isProcessing && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-8 right-10 z-20 bg-emerald-100/80 backdrop-blur-sm hover:bg-emerald-200 text-emerald-700 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 hover:scale-105 active:scale-95 border border-emerald-200/50"
              >
                <FaBrain className="text-sm" /> View Detailed Advice
              </button>
            )}

            {/* Status & Summary Overlay (Top Left) */}
            <div className="absolute top-8 left-10 z-20 text-left space-y-2 max-w-[280px]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <span className={clsx("w-2 h-2 rounded-full", isProcessing ? "bg-emerald-500 animate-pulse" : "bg-slate-300")}></span>
                Intelligence Nexus
              </h3>
              <div className="flex items-start gap-3">
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm overflow-y-auto max-h-[80px] custom-scrollbar">
                  {isProcessing ? (
                    <span className="animate-pulse text-emerald-600 font-bold">Navratna is orchestrating analysis with Gemini & NeuralGCM...</span>
                  ) : latestAdvice ? (
                    <span className="text-slate-800">{latestAdvice}</span>
                  ) : (
                    "Awaiting visual or textual input to commence advice processing..."
                  )}
                </p>
                {latestAdvice && !isProcessing && (
                  <button
                    onClick={() => playAudio(latestAdvice)}
                    className={`mt-2 shrink-0 ${isPlayingAudio ? "text-emerald-500 animate-pulse" : "text-slate-400 hover:text-emerald-600 transition-colors"}`}
                    title="Play Audio"
                  >
                    <FaVolumeUp className="text-lg" />
                  </button>
                )}
              </div>
            </div>

            <NexusAnimation isProcessing={isProcessing} latestAdvice={latestAdvice} />


            {/* Detailed Advice Modal - Fixed to Viewport for Central Ordering */}
            {isModalOpen && latestAdvice && (
              <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 transition-all">
                <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 text-left relative">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/95 backdrop-blur-sm sticky top-0 z-10 shrink-0">
                    <h3 className="font-black text-slate-800 text-[1.1rem] flex items-center gap-2">
                      <FaBrain className="text-purple-500 text-xl" /> Detailed Action Plan
                    </h3>
                    {isPlayingAudio && (
                      <button
                        onClick={toggleAudioPause}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                        title={isAudioPaused ? "Resume" : "Pause"}
                      >
                        {isAudioPaused ? <FaPlay className="ml-1" /> : <FaPause />}
                      </button>
                    )}

                    {detailedPlan && generatedImage && (
                      <button
                        onClick={() => setIsInfographicView(!isInfographicView)}
                        className={clsx(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-sm border",
                          isInfographicView
                            ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            : "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700"
                        )}
                      >
                        <FaRegImages /> {isInfographicView ? "Back to Text" : "Generate Infographic"}
                      </button>
                    )}

                    {isInfographicView && (
                      <button
                        onClick={saveInfographic}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase bg-slate-900 text-white border border-slate-800 hover:bg-slate-800 transition-all shadow-sm"
                      >
                        <FaArrowRight className="rotate-90" /> Save PNG
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsInfographicView(false);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar text-left flex-grow flex flex-col items-center">
                    {isInfographicView && generatedImage ? (
                      <div className="w-full flex justify-center py-4">
                        {(() => {
                          const fusionBlueprint = {
                            layout_type: latestBlueprint?.layout_type || "split_pane_detailed",
                            theme: latestBlueprint?.theme || "safe",
                            typography: latestBlueprint?.typography || {
                              headline: "Agronomic Advice",
                              subtext: getSummary(latestAdvice, 2),
                              action_badge: "AI ANALYSIS"
                            },
                            action_items: latestBlueprint?.action_items || []
                          };

                          // SMART SYNC: Pull from detailedPlan if blueprint items are empty
                          if (fusionBlueprint.action_items.length === 0 && detailedPlan) {
                            fusionBlueprint.action_items = Object.entries(detailedPlan).map(([category, instruction]) => ({
                              category: String(category),
                              instruction: String(instruction)
                            })).slice(0, 4);
                          }

                          return (
                            <div className="scale-[0.85] origin-top">
                              <NotebookLMInfographic
                                ref={infographicRef}
                                blueprint={fusionBlueprint as any}
                                imagenBackgroundUrl={generatedImage}
                              />
                            </div>
                          );
                        })()}
                      </div>
                    ) : detailedPlan ? (
                      <div className="flex flex-col gap-6 w-full">
                        {latestTranscript && (
                          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 relative group">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                <FaQuoteLeft className="opacity-50" /> Farmer Input (Audio Transcribed)
                              </h4>
                              <button
                                onClick={() => activeSegment === 'transcript' && !isAudioPaused ? toggleAudioPause() : playAudio(latestTranscript, 'transcript')}
                                className={clsx(
                                  "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                  activeSegment === 'transcript' ? "bg-emerald-100 text-emerald-600 animate-pulse" : "bg-white text-slate-400 hover:text-emerald-500 shadow-sm"
                                )}
                              >
                                {activeSegment === 'transcript' && !isAudioPaused ? <FaPause className="text-[8px]" /> : <FaPlay className="text-[8px] ml-0.5" />}
                              </button>
                            </div>
                            <p className="text-[13px] text-slate-700 leading-relaxed font-medium italic">
                              "{latestTranscript}"
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(detailedPlan).map(([key, value]: [string, any]) => (
                            <div key={key} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group relative">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className={clsx(
                                  "text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                                  key.includes('Nutrient') ? "text-emerald-600" :
                                    key.includes('Pest') ? "text-amber-600" :
                                      key.includes('Water') ? "text-blue-600" : "text-purple-600"
                                )}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                  {key}
                                </h4>
                                <button
                                  onClick={() => activeSegment === key && !isAudioPaused ? toggleAudioPause() : playAudio(value as string, key)}
                                  className={clsx(
                                    "w-6 h-6 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100",
                                    activeSegment === key ? "bg-white text-emerald-600 opacity-100" : "bg-white text-slate-400 hover:text-emerald-500 shadow-sm"
                                  )}
                                >
                                  {activeSegment === key && !isAudioPaused ? <FaPause className="text-[8px]" /> : <FaPlay className="text-[8px] ml-0.5" />}
                                </button>
                              </div>
                              <div className="text-[13px] text-slate-700 leading-relaxed font-medium markdown-content">
                                <ReactMarkdown>{value as string}</ReactMarkdown>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm prose-slate max-w-none w-full">
                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-[13px] font-medium markdown-content">
                          <ReactMarkdown>{latestAdvice}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100 flex justify-end shrink-0 sticky bottom-0">
                    <button onClick={() => setIsModalOpen(false)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-wide hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                      Understood
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Right Side-Bar (20%) - Historical Journal */}
        <div className="xl:col-span-2 h-full min-h-0">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 h-full overflow-y-auto custom-scrollbar relative">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FaHistory /> Milestone Achievements
              </h3>
              <Link href="/live-agri-advisor/history" className="text-[9px] font-black uppercase text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
                View All <FaArrowRight className="text-[8px]" />
              </Link>
            </div>
            {lockedActivities.length > 0 ? (
              <ul className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {lockedActivities.slice().reverse().map((a: any, i: number) => (
                  <li key={i} className="relative pl-6 group">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 z-10 transition-transform group-hover:scale-125"></div>
                    <div className="flex flex-col">
                      <div className="font-bold text-[11px] text-slate-800 leading-tight">{a.subStage}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Stage: {a.stage}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-slate-500 text-[9px] font-bold">
                          {a.endDate ? new Date(a.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Recently"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaHistory className="text-slate-200 text-xl" />
                </div>
                <p className="text-[10px] text-slate-400 italic">No events recorded.</p>
              </div>
            )}
          </div>
        </div>
        {/* Bottom Section: Cultivation Widget (70% width, under Col 2 & 3) */}
        <div className="xl:col-span-7 xl:col-start-4 xl:row-start-2 w-full pt-2">
          <CultivationStageWidget
            selectedViewStage={selectedViewStage}
            setSelectedViewStage={setSelectedViewStage}
          />
        </div>
      </div>
    </div>
  );
}
