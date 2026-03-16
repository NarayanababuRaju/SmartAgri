'use client';

import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaCloudShowersHeavy, FaMapMarkerAlt, FaUpload, FaCheckCircle, FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface Alert {
  id: string;
  alertType: string;
  severity: 'Red' | 'Amber' | 'Info';
  summary: string;
  recommendation?: string;
  locationName: string;
}


export default function DisasterReliefPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [reporting, setReporting] = useState(false);
  const [reportStatus, setReportStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    async function fetchWithLocation(lat?: number, lon?: number) {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_BASE}/api/agri-copilot/disaster/monitor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lon })

        });
        const data = await res.json();
        if (data.status === 'success') {
          setAlerts(data.alerts || []);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWithLocation(pos.coords.latitude, pos.coords.longitude),
        () => fetchWithLocation() // Fallback to neutral India search if denied
      );
    } else {
      fetchWithLocation();
    }
  }, []);

  const handleAutomateReport = (alert: Alert) => {
    setReporting(true);
    // In a real app, we'd pre-fill form fields here
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setReportStatus('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
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
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FaExclamationTriangle className="text-amber-500" />
            Agri-Intelligence & Alerts
          </h1>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl">
            Proactive monitoring, seasonal guidance, and automated aid assistance for localized agricultural events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Active Alerts Section */}
          <div className="lg:col-span-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
              Active Intelligence & Alerts
            </h2>

            
            {loading ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500">Polling for localized disaster updates...</p>
              </div>
            ) : alerts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-bold uppercase text-xs tracking-wider ${
                      alert.severity === 'Red' ? 'bg-red-500 text-white' : alert.severity === 'Amber' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {alert.severity} Alert
                    </div>

                    
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                        alert.severity === 'Red' ? 'bg-red-50' : 'bg-amber-50'
                      } ${
                        alert.severity === 'Red' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        <FaCloudShowersHeavy />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{alert.alertType}</h3>

                        <p className="text-slate-500 flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt /> {alert.locationName}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      {alert.summary}
                    </p>
                    
                    {alert.recommendation && (
                      <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-sm text-emerald-800 font-medium">
                        <span className="font-black border-r border-emerald-200 pr-2 mr-2">RECOMMENDATION</span>
                        {alert.recommendation}
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleAutomateReport(alert)}
                      className={`w-full py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors ${
                        alert.severity === 'Red' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {alert.severity === 'Red' ? 'Automate Aid Request' : 'Acknowledge & Save'}
                      <FaCheckCircle className="text-emerald-400" />
                    </button>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-emerald-500">
                  <FaCheckCircle />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">System Clear</h3>
                <p className="text-slate-500">No active disasters detected in your region. Proactive monitoring active.</p>
              </div>
            )}
          </div>

          {/* Reporting Workflow */}
          {(reporting || reportStatus !== 'idle') && (
            <div className="lg:col-span-12 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">
                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between text-white">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <FaFileAlt className="text-emerald-400" />
                    Crop Insurance / Relief Claim Form
                  </h3>
                  <button onClick={() => setReporting(false)} className="text-slate-400 hover:text-white transition-colors">Close</button>
                </div>
                
                <div className="p-12">
                  {reportStatus === 'success' ? (
                    <div className="text-center py-20 px-8">
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl text-emerald-500 animate-bounce">
                        <FaCheckCircle />
                      </div>
                      <h4 className="text-3xl font-extrabold text-slate-900 mb-4">Report Submitted Successfully</h4>
                      <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto">
                        Your relief request (ID: #REP-2024-001) has been filed and sent for verification. Our agents will contact you for virtual inspection.
                      </p>
                      <button 
                        onClick={() => {setReporting(false); setReportStatus('idle')}}
                        className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submitReport} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <div>
                          <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Basic Incident Information</label>
                          <div className="space-y-4">
                            <input type="text" placeholder="Disaster Type (e.g. Flooding)" defaultValue="Hailstorm" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" />
                            <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Location Details</label>
                          <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <p className="text-slate-600 font-medium">Automatic Detection: <span className="text-slate-900 font-bold">Vidarbha Region</span></p>
                            <button type="button" className="text-emerald-600 font-bold text-sm">Update Map</button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Crop & Impact</label>
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Crop Type" defaultValue="Wheat" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" />
                            <input type="text" placeholder="Area Impacted (Acres)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 transition-all" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                        <div>
                          <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Visual Evidence (Mandatory)</label>
                          <div className="border-4 border-dashed border-slate-100 rounded-[32px] p-12 flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-all bg-emerald-50/10 active:bg-emerald-50">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl text-slate-400 mb-4 group-hover:scale-110 transition-transform shadow-sm">
                              <FaUpload />
                            </div>
                            <p className="text-slate-600 font-bold mb-2">Upload Photo of Damage</p>
                            <p className="text-slate-400 text-sm mb-6">JPEG or PNG, Max 10MB per file</p>
                            <button type="button" className="px-6 py-2 bg-white text-slate-900 font-bold rounded-xl border border-slate-200 shadow-sm">Select Files</button>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <button 
                            type="submit" 
                            disabled={reportStatus === 'submitting'}
                            className="w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
                          >
                            {reportStatus === 'submitting' ? 'Processing Transaction...' : 'Submit Claim Request'}
                          </button>
                          <p className="text-center text-slate-400 text-xs mt-4">By submitting, you agree to local government verification audits.</p>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
