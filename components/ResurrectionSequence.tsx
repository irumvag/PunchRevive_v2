
import React, { useEffect, useState } from 'react';
import { Cpu, Loader2, ShieldCheck, Activity } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const ResurrectionSequence: React.FC<Props> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => onComplete(), 2200),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="text-center space-y-12 relative z-10">
        <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full animate-pulse"></div>
            <Cpu className="w-32 h-32 text-emerald-500 mx-auto animate-bounce relative z-10" />
        </div>

        <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-[0.2em] uppercase">
              {phase === 0 && "Initializing Core..."}
              {phase === 1 && "Mapping Pattern..."}
              {phase === 2 && "Decoding Logic..."}
              {phase === 3 && "Restoration Complete"}
            </h2>
            <p className="text-emerald-500/60 font-mono text-sm tracking-widest animate-pulse">
                SYS_RESTORE_SEQUENCE_0x{Math.floor(Math.random()*1000).toString(16)}
            </p>
        </div>
        
        <div className="w-80 h-1.5 bg-slate-900 mx-auto rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-500 ease-out" 
            style={{ width: `${(phase / 3) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-center gap-12 opacity-40">
           <Activity className={`w-6 h-6 transition-all ${phase >= 1 ? 'text-emerald-500 opacity-100' : ''}`} />
           <ShieldCheck className={`w-6 h-6 transition-all ${phase >= 2 ? 'text-emerald-500 opacity-100' : ''}`} />
           <Loader2 className={`w-6 h-6 animate-spin transition-all ${phase >= 3 ? 'text-emerald-500 opacity-100' : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default ResurrectionSequence;
