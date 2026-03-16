'use client';

import React, { useState, useEffect } from 'react';
import { FaCloudSun, FaExclamationTriangle, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import clsx from 'clsx';

const getWeatherCondition = (code: number) => {
  const mapping: any = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    95: "Thunderstorm",
  };
  return mapping[code] || "Clear Sky";
};

interface Alert {
  id: string;
  alertType: string;
  severity: 'Red' | 'Amber' | 'Info';
  summary: string;
  recommendation?: string;
  locationName: string;
}

export function WeatherDashboardWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Loading location...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Fetch Weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          const weatherData = await weatherRes.json();

          // Reverse Geocode for location name
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const geoData = await geoRes.json();
          const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state_district || "Unknown Location";

          setWeather(weatherData.current_weather);
          setLocationName(city);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch weather data");
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse">
        <div className="h-4 w-24 bg-slate-100 rounded mb-4"></div>
        <div className="h-8 w-16 bg-slate-100 rounded mb-4"></div>
        <div className="h-4 w-32 bg-slate-100 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm group">
        <div className="text-red-500 text-sm font-bold flex flex-col items-center gap-2">
          <FaExclamationTriangle size={24} />
          <span>{error}</span>
          <p className="text-slate-400 font-normal text-xs text-center">Please enable location access for real-time weather</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Current Weather</p>
          <h3 className="text-3xl font-black text-slate-900">{Math.round(weather?.temperature || 0)}°C</h3>
          <p className="text-slate-500 flex items-center gap-1 font-medium"><FaMapMarkerAlt className="text-xs" /> {locationName}</p>
        </div>
        <div className="text-5xl text-amber-500 animate-pulse">
          <FaCloudSun />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Condition</span>
          <span className="text-slate-900 font-bold">{getWeatherCondition(weather?.weathercode)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Wind Speed</span>
          <span className="text-slate-900 font-bold">{weather?.windspeed || 0} km/h</span>
        </div>
        <div className="pt-4 border-t border-slate-50">
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            Real-time conditions from your location
          </p>
        </div>
      </div>
    </div>
  );
}

export function AlertsDashboardWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use the backend Search-Grounding engine for consistent alerts
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const res = await fetch(`${API_BASE}/api/agri-copilot/disaster/monitor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lon: longitude })

          });
          const data = await res.json();
          
          if (data.status === 'success') {
            setAlerts(data.alerts || []);
          } else {
            setAlerts([]);
          }
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch alerts");
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied");
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse">
        <div className="h-4 w-24 bg-slate-100 rounded mb-4"></div>
        <div className="h-8 w-48 bg-slate-100 rounded mb-4"></div>
        <div className="h-20 w-full bg-slate-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className={clsx(
        "absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500",
        alerts.length > 0 ? "bg-red-50" : "bg-emerald-50"
      )}></div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Active Alerts</p>
          <h3 className={clsx(
            "text-xl font-black flex items-center gap-2",
            alerts.length > 0 ? "text-slate-900" : "text-emerald-600"
          )}>
            {alerts.length > 0 ? (
              <>
                <FaExclamationTriangle className={alerts.some(a => a.severity === 'Red') ? "text-red-500" : "text-amber-500"} />
                {alerts.length} {alerts.length === 1 ? 'Active Alert' : 'Active Alerts'}

              </>
            ) : (
              "Sky is Clear"
            )}
          </h3>
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 mb-6">
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            {alerts[0].alertType}
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{alerts[0].summary}</p>

          <Link
            href="/disaster-relief"
            className="inline-flex items-center gap-2 text-sm font-black text-red-600 uppercase tracking-widest hover:underline"
          >
            Take Action <FaArrowRight />
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mb-6">
          <p className="font-bold text-emerald-600 mb-1">No Threats Detected</p>
          <p className="text-sm text-slate-600 leading-relaxed">System is monitoring for disaster threats. All parameters within safe limits.</p>
        </div>
      )}

      <Link
        href="/disaster-relief"
        className="text-xs text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest"
      >
        View Past Alerts
      </Link>
    </div>
  );
}

export function QuickActionWidget({ title, href, icon: Icon, colorClass, delay }: any) {
  return (
    <Link
      href={href}
      style={{ animationDelay: `${delay}ms` }}
      className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
    >
      <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon />
      </div>
      <h4 className="font-black text-slate-800 uppercase tracking-tighter group-hover:text-slate-900 transition-colors">{title}</h4>
      <p className="text-xs text-slate-400 font-medium mt-1">Grounded by Gemini</p>
    </Link>
  );
}
