'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaMinus, FaLightbulb, FaSearch } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function CopilotAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set context based on current path
    if (pathname.includes('schemes')) setContext('Government Schemes Marketplace');
    else if (pathname.includes('disaster')) setContext('Disaster Relief & Insurance Claims');
    else if (pathname.includes('subsidies')) setContext('Subsidy Application Portal');
    else setContext('Dashboard Overview');
    
    // Proactive greeting when path changes
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Namaste! I am Sahayak, your Agri-Copilot. How can I help you today with ${
          pathname.includes('schemes') ? 'government schemes' : 
          pathname.includes('disaster') ? 'reporting crop damage' : 
          pathname.includes('subsidies') ? 'applying for subsidies' : 'your farming dashboard'
        }?`
      }]);
    }
  }, [pathname]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/api/agri-copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }],
          activeContext: context,
          userId: 'farmer_demo'
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] transition-all duration-500">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-105 transition-all animate-in fade-in zoom-in duration-300"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>
          <FaRobot className="text-2xl text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="font-bold tracking-tight">Ask Sahayak</span>
        </button>
      ) : (
        <div className="bg-white w-96 h-[600px] border border-slate-200 rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
          {/* Header */}
          <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 text-xl">
                <FaRobot />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest">Agri-Copilot</h4>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Sahayak Online
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"><FaMinus /></button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"><FaTimes /></button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100 flex items-center gap-2">
             <FaLightbulb className="text-emerald-600 text-xs" />
             <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
               Context: {context}
             </p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-slate-100 text-slate-800 rounded-tr-none' 
                  : 'bg-emerald-50 text-emerald-900 font-medium rounded-tl-none border border-emerald-100/50'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 p-4 rounded-3xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 pt-0">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about subsidies, weather, or claims..." 
                className="w-full p-4 pr-14 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm font-medium"
              />
              <button 
                onClick={handleSendMessage}
                disabled={loading}
                className="absolute right-3 top-3 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg"
              >
                {loading ? <FaSearch className="animate-spin text-xs" /> : <FaPaperPlane className="text-xs" />}
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-bold flex items-center justify-center gap-1">
              <FaSearch className="text-[8px]" />
              Grounded by Google Search
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
