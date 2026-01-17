
import React, { useEffect, useState } from 'react';
import { Zap, Ghost } from 'lucide-react';

interface ResurrectionSequenceProps {
  onComplete: () => void;
}

const ResurrectionSequence: React.FC<ResurrectionSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => onComplete(), 3500),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden">
      {/* Lightning Bolts */}
      <div className={`absolute top-0 left-1/4 animate-pulse transition-opacity duration-300 ${phase > 0 ? 'opacity-100' : 'opacity-0'}`}>
        <Zap className="text-yellow-400 w-24 h-64 blur-sm" />
      </div>
      <div className={`absolute bottom-0 right-1/4 animate-pulse transition-opacity duration-300 ${phase > 1 ? 'opacity-100' : 'opacity-0'}`}>
        <Zap className="text-blue-400 w-24 h-64 blur-sm" />
      </div>

      {/* Ectoplasm / Ghostly glow */}
      <div className={`absolute inset-0 bg-green-500/20 transition-opacity duration-1000 ${phase > 1 ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className="text-center space-y-8 relative z-10">
        <h2 className="text-6xl md:text-8xl creepster text-green-500 animate-bounce tracking-tighter glow-text">
          {phase === 0 && "SUMMONING SPIRITS..."}
          {phase === 1 && "UNSHACKLING BYTES..."}
          {phase === 2 && "BANISHING DEMONS..."}
          {phase === 3 && "RESURRECTED!"}
        </h2>
        
        <div className="flex justify-center">
            <Ghost className={`w-32 h-32 text-white/50 animate-pulse ${phase > 0 ? 'scale-125' : 'scale-50'}`} />
        </div>
        
        <div className="w-64 h-2 bg-green-900 mx-auto rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-400 transition-all duration-300" 
            style={{ width: `${(phase / 3) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Ghost sounds could be triggered here via Audio API */}
    </div>
  );
};

export default ResurrectionSequence;
