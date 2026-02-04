
import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, Scan, Cpu, Layers } from 'lucide-react';
import { analyzePunchCard } from '../services/geminiService';

interface ImageImportModuleProps {
  onHolesDetected: (holes: [number, number][]) => void;
}

const ImageImportModule: React.FC<ImageImportModuleProps> = ({ onHolesDetected }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
  const [analysisMeta, setAnalysisMeta] = useState<{ confidence: number; era: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Invalid file type. Please upload a high-resolution photograph of a punch card.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      setStatus('analyzing');
      setIsUploading(true);

      try {
        const result = await analyzePunchCard(base64);
        setAnalysisMeta({ confidence: result.confidence, era: result.era });
        onHolesDetected(result.holes);
        setStatus('success');
      } catch (err) {
        console.error(err);
        setStatus('error');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-emerald-500/30">
      <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Scan className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Optical Restoration</h4>
            <p className="text-[10px] text-slate-500 font-bold">AI Pattern Recognition Module</p>
          </div>
        </div>
        
        {status === 'success' && analysisMeta && (
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase">Confidence: {analysisMeta.confidence}%</span>
          </div>
        )}
      </div>

      <div className="p-8">
        {!preview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-12 text-center cursor-pointer transition-all hover:bg-emerald-500/5"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-white uppercase tracking-widest">Upload Reference Image</p>
                <p className="text-xs text-slate-500 italic max-w-xs mx-auto">Digitize physical vintage media using deep-neural computer vision protocols.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[240px]">
            <img src={preview} alt="Scan Preview" className={`w-full h-full object-cover max-h-80 transition-all ${status === 'analyzing' ? 'opacity-30 blur-sm' : ''}`} />
            
            {status === 'analyzing' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-sm space-y-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                  <Layers className="absolute inset-0 w-6 h-6 text-emerald-500 m-auto animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Mapping Hollerith Grid</p>
                  <p className="text-[9px] text-emerald-500/60 font-mono animate-pulse">Analyzing column alignment...</p>
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-[scanline_2s_infinite]"></div>
              </div>
            )}

            {status === 'success' && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur p-3 rounded-xl border border-white/5">
                   <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Era Identified</p>
                      <p className="text-[9px] text-slate-400 italic">{analysisMeta?.era}</p>
                   </div>
                </div>
                <button 
                  onClick={() => {setPreview(null); setStatus('idle'); setAnalysisMeta(null);}}
                  className="px-4 py-2 bg-slate-800/80 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-colors"
                >
                  Clear & Scan New
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/20 backdrop-blur-sm space-y-4 p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Digitization Failed</p>
                  <p className="text-[10px] text-red-400 italic">Structural mapping error. Ensure image clarity and alignment.</p>
                </div>
                <button 
                  onClick={() => {setPreview(null); setStatus('idle');}}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-colors"
                >
                  Retry Calibration
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageImportModule;
