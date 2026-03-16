"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { useLiveAPIContext } from "@/contexts/LiveAPIContext";
import { FaLock, FaCheckCircle, FaChevronRight, FaChevronDown, FaHistory } from "react-icons/fa";

export const CROP_MODELS: Record<string, { stages: string[]; subStages: Record<string, string[]> }> = {
    "Rice": {
        stages: ["Land Preparation", "Nursery Management", "Transplantation", "Nutrient/Pest Management", "Water Management", "Harvesting"],
        subStages: {
            "Land Preparation": ["Ploughing", "Flooding", "Puddling & Levelling"],
            "Nursery Management": ["Seed Treatment", "Bed Preparation", "Sowing"],
            "Transplantation": ["Pulling Seedlings", "Spacing Control", "Water Depth Adj"],
            "Nutrient/Pest Management": ["Urea Basal Dose", "Zinc Application", "Weed Control"],
            "Water Management": ["Intermittent Irrigation", "Drainage Flow", "Pest Check"],
            "Harvesting": ["Threshing", "Drying", "Transport"]
        }
    },
    "Wheat": {
        stages: ["Field Prep & Sowing", "First Irrigation (CRI)", "Tillering & Jointing", "Flowering & Grain Filling", "Maturity", "Harvesting"],
        subStages: {
            "Field Prep & Sowing": ["Land Levelling", "Pre-sowing Irrigation", "Sowing & Seed Treatment"],
            "First Irrigation (CRI)": ["Irrigation at 21 Days", "First Urea Application", "Weed Control"],
            "Tillering & Jointing": ["Second Irrigation", "Second Urea Dose", "Stem Elongation Check"],
            "Flowering & Grain Filling": ["Third Irrigation", "Rust Monitoring", "Irrigation at Anthesis"],
            "Maturity": ["Forth Irrigation", "Grain Hardening Check", "Straw Moisture Check"],
            "Harvesting": ["Combine Harvesting", "Grain Storage", "Post-Harvest Handling"]
        }
    },
    "Cotton": {
        stages: ["Field Selection", "Sowing & Germination", "Square & Flowering", "Boll Development", "Boll Bursting", "Picking"],
        subStages: {
            "Field Selection": ["Soil Testing", "Deep Ploughing", "Basal Fertilizer"],
            "Sowing & Germination": ["Sowing Technique", "Thinning", "Gap Filling"],
            "Square & Flowering": ["Growth Regulator Use", "Pest Scouting", "Side-dressing Urea"],
            "Boll Development": ["Irrigation Management", "Bollworm Control", "Foliar Spray"],
            "Boll Bursting": ["Defoliation (Optional)", "Locking Monitoring", "Picking Prep"],
            "Picking": ["First Picking", "Second Picking", "Storage & Cleaning"]
        }
    }
};

