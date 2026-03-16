'use client';

import React, { useState } from 'react';
import { FaMoneyBillWave, FaListUl, FaInfoCircle, FaFileContract, FaSearch, FaHistory, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

const MOCK_SUBSIDIES = [
  { id: 'sub-1', name: 'PM-Kisan Maandhan Yojana', amount: '₹3,000 / month', status: 'Approved', category: 'Insurance' },
  { id: 'sub-2', name: 'Micro Irrigation Subsidy', amount: 'Up to 90%', status: 'Active', category: 'Equipment' },
  { id: 'sub-3', name: 'Organic Farming Incentive', amount: '₹50,000 / hectare', status: 'Active', category: 'Inputs' },
  { id: 'sub-4', name: 'Solar Pump Scheme (KUSUM)', amount: '60% Subsidy', status: 'Active', category: 'Energy' },
];

export default function SubsidiesPage() {
  const [activeTab, setActiveTab] = useState<'market' | 'tracking'>('market');
  const [showModal, setShowModal] = useState(false);
  const [selectedSubsidy, setSelectedSubsidy] = useState<any>(null);

  const openAppModal = (subsidy: any) => {
    setSelectedSubsidy(subsidy);
    setShowModal(true);
  };

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
              <FaMoneyBillWave className="text-blue-600" />
              Subsidies & Market
            </h1>
            <p className="mt-2 text-lg text-slate-600 max-w-2xl">
              Navigate agricultural bureaucracy with Sahayak. Discover, apply, and track your government subsidies.
            </p>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start">
            <button 
              onClick={() => setActiveTab('market')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'market' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
            >
              Marketplace
            </button>
            <button 
              onClick={() => setActiveTab('tracking')}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'tracking' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
            >
              My Tracking
            </button>
          </div>
        </div>

        {activeTab === 'market' ? (
          <div className="space-y-12">
            <div className="relative max-w-xl">
              <input 
                type="text" 
                placeholder="Search subsidies by name, crop, or category..." 
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              />
              <FaSearch className="absolute left-4 top-5 text-slate-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MOCK_SUBSIDIES.map((sub) => (
                <div key={sub.id} className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {sub.category}
                    </span>
                    <button className="text-slate-300 hover:text-blue-500 transition-colors">
                      <FaInfoCircle size={20} />
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{sub.name}</h3>
                  <p className="text-3xl font-bold text-slate-800 mb-8">{sub.amount}</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => openAppModal(sub)}
                      className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
                    >
                      Apply Now
                    </button>
                    <button className="px-6 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all">
                      Guide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">Application</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-8 font-bold text-slate-900">PM-Kisan Installment #17</td>
                  <td className="px-8 py-8 text-slate-500">Oct 12, 2024</td>
                  <td className="px-8 py-8">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-full">Approved</span>
                  </td>
                  <td className="px-8 py-8">
                    <button className="text-blue-600 font-bold flex items-center gap-2">View Receipt <FaExternalLinkAlt className="text-[10px]" /></button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-8 font-bold text-slate-900">Solar Pump Subsidy</td>
                  <td className="px-8 py-8 text-slate-500">March 04, 2024</td>
                  <td className="px-8 py-8">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded-full">Under Review</span>
                  </td>
                  <td className="px-8 py-8">
                    <button className="text-blue-600 font-bold flex items-center gap-2">Track Detail <FaExternalLinkAlt className="text-[10px]" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Application Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
              <div className="p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                    <FaFileContract />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Apply for Subsidy</h3>
                    <p className="text-slate-500">{selectedSubsidy?.name}</p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 border-dashed">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                       <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                       Sahayak Guidance
                    </h4>
                    <p className="text-slate-700 italic leading-relaxed">
                      "I see you're starting an application for {selectedSubsidy?.name}. You'll need your Aadhaar Number and Land Record ID (7/12 extract) ready. Need help finding these?"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Aadhaar Number</label>
                        <input type="text" placeholder="XXXX-XXXX-XXXX" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Land Record ID</label>
                        <input type="text" placeholder="Survey / 7/12 ID" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all hover:-translate-y-1 block text-center"
                  >
                    Finalize Submission
                  </button>
                  <button className="flex-1 py-4 bg-blue-50 text-blue-600 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-100 transition-all">
                    Ask Sahayak for Help
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const FaExternalLinkAlt = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128a16,16,0,0,0-16,16V48a16,16,0,0,0,16,16h48l-215,215a16,16,0,0,0,0,22.62L210.63,324.24a16,16,0,0,0,22.62,0L448,109.25V160a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16V24A24,24,0,0,0,488,0Z"></path>
  </svg>
);
