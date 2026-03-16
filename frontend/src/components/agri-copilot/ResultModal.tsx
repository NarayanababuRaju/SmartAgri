import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaTimes, FaRobot, FaInfoCircle, FaClipboardCheck, FaExternalLinkAlt, FaFileAlt, FaHandHoldingUsd, FaExclamationTriangle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string | null;
  links?: Array<{title: string, type: 'scheme' | 'subsidy' | 'disaster'}>;
}

export function ResultModal({ isOpen, onClose, content, links }: ResultModalProps) {
  const router = useRouter();

  if (!content) return null;

  const navigateTo = (type: string) => {
    onClose();
    if (type === 'scheme') router.push('/schemes');
    else if (type === 'subsidy') router.push('/subsidies');
    else if (type === 'disaster') router.push('/disaster-relief');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scheme': return <FaFileAlt className="text-blue-500" />;
      case 'subsidy': return <FaHandHoldingUsd className="text-amber-500" />;
      case 'disaster': return <FaExclamationTriangle className="text-rose-500" />;
      default: return <FaExternalLinkAlt className="text-slate-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-2xl w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-emerald-200">
                    <FaRobot />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Detailed Intelligence</h2>
                    <p className="font-bold text-slate-800">Sahayak Comprehensive Result</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all flex items-center justify-center group"
                >
                  <FaTimes className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Content area */}
              <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                <div className="bg-emerald-50/30 rounded-3xl p-6 border border-emerald-100/50 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaInfoCircle className="text-emerald-500 text-xs" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verification Source: Google Search Grounding</span>
                  </div>
                  <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium markdown-modal-content">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </div>

                {/* Featured Actions / Links */}
                {links && links.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Featured Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigateTo(link.type)}
                                    className="flex items-center gap-4 p-4 bg-white/50 hover:bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all text-left group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        {getTypeIcon(link.type)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{link.type} Navigation</p>
                                        <p className="text-xs font-bold text-slate-700 truncate">{link.title}</p>
                                    </div>
                                    <FaExternalLinkAlt className="ml-auto text-[10px] text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Status indicator / Tip */}
                <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                        <FaClipboardCheck />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Intelligence items are cross-linked with official agri-portals.
                    </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-6 border-t border-slate-100 bg-white/50 shrink-0 text-center">
                 <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200"
                 >
                    Acknowledge Intelligence
                 </button>
              </div>
            </motion.div>
          </div>
          <style jsx global>{`
            .markdown-modal-content ul {
              list-style-type: disc;
              padding-left: 1.5rem;
              margin-bottom: 0.75rem;
            }
            .markdown-modal-content li {
              margin-bottom: 0.25rem;
            }
            .markdown-modal-content p {
              margin-bottom: 0.5rem;
            }
            .markdown-modal-content strong {
              font-weight: 800;
              color: inherit;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
