'use client';

import React, { useEffect, useState } from 'react';
import { FaLandmark, FaExternalLinkAlt, FaCalendarAlt, FaSearch, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface Scheme {
  name: string;
  description: string;
  date: string;
  url: string;
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchemes() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_BASE}/api/agri-copilot/schemes`);
        const data = await res.json();
        if (data.status === 'success') {
          setSchemes(data.schemes);
        }
      } catch (error) {
        console.error("Error fetching schemes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/agri-copilot"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Sahayak
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <FaLandmark className="text-emerald-600" />
              Schemes & Orders
            </h1>
            <p className="mt-2 text-lg text-slate-600 max-w-2xl">
              Live updates on government agricultural schemes and official orders, grounded by Gemini & Google Search.
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search schemes..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
            />
            <FaSearch className="absolute left-4 top-3 text-slate-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Fetching latest government data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.map((scheme, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>

                <div className="flex items-center gap-3 text-sm text-emerald-600 font-bold uppercase tracking-wider mb-4">
                  <FaCalendarAlt />
                  {scheme.date}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                  {scheme.name}
                </h3>

                <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                  {scheme.description}
                </p>

                <a
                  href={scheme.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                >
                  View Official Document
                  <FaExternalLinkAlt className="text-xs" />
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
