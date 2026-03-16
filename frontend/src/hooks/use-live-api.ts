"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { CROP_MODELS } from "@/components/CultivationStageWidget";

export type FieldActivity = {
  crop?: string;
  stage: string;
  subStage: string;
  startDate?: string;
  endDate?: string;
  isLocked: boolean;
};

export type UseTurnBasedAPIResults = {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  playTTS: (text: string) => void;
  volume: number; // Simulated volume for UI
  audioElementRef: React.RefObject<HTMLAudioElement | null>;
  currentStage: string;
  setCurrentStage: (stage: string) => void;
  activities: FieldActivity[];
  crop: string;
  latestTranscript: string;
  latestToolData: any;
  latestAdvice: string;
  detailedPlan: any;
  latestImage?: string;
  latestBlueprint?: any;
  isGeneratingImage: boolean;
  updateActivity: (activity: FieldActivity) => void;
  updateCrop: (crop: string) => void;
  resetCultivation: () => void;
  processQuery: (text: string, imageBase64?: string | null) => Promise<void>;
};

export function useLiveAPI(options: { apiKey: string }): UseTurnBasedAPIResults {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [volume, setVolume] = useState(0);
  const [currentStage, setCurrentStage] = useState("Land Preparation");
  const [crop, setCrop] = useState("Rice");
  const [activities, setActivities] = useState<FieldActivity[]>([]);
  const [latestTranscript, setLatestTranscript] = useState("");
  const [latestToolData, setLatestToolData] = useState<any>(null);
  const [latestAdvice, setLatestAdvice] = useState("");
  const [detailedPlan, setDetailedPlan] = useState<any>(null);
  const [latestImage, setLatestImage] = useState<string | null>(null);
  const [latestBlueprint, setLatestBlueprint] = useState<any>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const lastStateRef = useRef<string>("");

  // 1. Fetch from FastAPI on mount
  useEffect(() => {
    async function hydrate() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        console.log(`Hydrating state from ${API_BASE}...`);
        const res = await fetch(`${API_BASE}/api/cultivation-state`);
        if (!res.ok) throw new Error(`Hydration failed: ${res.status}`);
        const data = await res.json();
        console.log("Hydrated state successfully:", data);
        if (data.currentStage) setCurrentStage(data.currentStage);
        if (data.crop) setCrop(data.crop);
        if (data.activities) setActivities(data.activities);
        lastStateRef.current = JSON.stringify({ currentStage: data.currentStage, crop: data.crop || "Rice", activities: data.activities });
      } catch (e) {
        console.error("Hydration Error:", e);
      } finally {
        setIsLoaded(true);
      }
    }
    hydrate();
  }, []);

  // 2. Persist to FastAPI on changes (with debouncing)
  useEffect(() => {
    if (!isLoaded) return;

    // Safety check: Don't persist if it matches the last hydrated/persisted state
    const currentStateStr = JSON.stringify({ currentStage, crop, activities });
    if (currentStateStr === lastStateRef.current) return;

    const timeoutId = setTimeout(async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        console.log("Persisting state to backend (debounced)...", { currentStage, crop, activities });
        const res = await fetch(`${API_BASE}/api/cultivation-state`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: currentStateStr
        });
        if (!res.ok) throw new Error(`Persistence failed: ${res.status}`);
        lastStateRef.current = currentStateStr;
        console.log("State persisted successfully.");
      } catch (e) {
        console.error("Persistence Error:", e);
      }
    }, 1000); // 1-second debounce

    return () => clearTimeout(timeoutId);
  }, [currentStage, crop, activities, isLoaded]);

  const updateActivity = useCallback((activity: FieldActivity) => {
    setActivities(prev => {
      const existing = prev.findIndex(a => a.stage === activity.stage && a.subStage === activity.subStage);
      if (existing > -1) {
        const next = [...prev];
        next[existing] = activity;
        return next;
      }
      return [...prev, activity];
    });
  }, []);

  const updateCrop = useCallback((newCrop: string) => {
    setCrop(newCrop);
    // Reset to the first stage of the new crop
    const firstStage = {
      "Rice": "Land Preparation",
      "Wheat": "Field Prep & Sowing",
      "Cotton": "Field Selection"
    }[newCrop] || "Land Preparation";
    setCurrentStage(firstStage);
  }, []);

  const resetCultivation = useCallback(() => {
    setActivities(prev => prev.filter(a => {
      const activityCrop = a.crop || "Rice";
      return activityCrop !== crop;
    }));
    const firstStage = {
      "Rice": "Land Preparation",
      "Wheat": "Field Prep & Sowing",
      "Cotton": "Field Selection"
    }[crop] || "Land Preparation";
    setCurrentStage(firstStage);
  }, [crop]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // No direct AI client in frontend anymore

  // TOOLS and Dynamic Instructions moved to Backend

  const playTTS = useCallback((text: string) => {
    try {
      if (!window.speechSynthesis) {
        console.error("SpeechSynthesis API not supported in this browser.");
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Try to find a good female English or Indian English voice for "Navratna"
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-IN') && v.name.includes('Female')) ||
        voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 1.05; // Slightly faster for natural feel
      utterance.pitch = 1.1; // Slightly higher

      utterance.onstart = () => {
        // Simulate volume pulse for UI while speaking
        const pulse = () => {
          if (window.speechSynthesis.speaking) {
            setVolume(0.3 + Math.random() * 0.4); // Random pulse between 0.3 and 0.7
            animationFrameRef.current = requestAnimationFrame(pulse);
          } else {
            setVolume(0);
          }
        };
        pulse();
      };

      utterance.onend = () => {
        setVolume(0);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };

      utterance.onerror = (e) => {
        console.error("TTS Error:", e);
        setVolume(0);
      };

      window.speechSynthesis.speak(utterance);

    } catch (e) {
      console.error("Error playing TTS:", e);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Tool calls handled by backend

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        const mimeType = audioBlob.type || 'audio/webm';

        console.log("Sending audio to Backend Orchestrator (Vertex AI)...");

        try {
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const res = await fetch(`${API_BASE}/api/process-audio`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audio_base64: base64data,
              mime_type: mimeType,
              crop: crop,
              current_stage: currentStage,
              sub_stage: (() => {
                const stageSubs = CROP_MODELS[crop]?.subStages[currentStage] || [];
                return stageSubs.find(sub => !activities.find(a => a.stage === currentStage && a.subStage === sub && a.isLocked)) || stageSubs[0] || "General";
              })(),
              current_activities: activities,
              simulation_mode: document.body.classList.contains('demo-mode-active'),
              location_context: { lat: 10.787, lon: 79.137 } // Dynamic from client (Thanjavur Demo Site)
            })
          });

          if (!res.ok) throw new Error(`Backend process failed: ${res.status}`);

          const data = await res.json();
          console.log("Backend response received:", data);

          if (data.status === "success") {
            if (data.text) {
              setLatestAdvice(data.text);
              playTTS(data.text);
            }

            if (data.detailed_plan) {
              setDetailedPlan(data.detailed_plan);
            }

            if (data.updated_stage) {
              setCurrentStage(data.updated_stage);
            }

            if (data.tool_data) {
              setLatestToolData(data.tool_data);
            }

            if (data.is_generating_image) {
              if (data.asset_url) setLatestImage(data.asset_url);
              if (data.blueprint) setLatestBlueprint(data.blueprint);
            } else {
              // Reset visual states if no new image
              setLatestImage(null);
              setLatestBlueprint(null);
            }
          } else {
            console.error("Backend returned error:", data.message);
          }

        } catch (e) {
          console.error("Fetch Error:", e);
        } finally {
          setIsProcessing(false);
        }
      };
    } catch (e) {
      console.error("Error processing audio query:", e);
      setIsProcessing(false);
    }
  };

  const processQuery = async (text: string, imageBase64?: string | null) => {
    setIsProcessing(true);
    try {
      console.log("Sending multimodal query to Backend Orchestrator (Vertex AI)...");
      const payload: any = {
        text_query: text,
        crop: crop,
        current_stage: currentStage,
        sub_stage: (() => {
          const stageSubs = CROP_MODELS[crop]?.subStages[currentStage] || [];
          return stageSubs.find(sub => !activities.find(a => a.stage === currentStage && a.subStage === sub && a.isLocked)) || stageSubs[0] || "General";
        })(),
        current_activities: activities,
        simulation_mode: document.body.classList.contains('demo-mode-active'),
        location_context: { lat: 10.787, lon: 79.137 } // Dynamic from client (Thanjavur Demo Site)
      };

      if (imageBase64) {
        payload.image_base64 = imageBase64;
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/api/process-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Backend process failed: ${res.status}`);

      const data = await res.json();
      console.log("Backend response received:", data);

      if (data.status === "success") {
        if (data.text) {
          setLatestAdvice(data.text);
          playTTS(data.text);
        }

        if (data.detailed_plan) {
          setDetailedPlan(data.detailed_plan);
        }

        if (data.updated_stage) {
          setCurrentStage(data.updated_stage);
        }

        if (data.tool_data) {
          setLatestToolData(data.tool_data);
        }

        if (data.is_generating_image) {
          if (data.asset_url) setLatestImage(data.asset_url);
          if (data.visual_blueprint) setLatestBlueprint(data.visual_blueprint);
        } else {
          setLatestImage(null);
          setLatestBlueprint(null);
        }
      } else {
        console.error("Backend returned error:", data.message);
      }
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Clean up mic
      };

      mediaRecorder.start();
      setIsRecording(true);
      setLatestTranscript("");
      setLatestToolData(null);
      setLatestAdvice("");
      setDetailedPlan(null);
      setLatestImage(null);

      // Simple simulated input volume for UI feedback
      setVolume(0.5);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setVolume(0);
    }
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    playTTS,
    volume,
    audioElementRef,
    currentStage,
    setCurrentStage,
    activities,
    crop,
    latestTranscript,
    latestToolData,
    latestAdvice,
    detailedPlan,
    latestImage: latestImage || undefined,
    latestBlueprint: latestBlueprint || undefined,
    isGeneratingImage,
    updateActivity,
    updateCrop,
    resetCultivation,
    processQuery
  };
}
