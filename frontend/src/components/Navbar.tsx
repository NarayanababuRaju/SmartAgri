"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const WeatherWidget = dynamic(() => import("@/components/WeatherWidget"), { ssr: false });

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <Link href="/" className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                    <span className="text-2xl">🌱</span> SmartAgri
                </Link>
                <div className="hidden md:flex items-center gap-4 text-sm font-medium ml-4">
                    <span className="text-slate-400 uppercase tracking-widest text-xs font-bold mr-2">Agents:</span>
                    <Link href="/live-agri-advisor" className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors">Live-Agri-Advisor</Link>
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg cursor-not-allowed opacity-60">Virtual-Soil-Nutrition</div>
                    <Link href="/agri-copilot" className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">Agri-CoPilot</Link>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <WeatherWidget />
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white cursor-pointer">
                    <option>English</option>
                </select>
            </div>
        </nav>
    );
}
