import React from 'react';
import { ShieldCheck, Play, CheckCircle2, FileSpreadsheet } from 'lucide-react';

interface HeaderProps {
  onAnalyzeClick: () => void;
  isAnalyzing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onAnalyzeClick, isAnalyzing = false }) => {
  return (
    <header className="border-b border-slate-200/90 bg-white/95 sticky top-0 z-30 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-700/20 shrink-0">
              <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
                  CarbonGuard <span className="text-emerald-700 font-extrabold">AI</span>
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ISO 14064-3 Aligned
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
                Trusted carbon accounting with agentic governance
              </p>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <FileSpreadsheet className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
              <span>DEFRA 2026 Factor Registry Active</span>
            </div>

            <button
              id="analyze-esg-data-btn"
              type="button"
              onClick={onAnalyzeClick}
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm shadow-sm transition-all duration-150 disabled:opacity-60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              <Play className={`h-4 w-4 fill-white ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing Engine...' : 'Analyze ESG Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
