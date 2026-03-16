"use client";

import { useEffect, useState } from "react";

interface WeatherData {
    temp: number;
    description: string;
    locationName: string;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fallback coordinates (Muttanchetti Village)
        const fallbackLat = 11.1319;
        const fallbackLon = 78.3101;
        const fallbackName = "Muttanchetti";

        async function fetchWeather(lat: number, lon: number, locName: string) {
            try {
                // 1. Fetch Weather
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                if (!res.ok) throw new Error(`Weather API responded with ${res.status}`);
                const data = await res.json();

                // 2. Try to Reverse Geocode for City Name (if not using fallback)
                let finalName = locName;
                if (locName === "Local") {
                    try {
                        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
                            headers: { 'User-Agent': 'AgriSageLiveAgent/1.0' } // Nominatim requires a user-agent
                        });
                        if (geoRes.ok) {
                            const geoData = await geoRes.json();
                            finalName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || "Local Area";
                        }
                    } catch (e) {
                        console.warn("Reverse geocode failed", e);
                    }
                }

                if (data && data.current_weather) {
                    setWeather({
                        temp: Math.round(data.current_weather.temperature),
                        description: getWeatherDescription(data.current_weather.weathercode),
                        locationName: finalName
                    });
                }
            } catch (error) {
                console.error("Weather Widget Error:", error);
            } finally {
                setLoading(false);
            }
        }

        // Try to get user location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude, "Local");
                },
                (error) => {
                    console.warn("Geolocation denied or failed, using fallback.", error);
                    fetchWeather(fallbackLat, fallbackLon, fallbackName);
                },
                { timeout: 5000 }
            );
        } else {
            fetchWeather(fallbackLat, fallbackLon, fallbackName);
        }
    }, []);

    if (loading) return <div className="text-sm text-gray-400 hidden sm:block animate-pulse w-32 h-6 bg-gray-100 rounded-full"></div>;
    if (!weather) return <div className="text-sm text-gray-500 hidden sm:block">Weather unavailable</div>;

    return (
        <div className="flex items-center gap-2 text-sm text-gray-700 hidden sm:flex bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <span className="text-lg" title={weather.description.split("|")[1]}>{weather.description.split("|")[0]}</span>
            <span className="font-semibold">{weather.temp}°C</span>
            <span className="text-gray-500 text-xs hidden md:inline ml-1" title={weather.locationName}>{weather.locationName}</span>
        </div>
    );
}

// Map Open-Meteo WMO weather codes to emojis and strings
function getWeatherDescription(code: number): string {
    switch (code) {
        case 0: return "☀️|Clear";
        case 1: case 2: case 3: return "⛅|Partly Cloudy";
        case 45: case 48: return "🌫️|Fog";
        case 51: case 53: case 55: return "🌧️|Drizzle";
        case 61: case 63: case 65: return "🌧️|Rain";
        case 71: case 73: case 75: return "❄️|Snow";
        case 95: case 96: case 99: return "⛈️|Thunderstorm";
        default: return "🌤️|Unknown";
    }
}