export function StageNavigation({
    selectedViewStage,
    setSelectedViewStage
}: {
    selectedViewStage: string;
    setSelectedViewStage: (s: string) => void;
}) {
    const context = useLiveAPIContext();
    const { currentStage: contextStage, activities, crop: contextCrop, updateCrop } = context as any;

    const cropModel = CROP_MODELS[contextCrop] || CROP_MODELS["Rice"];
    const activeStage = contextStage || cropModel.stages[0];

    const activeIndex = cropModel.stages.indexOf(activeStage);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col p-4 min-h-0">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-sm">🌱</span> Cultivation Life-Cycle
                </h2>
                {/* Crop Selector Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    {Object.keys(CROP_MODELS).map(c => (
                        <button
                            key={c}
                            onClick={() => updateCrop(c)}
                            className={clsx(
                                "py-0.5 px-2 text-[9px] font-black uppercase tracking-wider rounded-md transition-all",
                                contextCrop === c ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-row overflow-x-auto custom-scrollbar space-x-4 pb-2 relative items-center">
                {cropModel.stages.map((stage, index) => {
                    const isActive = activeStage === stage;
                    const isFocused = selectedViewStage === stage;
                    const isDone = index < activeIndex;
                    const stageActivities = activities?.filter((a: any) => a.stage === stage) || [];
                    const isFullyLocked = stageActivities.length > 0 && stageActivities.every((a: any) => a.isLocked);

                    return (
                        <React.Fragment key={stage}>
                            <div
                                onClick={() => setSelectedViewStage(stage)}
                                className={clsx(
                                    "flex flex-col items-center justify-center relative min-w-[90px] p-2 rounded-2xl cursor-pointer transition-all duration-200 group text-center",
                                    isFocused ? "bg-amber-50 shadow-sm ring-1 ring-amber-200" : "hover:bg-slate-50",
                                    index > activeIndex && "opacity-60"
                                )}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 mb-1",
                                    isActive
                                        ? "bg-amber-400 border-amber-500 shadow-lg text-white transform scale-110"
                                        : (isDone || isFullyLocked)
                                            ? "bg-emerald-500 border-emerald-600 text-white"
                                            : "bg-white border-slate-200 text-slate-300"
                                )}>
                                    {(isDone || isFullyLocked) ? <FaCheckCircle className="text-sm" /> : <span className="font-bold text-[10px]">{index + 1}</span>}
                                </div>

                                <div className={clsx(
                                    "font-bold text-[14px] leading-tight",
                                    isFocused ? "text-amber-700" : "text-slate-600"
                                )}>
                                    {stage}
                                </div>
                                {isActive ? (
                                    <div className="text-[10px] text-amber-500 font-black uppercase mt-0.5">Active</div>
                                ) : isDone ? (
                                    <div className="text-[10px] text-emerald-500 font-black uppercase mt-0.5">Done</div>
                                ) : (
                                    <div className="text-[10px] text-slate-300 font-black uppercase mt-0.5 tracking-tighter">Locked</div>
                                )}
                            </div>
                            {index < cropModel.stages.length - 1 && (
                                <FaChevronRight className="text-slate-200 text-xs shrink-0 mx-1" />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

export function StageDetails({
    selectedViewStage
}: {
    selectedViewStage: string;
}) {
    const context = useLiveAPIContext();
    const { currentStage: contextStage, activities, updateActivity, crop: contextCrop, setCurrentStage } = context as any;

    const cropModel = CROP_MODELS[contextCrop] || CROP_MODELS["Rice"];
    const activeCrop = contextCrop || "Rice";
    const activeStage = contextStage || cropModel.stages[0];

    const activeIndex = cropModel.stages.indexOf(activeStage);
    const viewIndex = cropModel.stages.indexOf(selectedViewStage);

    const isPrevious = viewIndex < activeIndex;
    const isCurrent = viewIndex === activeIndex;
    const isNext = viewIndex > activeIndex;

    const activeStageSubs = cropModel.subStages[activeStage] || [];
    const activeSubStageIndex = activeStageSubs.findIndex(sub => {
        const activity = activities?.find((a: any) => a.stage === activeStage && a.subStage === sub && (a.crop === activeCrop || !a.crop));
        return !activity?.isLocked;
    });

    return (
        <div className="bg-slate-50 rounded-3xl shadow-inner border border-slate-200 p-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-sm font-black text-slate-800 leading-tight">{selectedViewStage} Sub-Stages :
                        <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mt-0.5">
                            {isPrevious ? "  Historical Logs (Read Only)" : isCurrent ? "  Active Log Entry (Editable)" : "  Restricted (Next Stage)"}
                        </span>
                    </h3>
                </div>
                {isPrevious && <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">Verified</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-y-auto max-h-[220px] custom-scrollbar">
                {cropModel.subStages[selectedViewStage]?.map((sub, index) => {
                    const subKey = `${selectedViewStage}-${sub}`;
                    const isCurrentActiveSub = isCurrent && index === activeSubStageIndex;

                    const activity = activities?.find((a: any) => a.stage === selectedViewStage && a.subStage === sub && (a.crop === activeCrop || !a.crop));
                    const isLocked = activity?.isLocked;
                    const isFutureSub = (isCurrent && index > activeSubStageIndex) || isNext;
                    const isDisabled = isPrevious || isLocked || isFutureSub;

                    return (
                        <div key={sub} className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex flex-col gap-2">
                            {/* Header Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={clsx(
                                        "w-1.5 h-1.5 rounded-full",
                                        isPrevious || (isCurrent && index < activeSubStageIndex) ? "bg-emerald-500" : isCurrentActiveSub ? "bg-amber-500 animate-pulse" : "bg-slate-300"
                                    )}></div>
                                    <span className={clsx(
                                        "text-xs font-bold",
                                        isFutureSub ? "text-slate-400" : "text-slate-700"
                                    )}>{sub}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {(isLocked || isPrevious || (isCurrent && index < activeSubStageIndex)) && <FaLock className="text-emerald-500 text-[9px]" />}
                                    {isFutureSub && <FaLock className="text-slate-300 text-[9px]" />}
                                </div>
                            </div>

                            {/* Action/Status Area */}
                            <div className="flex items-center justify-between mt-1">
                                {(isPrevious || (isCurrent && index < activeSubStageIndex)) ? (
                                    <div className="w-full flex justify-between items-center bg-emerald-50 px-2 py-1.5 rounded border border-emerald-100 group">
                                        <div className="flex flex-col">
                                            <p className="text-[9px] font-black tracking-wider text-emerald-700 uppercase">Completed</p>
                                            <p className="text-[9px] font-bold text-emerald-600">
                                                {activity?.endDate ? new Date(activity.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "-"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Reset "${sub}"? This will move your active focus back to this step.`)) {
                                                    updateActivity({ ...activity, isLocked: false, endDate: undefined });
                                                    if (selectedViewStage !== contextStage) {
                                                        setCurrentStage(selectedViewStage);
                                                    }
                                                }
                                            }}
                                            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 bg-white border border-emerald-200 text-emerald-700 rounded text-[8px] font-black uppercase tracking-tighter hover:bg-emerald-100 transition-all shadow-sm"
                                        >
                                            <FaHistory className="text-[9px]" /> Reset
                                        </button>
                                    </div>
                                ) : isFutureSub ? (
                                    <div className="w-full flex justify-center items-center bg-slate-50 px-2 py-1.5 rounded border border-slate-100">
                                        <p className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Locked (Pending)</p>
                                    </div>
                                ) : (
                                    <div className="w-full flex items-center justify-between gap-2">
                                        {!activity?.startDate ? (
                                            <>
                                                <p className="text-[9px] text-slate-400 font-medium">Ready to begin</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const now = new Date().toISOString();
                                                        updateActivity({ ...activity, crop: activeCrop, stage: selectedViewStage, subStage: sub, startDate: now, isLocked: false });
                                                    }}
                                                    className="py-1 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                    Start
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-[12px] text-slate-500 font-bold">
                                                    Started: {new Date(activity.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const now = new Date().toISOString();
                                                        updateActivity({ ...activity, crop: activeCrop, stage: selectedViewStage, subStage: sub, endDate: now, isLocked: true });
                                                    }}
                                                    className="py-1 px-3 bg-slate-900 hover:bg-black text-white rounded text-[10px] font-black uppercase tracking-wider transition-all active:translate-y-0.5"
                                                >
                                                    Complete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!cropModel.subStages[selectedViewStage] && !isNext && (
                <div className="flex-grow flex items-center justify-center text-slate-400 italic text-sm">
                    No sub-stages defined for this stage.
                </div>
            )}
        </div>
    );
}

export default function CultivationStageWidget({
    selectedViewStage,
    setSelectedViewStage
}: {
    selectedViewStage: string;
    setSelectedViewStage: (s: string) => void;
}) {
    const context = useLiveAPIContext() as any;
    const { currentStage, activities, crop, setCurrentStage } = context;

    React.useEffect(() => {
        if (!currentStage || !crop || !activities) return;
        const cropModel = CROP_MODELS[crop];
        if (!cropModel) return;

        const activeSubStages = cropModel.subStages[currentStage] || [];
        if (activeSubStages.length === 0) return;

        const currentStageActivities = activities.filter((a: any) => a.stage === currentStage);
        const isFullyLocked = activeSubStages.every(sub => {
            const act = currentStageActivities.find((a: any) => a.subStage === sub && (a.crop === crop || !a.crop));
            return act?.isLocked;
        });

        if (isFullyLocked) {
            const currentIdx = cropModel.stages.indexOf(currentStage);
            if (currentIdx !== -1 && currentIdx < cropModel.stages.length - 1) {
                const nextStage = cropModel.stages[currentIdx + 1];
                setCurrentStage(nextStage);
                setSelectedViewStage(nextStage);
            }
        }
    }, [currentStage, activities, crop, setCurrentStage, setSelectedViewStage]);

    return (
        <div className="flex flex-col gap-4">
            {/* Sub-Stages on top */}
            <StageDetails selectedViewStage={selectedViewStage} />
            {/* Horizontal timeline below */}
            <StageNavigation selectedViewStage={selectedViewStage} setSelectedViewStage={setSelectedViewStage} />
        </div>
    );
}
