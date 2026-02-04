
import React, { useState } from 'react';
import { User } from '../types';
import { Award, Zap, Activity, ShieldCheck, Cpu, History, CheckCircle2, RefreshCw, UserCheck } from 'lucide-react';
import { database } from '../services/databaseService';

export default function ProfileView({ user, onRefreshUser }: { user: User, onRefreshUser: () => void }) {
  const [verifying, setVerifying] = useState(false);

  const startVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      const updatedUser = { ...user, isVerified: true };
      database.saveUser(updatedUser);
      database.setCurrentUser(updatedUser);
      setVerifying(false);
      onRefreshUser();
    }, 800);
  };

  return (
    <div className="space-y-12 animate-in fade-in zoom-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row gap-12 items-center bg-slate-900 p-12 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Cpu className="w-72 h-72" />
        </div>
        <div className="w-48 h-48 rounded-3xl border-2 border-emerald-500/30 flex items-center justify-center bg-slate-950 shadow-2xl relative z-10 group">
           {user.isVerified ? (
             <ShieldCheck className="w-20 h-20 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
           ) : (
             <Activity className="w-20 h-20 text-slate-700" />
           )}
           <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full"></div>
        </div>
        <div className="text-center md:text-left space-y-6 relative z-10 flex-1">
           <div className="flex items-center gap-4 justify-center md:justify-start">
              <h2 className="text-6xl font-extrabold text-white tracking-tighter">{user.username}</h2>
              {user.isVerified && <CheckCircle2 className="w-10 h-10 text-emerald-500" />}
           </div>
           <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className={`text-[10px] px-4 py-2 border rounded-xl font-black uppercase tracking-widest shadow-inner ${user.isVerified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                {user.isVerified ? 'Role: Lead Systems Architect' : 'Role: Unverified Scientist'}
              </span>
              <span className="text-[10px] bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl text-slate-500 font-black uppercase tracking-widest">Active Since: {new Date(user.joined).getFullYear()}</span>
              
              {!user.isVerified && (
                <button 
                  onClick={startVerification}
                  disabled={verifying}
                  className="text-[10px] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                >
                  {verifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                  {verifying ? 'Authenticating...' : 'Verify Profile'}
                </button>
              )}
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
           <h3 className="text-2xl font-bold text-white flex items-center gap-3"><Award className="w-6 h-6 text-emerald-500" /> Professional Credentials</h3>
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'COBOL Expert', icon: ShieldCheck, active: true },
                { label: 'Modernizer', icon: Zap, active: user.isVerified },
                { label: 'System Auditor', icon: Activity, active: user.isVerified },
                { label: 'Heritage Lead', icon: History, active: false },
              ].map((ach, i) => (
                <div key={i} className={`p-6 border rounded-2xl bg-slate-900/50 flex flex-col items-center gap-4 transition-all ${ach.active ? 'border-emerald-500/30 opacity-100' : 'border-slate-800 opacity-20 grayscale'}`}>
                   <ach.icon className={`w-8 h-8 ${ach.active ? 'text-emerald-500' : 'text-slate-600'}`} />
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">{ach.label}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-2xl font-bold text-white flex items-center gap-3"><Zap className="w-6 h-6 text-emerald-500" /> Resource Statistics</h3>
           <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl space-y-8 shadow-xl">
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Archive Integrity Progress</span>
                    <span className="text-emerald-500">{user.isVerified ? '82.4%' : '14.1%'}</span>
                 </div>
                 <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: user.isVerified ? '82.4%' : '14.1%' }}></div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                 <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Total Restorations</p>
                    <p className="text-4xl font-extrabold text-white">{user.stats.cardsDecoded}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">System Fixes</p>
                    <p className="text-4xl font-extrabold text-white">{user.stats.systemIntegrations || 0}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
