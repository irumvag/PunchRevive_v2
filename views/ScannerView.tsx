
import React, { useState, useRef } from 'react';
import { Camera, Zap, FileCode, RefreshCw, Skull, FlaskConical, Download } from 'lucide-react';
import { PunchGrid, User, ResurrectionResult } from '../types';
import VirtualPuncher from '../components/VirtualPuncher';
import ResurrectionSequence from '../components/ResurrectionSequence';
import ExorcismReportView from '../components/ExorcismReportView';
import { decodePunchGrid } from '../services/ebcdicDecoder';
import { resurrectCode, ocrPunchCard } from '../services/geminiService';
import { database } from '../services/databaseService';
import { textToGrid } from '../services/punchEncoder';

export default function ScannerView({ user }: { user: User }) {
  const [grid, setGrid] = useState<PunchGrid>(Array.from({ length: 80 }, () => Array(12).fill(false)));
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [result, setResult] = useState<ResurrectionResult | null>(null);
  const [targetLang, setTargetLang] = useState('python');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResurrection = async () => {
    setLoading(true);
    let decoded = decodePunchGrid(grid);
    if (!decoded.trim()) {
      alert("The card is void of logic. Inscribe code first.");
      setLoading(false);
      return;
    }

    try {
      const resurrectionData = await resurrectCode(decoded, targetLang);
      resurrectionData.author = user.username;
      setResult(resurrectionData);
      database.saveCard(resurrectionData);
      setAnimating(true);
    } catch (error) {
      alert("Ritual broken. Try again.");
    } finally {
      setLoading(false);
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
        const text = await ocrPunchCard(base64);
        setGrid(textToGrid(text));
      } catch (err) {
        alert("OCR Ritual failed.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (animating) return <ResurrectionSequence onComplete={() => setAnimating(false)} />;

  if (result) {
    return (
      <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-700">
        <div className="space-y-6">
          <h2 className="creepster text-4xl text-[#0f0]">The Reanimated logic</h2>
          <div className="bg-[#001100] border-2 border-[#0f0]/20 p-6 rounded relative overflow-hidden">
             <div className="flex justify-between border-b border-[#0f0]/10 pb-4 mb-4 items-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Intercept #1024-X</span>
                <span className="text-xs bg-blue-900 px-2 py-1 rounded text-blue-100 font-bold">{result.targetLanguage.toUpperCase()}</span>
             </div>
             <pre className="text-lg leading-relaxed glow-text-subtle font-mono text-[#0f0] whitespace-pre-wrap">{result.resurrectedCode}</pre>
          </div>
          <button onClick={() => setResult(null)} className="w-full py-4 border border-[#0f0]/40 text-[#0f0] uppercase font-bold tracking-widest hover:bg-[#0f0]/10">Inscribe Another</button>
        </div>
        <div className="space-y-6">
          <ExorcismReportView reports={result.exorcismReport} />
          <div className="p-6 bg-black/40 border border-[#0f0]/10 rounded italic text-xs text-[#0f0]/40">
            This fragment was harvested from the local archives. Use the "Inscribe" function to store it permanently in the Vault.
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
        <div className="flex items-center gap-4 bg-[#001100] p-2 border border-[#0f0]/20 rounded">
            <label className="text-[10px] font-black uppercase text-[#0f0]/40 px-2">Vessel:</label>
            <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-black text-[#0f0] text-xs font-bold border-none focus:ring-0 cursor-pointer"
            >
                <option value="python">Python 3.x</option>
                <option value="javascript">ECMAScript 6</option>
                <option value="cpp">Modern C++</option>
                <option value="fortran">FORTRAN 77</option>
                <option value="assembly">x86 Assembly</option>
            </select>
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
