
import React, { useState, useEffect } from 'react';
import { Cpu, Power, ShieldCheck, UserPlus, Info } from 'lucide-react';

export default function LoginView({ onLogin }: { onLogin: (u: string) => void }) {
  const [username, setUsername] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
        setTimeout(() => setStep(1), 800),
        setTimeout(() => setStep(2), 1600),
        setTimeout(() => setStep(3), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) onLogin(username);
  };

  return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
             <div className="w-24 h-24 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 flex items-center justify-center relative z-10">
                <Cpu className="w-12 h-12 text-emerald-500 animate-pulse" />
             </div>
             <div className="absolute inset-0 bg-emerald-500/10 blur-3xl animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold text-white tracking-tighter">PUNCH<span className="text-emerald-500">REVIVE</span></h1>
            <p className="text-[10px] text-emerald-500/40 font-black tracking-[0.5em] uppercase">
              {isSignup ? 'New Scientist Registration' : 'Enterprise Restoration Protocol'}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-8 font-mono relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          
          <div className="space-y-2 text-[10px] text-slate-500">
            <p className={`${step >= 1 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>[ SYSTEM INITIALIZING... ]</p>
            <p className={`${step >= 2 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 text-emerald-500/60`}>> SECURE_CHANNEL_READY</p>
            <p className={`${step >= 3 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 text-emerald-500/60`}>> DB_CONNECTION_STABLE</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest flex justify-between">
                <span>Scientist Identity</span>
                {isSignup && <span className="text-emerald-500">Unverified Mode</span>}
              </label>
              <input 
                autoFocus
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Scientist Username..."
                className="w-full bg-slate-950 border border-slate-800 p-4 text-emerald-500 focus:border-emerald-500 outline-none placeholder:text-slate-700 transition-all font-bold rounded-xl"
              />
            </div>
            
            <div className="space-y-4">
              <button 
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-4 font-black uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 group rounded-xl shadow-lg shadow-emerald-900/20"
              >
                {isSignup ? <UserPlus className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                {isSignup ? 'Register Profile' : 'Initialize Session'}
              </button>
              
              <button 
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="w-full py-2 text-[10px] text-slate-500 hover:text-emerald-500 transition-colors uppercase font-bold tracking-widest flex items-center justify-center gap-2"
              >
                {isSignup ? 'Return to Login' : 'Create New Scientist Profile'}
              </button>
            </div>
          </form>

          {isSignup && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex gap-3">
              <Info className="w-4 h-4 text-emerald-500 shrink-0" />
              <p className="text-[9px] text-slate-400 leading-relaxed italic">
                Secure comms require identity verification after first login. Restoration tools are available immediately.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
