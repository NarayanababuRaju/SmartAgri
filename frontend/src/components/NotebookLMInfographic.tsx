"use client";

import React, { forwardRef } from 'react';

export interface VisualBlueprint {
    layout_type: string;
    theme: 'danger' | 'warning' | 'safe';
    typography: {
        headline: string;
        subtext: string;
        action_badge: string;
    };
    action_items: Array<{
        category: string;
        instruction: string;
    }>;
    imagen_background_prompt?: string;
}

interface Props {
    blueprint: VisualBlueprint;
    imagenBackgroundUrl: string;
}

const NotebookLMInfographic = forwardRef<HTMLDivElement, Props>(({ blueprint, imagenBackgroundUrl }, ref) => {
    const themeColors = {
        danger: {
            badge: "text-rose-500 bg-rose-500/10 border-rose-500/50",
            title: "text-rose-400",
            bar: "bg-rose-500",
            accent: "border-rose-500/30"
        },
        warning: {
            badge: "text-amber-500 bg-amber-500/10 border-amber-500/50",
            title: "text-amber-400",
            bar: "bg-amber-500",
            accent: "border-amber-500/30"
        },
        safe: {
            badge: "text-emerald-500 bg-emerald-500/10 border-emerald-500/50",
            title: "text-emerald-400",
            bar: "bg-emerald-500",
            accent: "border-emerald-500/30"
        }
    };

    const activeTheme = themeColors[blueprint.theme] || themeColors.safe;

    return (
        <div
            ref={ref}
            className="relative w-[1000px] h-[550px] rounded-[2rem] overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 flex shrink-0"
        >

            {/* LEFT PANE: The Imagen 4.0 Art & Headline */}
            <div className="relative w-[45%] h-full p-12 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                    {imagenBackgroundUrl && (
                        <img
                            src={imagenBackgroundUrl}
                            className="w-full h-full object-cover"
                            alt="Background"
                            crossOrigin="anonymous"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/40 to-slate-950"></div>
                </div>

                <div className="relative z-10 mt-auto mb-8">
                    <div className={`inline-block px-4 py-1.5 rounded-full border text-xs font-black tracking-widest uppercase mb-6 w-max ${activeTheme.badge}`}>
                        {blueprint.typography.action_badge}
                    </div>
                    <h2 className="text-4xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                        {blueprint.typography.headline}
                    </h2>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed drop-shadow-md">
                        {blueprint.typography.subtext}
                    </p>
                </div>

                {/* Branding Overlay */}
                <div className="relative z-10 flex items-center gap-2 opacity-60">
                    <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
                        <span className="text-black text-[9px] font-black">AI</span>
                    </div>
                    <span className="text-[9px] font-bold text-white tracking-widest uppercase">Navratna Grounding</span>
                </div>
            </div>

            {/* RIGHT PANE: The Detailed Action Plan */}
            <div className="w-[55%] h-full bg-slate-900/80 backdrop-blur-xl border-l border-white/5 p-12 flex flex-col justify-center">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    Detailed Action Plan
                    <div className="flex-1 h-px bg-slate-800"></div>
                </h3>

                <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                    {blueprint.action_items.map((item, idx) => (
                        <div key={idx} className="relative">
                            {/* Decorative accent bar */}
                            <div className={`absolute -left-3 top-1 w-1 h-4 rounded-full ${activeTheme.bar}`}></div>
                            <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${activeTheme.title}`}>
                                {item.category}
                            </h4>
                            <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                                {item.instruction}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

NotebookLMInfographic.displayName = 'NotebookLMInfographic';

export default NotebookLMInfographic;
