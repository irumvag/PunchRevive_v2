
import React, { useState, useRef } from 'react';
import { Camera, Zap, FileCode, RefreshCw, Skull, FlaskConical, Download, CheckCircle2, Copy, BookOpen, Clock, FileText, ChevronRight } from 'lucide-react';
import { PunchGrid, User, ResurrectionResult, Translation, Documentation } from '../types';
import VirtualPuncher from '../components/VirtualPuncher';
import ResurrectionSequence from '../components/ResurrectionSequence';
import ExorcismReportView from '../components/ExorcismReportView';
import { analyzePunchCard, translateHolesToCode, generateTextDocumentation } from '../services/geminiService';
import { database } from '../services/databaseService';

export default function ScannerView({ user }: { user: User }) {
  const [grid, setGrid] = useState<PunchGrid>(Array.from({ length: 80 }, () => Array(12).fill(false)));
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [result, setResult] = useState<ResurrectionResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('python');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResurrection = async () => {
    setLoading(true);
    const holes: [number, number][] = [];
    grid.forEach((col, cIdx) => {
      col.forEach((punched, rIdx) => {
        if (punched) holes.push([cIdx, rIdx]);
      });
    });

    if (holes.length === 0) {
      alert("The card is void of logic. Inscribe code first.");
      setLoading(false);
      return;
    }

    try {
      const translationData = await translateHolesToCode(holes);
      const fullResult: ResurrectionResult = {
        id: Math.random().toString(36).substr(2, 9),
        author: user.username,
        timestamp: Date.now(),
        likes: 0,
        targetLanguage: 'multi',
        status: 'purified',
        originalCode: translationData.originalCode || "",
        resurrectedCode: translationData.resurrectedCode || "",
        language: translationData.language || "Unknown",
        explanation: translationData.explanation || "",
        translations: translationData.translations || {},
        exorcismReport: translationData.exorcismReport || [],
        holes: holes
      };
      
      setResult(fullResult);
      database.saveCard(fullResult);
      setAnimating(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Ritual broken. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocs = async () => {
    if (!result) return;
    setGeneratingDocs(true);
    try {
      const docs = await generateTextDocumentation(result.originalCode, result.language);
      setResult({ ...result, documentation: docs });
    } catch (e) {
      alert("Failed to extract documentation from the void.");
    } finally {
      setGeneratingDocs(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const { holes, confidence } = await analyzePunchCard(base64);
        const newGrid = Array.from({ length: 80 }, () => Array(12).fill(false));
        holes.forEach(([c, r]) => {
          if (c < 80 && r < 12) newGrid[c][r] = true;
        });
        setGrid(newGrid);
        alert(`Spectral scan complete. Confidence: ${confidence}%`);
      } catch (err) {
        console.error(err);
        alert("OCR Ritual failed.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Logic copied to clipboard.");
  };

  if (animating) return <ResurrectionSequence onComplete={() => setAnimating(false)} />;

  if (result) {
    const translations = result.translations || {};
    const languages = Object.keys(translations);
    const currentTranslation = translations[activeTab] as Translation;

    return (
      <div className="space-y-8 animate-in slide-in-from-bottom duration-700 pb-20">
        <div className="flex justify-between items-center border-b border-[#0f0]/20 pb-4">
          <h2 className="creepster text-4xl text-[#0f0] glow-text">The Reanimated Logic</h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-green-900/40 text-green-400 px-3 py-1 border border-green-500/30 rounded-full flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3" /> {result.confidence || 85}% CONFIDENCE
            </span>
            <span className="text-[10px] text-[#0f0]/60 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(result.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            {/* Original Fragment */}
            <div className="bg-[#001100] border-2 border-[#0f0]/20 p-6 rounded relative group">
               <div className="flex justify-between border-b border-[#0f0]/10 pb-4 mb-4 items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">🕰️ {result.language} Frag</span>
                  <button onClick={() => copyToClipboard(result.originalCode)} className="text-[#0f0]/40 hover:text-[#0f0] transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
               </div>
               <pre className="text-xl leading-relaxed glow-text-subtle font-mono text-[#0f0] whitespace-pre-wrap">{result.originalCode}</pre>
               {result.explanation && (
                 <p className="mt-4 text-xs text-[#0f0]/60 italic font-mono border-t border-[#0f0]/10 pt-4 bg-[#002200]/30 p-2 rounded">
                   // {result.explanation}
                 </p>
               )}
            </div>

            {/* Translation Tabs */}
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#0f0]/10">
                {languages.map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-t-md whitespace-nowrap ${activeTab === lang ? 'bg-[#0f0] text-black shadow-[0_0_10px_#0f0]' : 'text-[#0f0]/30 hover:text-[#0f0]/60'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              
              <div className="bg-[#001100] border border-[#0f0]/20 p-6 rounded shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-[#0f0]/40 uppercase tracking-widest">Spectral Translation: {activeTab}</span>
                  <button onClick={() => copyToClipboard(currentTranslation?.code || "")} className="text-[#0f0]/40 hover:text-[#0f0] transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="text-sm font-mono text-[#0f0] bg-black/60 p-5 rounded-lg overflow-x-auto border border-[#0f0]/5 scrollbar-thin">
                  {currentTranslation?.code || "// No translation found"}
                </pre>
                {currentTranslation?.notes && (
                  <div className="mt-4 p-3 bg-blue-900/10 border-l-2 border-blue-500 rounded-r">
                    <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Scientist's Note:</p>
                    <p className="text-[10px] text-blue-300 italic">{currentTranslation.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <button onClick={() => setResult(null)} className="w-full py-5 border border-[#0f0]/40 text-[#0f0] uppercase font-bold tracking-[0.2em] hover:bg-[#0f0]/10 transition-all flex items-center justify-center gap-3 rounded group">
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> Inscribe Another Sigil
            </button>
          </div>
          
          <div className="space-y-8">
            <ExorcismReportView reports={result.exorcismReport} />
            
            {/* Documentation Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="creepster text-2xl text-[#0f0]/80 flex items-center gap-2"><FileText className="w-5 h-5" /> Spectral Docs</h3>
                    {!result.documentation && (
                        <button 
                            onClick={handleGenerateDocs}
                            disabled={generatingDocs}
                            className="text-[10px] bg-[#0f0]/10 px-3 py-1 border border-[#0f0]/30 text-[#0f0] font-black uppercase tracking-widest hover:bg-[#0f0] hover:text-black transition-all disabled:opacity-50"
                        >
                            {generatingDocs ? 'TRANSCRIBING...' : '✨ GENERATE DOCS'}
                        </button>
                    )}
                </div>

                {result.documentation ? (
                    <div className="bg-[#001100] border border-[#0f0]/20 p-6 rounded-lg space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-[#0f0]/40 uppercase tracking-widest">Manifest Summary</h4>
                            <p className="text-xs text-[#0f0]/80 italic border-l-2 border-[#0f0]/20 pl-3">{result.documentation.plainSummary}</p>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-[#0f0]/40 uppercase tracking-widest">Logical Breakdown</h4>
                            <ul className="space-y-2">
                                {result.documentation.stepByStep.map((step, i) => (
                                    <li key={i} className="text-[10px] text-[#0f0]/60 flex items-start gap-2">
                                        <span className="text-[#0f0] font-bold">{i + 1}.</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-[#0f0]/40 uppercase tracking-widest">Historical context</h4>
                                <p className="text-[9px] text-[#0f0]/50 leading-tight">{result.documentation.historicalContext}</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-[#0f0]/40 uppercase tracking-widest">Modern Equivalent</h4>
                                <p className="text-[9px] text-[#0f0]/50 leading-tight">{result.documentation.modernEquivalent}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[#0f0]/5 flex justify-between items-center">
                            <div className="flex gap-2">
                                {result.documentation.useCases.map((u, i) => (
                                    <span key={i} className="text-[8px] bg-black border border-[#0f0]/20 px-2 py-0.5 rounded text-[#0f0]/40">#{u}</span>
                                ))}
                            </div>
                            <button onClick={() => copyToClipboard(JSON.stringify(result.documentation, null, 2))} className="text-[#0f0]/40 hover:text-[#0f0]"><Copy className="w-3 h-3" /></button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 border border-dashed border-[#0f0]/10 rounded-lg text-center opacity-40">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 text-[#0f0]/20" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No spectral analysis generated yet.</p>
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-3 gap-3">
                <button className="py-3 border border-[#0f0]/20 text-[9px] font-bold uppercase hover:bg-[#0f0]/5 flex flex-col items-center gap-1 group">
                    <Download className="w-4 h-4 text-[#0f0]/40 group-hover:text-[#0f0]" /> <span>VAULT</span>
                </button>
                <button className="py-3 border border-[#0f0]/20 text-[9px] font-bold uppercase hover:bg-[#0f0]/5 flex flex-col items-center gap-1 group">
                    <Zap className="w-4 h-4 text-[#0f0]/40 group-hover:text-[#0f0]" /> <span>ENCRYPT</span>
                </button>
                <button className="py-3 border border-[#0f0]/20 text-[9px] font-bold uppercase hover:bg-[#0f0]/5 flex flex-col items-center gap-1 group">
                    <ChevronRight className="w-4 h-4 text-[#0f0]/40 group-hover:text-[#0f0]" /> <span>SHARE</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-2">
            <h3 className="creepster text-3xl text-[#0f0]/80 flex items-center gap-2">
                <FlaskConical className="w-6 h-6" /> The Inscriber
            </h3>
            <p className="text-[10px] text-[#0f0]/40 italic">Type characters or punch holes manually to prepare the soul message.</p>
        </div>
      </div>

      <VirtualPuncher grid={grid} setGrid={setGrid} audioEnabled={true} />

      <div className="flex flex-col items-center gap-6 py-10">
          <button 
            onClick={handleResurrection}
            disabled={loading}
            className="group relative px-20 py-6 bg-[#0f0] text-black font-black text-3xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(0,255,0,0.3)] uppercase creepster tracking-widest disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-8 h-8 animate-spin" /> : "TRANSMIT DATA"}
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 border border-[#0f0]/30 text-[#0f0]/60 hover:text-[#0f0] hover:border-[#0f0] transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <Camera className="w-4 h-4" /> Load External Sigil
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
          </div>
      </div>
    </div>
  );
}
