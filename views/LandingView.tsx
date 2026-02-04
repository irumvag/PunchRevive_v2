
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, CloudRain, Zap, Layers, Atom, Database, ChevronRight
} from 'lucide-react';

const RainOverlay = () => {
  const bits = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${4 + Math.random() * 8}s`,
      delay: `${Math.random() * 5}s`,
      content: Math.random() > 0.5 ? '1' : '0',
      size: `${Math.random() * 12 + 8}px`,
      isHole: Math.random() > 0.7
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-40">
      {bits.map(bit => (
        <div
          key={bit.id}
          className={`rain-bit font-mono text-emerald-500/30 select-none ${bit.isHole ? 'w-2 h-4 bg-emerald-500/20 rounded-sm' : ''}`}
          style={{
            left: bit.left,
            animationDuration: bit.duration,
            animationDelay: bit.delay,
            fontSize: bit.size,
          }}
        >
          {!bit.isHole && bit.content}
        </div>
      ))}
    </div>
  );
};

export default function LandingView({ onEnterLab }: { onEnterLab: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [isRainActive, setIsRainActive] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden relative selection:bg-emerald-500 selection:text-white font-sans">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="shape-blob absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full"></div>
        <div className="shape-blob absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full" style={{ animationDelay: '-5s' }}></div>
      </div>

      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] pointer-events-none z-1"></div>
      
      {isRainActive && <RainOverlay />}

      <header className="absolute top-0 left-0 w-full z-50 p-8 flex justify-between items-center max-w-7xl mx-auto left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
            <Cpu className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">PUNCH<span className="text-emerald-500">REVIVE</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsRainActive(!isRainActive)} className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all border text-[10px] font-black uppercase tracking-widest ${isRainActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            <CloudRain className="w-4 h-4" /> {isRainActive ? 'Rain Active' : 'Rain Offline'}
          </button>
          <button onClick={onEnterLab} className="px-6 py-2.5 bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-slate-800 hover:text-white transition-all text-slate-400">
            Access Lab
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 h-screen flex flex-col items-center justify-center text-center">
        <div className={`space-y-8 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <Atom className="w-4 h-4 text-emerald-500 animate-spin-slow" />
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-500">Gemini 3 Pro Integrated Protocol</p>
          </div>
          <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter text-white leading-[0.8] mb-4">
            LEGACY<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 animate-gradient-x">REBORN</span>
          </h1>
          <p className="max-w-3xl mx-auto text-2xl text-slate-400 font-light mt-10 leading-relaxed">
            The world's first neural bridge for heritage mechanical media. Digitizing the foundations of computing through deep-vision archaeology.
          </p>
        </div>
        <div className={`flex flex-col md:flex-row gap-6 mt-20 transition-all duration-1000 delay-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           <button onClick={onEnterLab} className="group relative px-16 py-7 bg-emerald-600 text-white font-black uppercase tracking-[0.3em] text-sm rounded-3xl hover:bg-emerald-500 hover:scale-[1.05] transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center gap-4">
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" /> RESTORE PATTERN <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>
           <button className="px-16 py-7 border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-black uppercase tracking-[0.3em] text-sm rounded-3xl flex items-center gap-4 backdrop-blur-xl shadow-2xl">
              <Database className="w-5 h-5" /> Heritage Vault
           </button>
        </div>
      </div>

      <section className="relative z-10 py-12 bg-slate-900/20 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 grayscale opacity-20 hover:grayscale-0 hover:opacity-80 transition-all duration-700">
            {['FORTRAN_RESTORE', 'COBOL_FOUNDATION', 'IBM_HERITAGE', 'MAINFRAME_ARCHIVE'].map(partner => (
                <span key={partner} className="text-xl font-black tracking-tighter">{partner}</span>
            ))}
         </div>
      </section>

      <footer className="relative z-10 py-8 border-t border-slate-800/50 text-center">
         <div className="flex items-center justify-center gap-2 mb-2">
           <Cpu className="w-4 h-4 text-emerald-500" />
           <span className="text-sm font-black tracking-tighter text-white">PUNCH<span className="text-emerald-500">REVIVE</span></span>
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">
           &copy; 2026 PUNCHREVIVE LABS • GOOGLE GEMINI 3 CHALLENGE
         </p>
      </footer>
      
      <style>{`
        @keyframes gradient-x { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 15s ease infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
      `}</style>
    </div>
  );
}
