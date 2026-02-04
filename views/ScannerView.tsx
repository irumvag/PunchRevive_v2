
import React, { useState } from 'react';
import { RefreshCw, Cpu, Copy, Activity, Share2, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { PunchGrid, User, RestorationResult, Translation } from '../types';
import VirtualPuncher from '../components/VirtualPuncher';
import ResurrectionSequence from '../components/ResurrectionSequence';
import AuditReportView from '../components/AuditReportView';
import ImageImportModule from '../components/ImageImportModule';
import { translateHolesToCode } from '../services/geminiService';
import { database } from '../services/databaseService';

export default function ScannerView({ user }: { user: User }) {
  const [grid, setGrid] = useState<PunchGrid>(Array.from({ length: 80 }, () => Array(12).fill(false)));
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [result, setResult] = useState<RestorationResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('python');

  const handleHolesDetected = (holes: [number, number][]) => {
    // Populate grid based on AI detection
    const newGrid = Array.from({ length: 80 }, () => Array(12).fill(false));
    holes.forEach(([col, row]) => {
      if (col >= 0 && col < 80 && row >= 0 && row < 12) {
        newGrid[col][row] = true;
      }
    });
    setGrid(newGrid);
  };

  const handleProcess = async () => {
    setLoading(true);
    const holes: [number, number][] = [];
    grid.forEach((col, cIdx) => {
      col.forEach((punched, rIdx) => {
        if (punched) holes.push([cIdx, rIdx]);
      });
    });

    if (holes.length === 0) {
      alert("No data pattern detected. Please select punches or import an image.");
      setLoading(false);
      return;
    }

    try {
      const translationData = await translateHolesToCode(holes);
      const fullResult: RestorationResult = {
        id: Math.random().toString(36).substr(2, 9),
        author: user.username,
        timestamp: Date.now(),
        likes: 0,
        targetLanguage: 'multi',
        status: 'verified',
        originalCode: translationData.originalCode || "",
        resurrectedCode: translationData.resurrectedCode || "",
        language: translationData.language || "Legacy Logic",
        explanation: translationData.explanation || "",
        translations: translationData.translations || {},
        auditReport: translationData.auditReport || [],
        holes: holes,
        confidence: translationData.confidence || 99
      };
      
      setResult(fullResult);
      database.saveCard(fullResult);
      setAnimating(true);
      
      const updatedUser = { ...user };
      updatedUser.stats.cardsDecoded += 1;
      updatedUser.stats.systemIntegrations += (translationData.auditReport?.length || 0);
      database.saveUser(updatedUser);
    } catch (error: any) {
      console.error(error);
      alert("System processing error. Pattern analysis module timed out.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareResult = async () => {
    if (!result) return;
    const text = `Digitized ${result.language} restoration via PunchRevive. Integrity: ${result.confidence}%`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'PunchRevive Restoration', text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Digitization manifest copied to clipboard.");
      }
    } catch (err) {}
  };

  if (animating) return <ResurrectionSequence onComplete={() => setAnimating(false)} />;

  if (result) {
    const translations = result.translations || {};
    const languages = Object.keys(translations);
    const currentTranslation = (translations[activeTab] as Translation) || { code: "", notes: "" };

    return (
      <div className="space-y-10 animate-in slide-in-from-bottom duration-500 pb-20">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
             </div>
             <div>
                <h2 className="text-3xl font-bold text-white">Digitization Complete</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Protocol PR-0x{result.id.toUpperCase()}</p>
             </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-slate-400">Confidence: {result.confidence}%</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative shadow-2xl group">
               <div className="flex justify-between border-b border-slate-800 pb-6 mb-6 items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-3">
                    <Activity className="w-4 h-4" /> Detected: {result.language}
                  </span>
                  <button onClick={() => navigator.clipboard.writeText(result.originalCode)} className="text-slate-600 hover:text-white transition-all">
                    <Copy className="w-4 h-4" />
                  </button>
               </div>
               <pre className="text-lg font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{result.originalCode}</pre>
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-1 p-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
                {languages.length > 0 ? languages.map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === lang ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
                  >
                    {lang}
                  </button>
                )) : (
                  <div className="px-6 py-3 text-[10px] text-slate-600 italic">No translations available.</div>
                )}
              </div>
              
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
                <pre className="text-sm font-mono text-emerald-400/90 bg-slate-950 p-6 rounded-2xl border border-white/5 overflow-x-auto leading-relaxed shadow-inner">
                  {currentTranslation.code || "// Analysis still in progress..."}
                </pre>
                {currentTranslation.notes && (
                  <p className="mt-4 text-[11px] text-slate-500 italic px-2">Note: {currentTranslation.notes}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-10">
            <AuditReportView reports={result.auditReport} />

            <div className="grid grid-cols-2 gap-4">
                <button onClick={handleShareResult} className="py-5 border border-slate-800 bg-slate-900/50 text-slate-400 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-3 text-[10px]">
                    <Share2 className="w-4 h-4" /> Export Metadata
                </button>
                <button onClick={() => setResult(null)} className="py-5 border border-slate-800 bg-slate-900/50 text-slate-400 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-3 text-[10px]">
                    <RefreshCw className="w-4 h-4" /> Archive & New Scan
                </button>
            </div>
            
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl flex items-start gap-4">
               <FileText className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
               <div className="space-y-1">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest">Restoration Context</h4>
                 <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    "{result.explanation || "System generated logic based on Hollerith pattern matching and modern code synthesis."}"
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <ImageImportModule onHolesDetected={handleHolesDetected} />
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-xl">
             <div className="flex items-center gap-3 text-emerald-500">
                <Cpu className="w-5 h-5" />
                <h4 className="text-xs font-black uppercase tracking-widest">Lab Protocols</h4>
             </div>
             <ul className="text-[11px] text-slate-500 space-y-2 italic">
               <li>• Calibrate card alignment with the 80-column grid.</li>
               <li>• Ensure lighting highlights physical perforations.</li>
               <li>• AI will automatically resolve legacy logic sequences.</li>
             </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/30 border border-slate-800/50 p-10 rounded-[2.5rem] shadow-2xl">
            <VirtualPuncher grid={grid} setGrid={setGrid} audioEnabled={true} />
          </div>

          <div className="flex flex-col items-center gap-6 py-6">
              <button 
                onClick={handleProcess}
                disabled={loading}
                className="group relative px-20 py-8 bg-emerald-600 text-white font-black text-2xl hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)] rounded-3xl tracking-[0.2em] disabled:opacity-50 uppercase flex items-center gap-6"
              >
                {loading ? <RefreshCw className="w-8 h-8 animate-spin" /> : (
                  <>
                    <Cpu className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    RESTORE LOGIC
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-40">Ready for digital synthesis sequence.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
