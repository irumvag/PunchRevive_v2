
import React, { useState, useEffect } from 'react';
import { Skull, Power, ShieldAlert } from 'lucide-react';

export default function LoginView({ onLogin }: { onLogin: (u: string) => void }) {
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
        setTimeout(() => setStep(1), 1000),
        setTimeout(() => setStep(2), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) onLogin(username);
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center p-6 selection:bg-[#0f0] selection:text-black">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
             <Skull className="w-24 h-24 text-[#0f0] mx-auto animate-pulse" />
             <div className="absolute inset-0 bg-[#0f0]/20 blur-2xl animate-pulse"></div>
          </div>
          <h1 className="creepster text-7xl text-[#0f0] tracking-tighter glow-text">PUNCHREVIVE</h1>
          <p className="text-[10px] text-[#0f0]/40 font-black tracking-[0.5em] uppercase italic">The Cryptographic Crypt</p>
        </div>

        <div className="bg-[#001100] border-2 border-[#0f0]/20 p-8 rounded shadow-[0_0_50px_rgba(0,255,0,0.1)] space-y-8 font-mono relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#0f0]/10"></div>
          
          <div className="space-y-2 text-xs">
            <p className={`${step >= 1 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>[ SYSTEM INITIALIZING... ]</p>
            <p className={`${step >= 2 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 text-[#0f0]/60`}>> FETCHING SPECTRAL NODES... DONE</p>
            <p className={`${step >= 2 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 text-[#0f0]/60`}>> BYPASSING ANALYTICAL ENGINE... OK</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-[#0f0]/40 uppercase font-bold tracking-widest">Scientist Identification</label>
              <input 
                autoFocus
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username..."
                className="w-full bg-black border border-[#0f0]/30 p-4 text-[#0f0] focus:border-[#0f0] outline-none placeholder:text-[#0f0]/20 transition-all font-bold"
              />
            </div>
            <button 
                type="submit"
                className="w-full bg-[#0f0] text-black py-4 font-black uppercase tracking-[0.3em] hover:bg-white transition-all flex items-center justify-center gap-2 group"
            >
              <Power className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              BOOT SYSTEM
            </button>
          </form>

          <div className="flex items-center gap-2 text-[8px] text-red-500/50 uppercase font-bold justify-center pt-4">
             <ShieldAlert className="w-3 h-3" />
             Unauthorized access will result in logical possession.
          </div>
        </div>
      </div>
    </div>
  );
}
