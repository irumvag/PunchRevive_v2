
import React, { useState, useEffect } from 'react';
import { User, RestorationResult, Achievement } from '../types';
import { database } from '../services/databaseService';
import { Activity, Zap, ShieldCheck, Award, ArrowUpRight, X, Trophy, Database, Terminal, Clock } from 'lucide-react';

export default function DashboardView({ user }: { user: User }) {
  const [cards, setCards] = useState<RestorationResult[]>(database.getCards().slice(0, 5));
  const [showAllMedals, setShowAllMedals] = useState(false);
  
  const stats = {
    processed: user.stats.cardsDecoded,
    optimized: user.stats.systemIntegrations + 42,
    activeNodes: 12,
  };

  const allAchievements: Achievement[] = [
    { id: 'first_scan', name: 'Digital Genesis', icon: '🎯', description: 'Digitized your first punch card record', unlocked: user.stats.cardsDecoded > 0 },
    { id: 'polyglot', name: 'Legacy Architect', icon: '🌐', description: 'Translated legacy logic to multiple modern environments', unlocked: user.stats.cardsDecoded > 5 },
    { id: 'cryptographer', name: 'Security Expert', icon: '🔐', description: 'Enabled high-entropy encryption for 10 records', unlocked: user.stats.messagesSent > 0 },
    { id: 'speed_demon', name: 'Efficient Decoder', icon: '⚡', description: 'Completed restoration in record time', unlocked: false },
    { id: 'archaeologist', name: 'Heritage Preserver', icon: '🏛️', description: 'Restored an authentic 1960s dataset', unlocked: true },
    { id: 'master', name: 'Systems Master', icon: '👑', description: 'Maintained 100+ restored records', unlocked: user.stats.cardsDecoded > 100 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Records Restored', val: stats.processed, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Logic Optimizations', val: stats.optimized, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Active Channels', val: stats.activeNodes, icon: ShieldCheck, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-xl hover:border-slate-700 transition-all">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
               <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-4 ${stat.bg} border border-white/5 rounded-xl shadow-inner ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</p>
                <p className="text-3xl font-extrabold text-white">{stat.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
             <h3 className="text-2xl font-bold text-white flex items-center gap-3"><Database className="w-6 h-6 text-emerald-500" /> Restoration Log</h3>
             <span className="text-[10px] bg-emerald-500/10 px-3 py-1 text-emerald-500 font-bold border border-emerald-500/20 rounded-full">REAL-TIME UPDATES</span>
          </div>

          <div className="space-y-4">
            {cards.length === 0 ? (
               <div className="py-32 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
                  <Terminal className="w-12 h-12 mx-auto mb-4 text-slate-800" />
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-600">No active restoration cycles detected</p>
                  <p className="text-[10px] mt-2 italic text-slate-700">Awaiting pattern input for digitization.</p>
               </div>
            ) : cards.map(card => (
              <div 
                key={card.id} 
                className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl hover:border-emerald-500/30 hover:bg-slate-900 transition-all flex items-center justify-between group cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-950 border border-slate-800 flex items-center justify-center rounded-xl shadow-inner group-hover:border-emerald-500/50 transition-colors">
                     <span className="text-[10px] font-black text-emerald-500/60">{card.language.substring(0, 3).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">Digital Restoration: {card.language} by {card.author}</p>
                    <p className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(card.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-emerald-500 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-2xl font-bold text-white flex items-center gap-3"><Award className="w-6 h-6 text-emerald-500" /> Certification</h3>
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-8 shadow-xl">
              {allAchievements.slice(0, 3).map((ach, i) => (
                <div key={i} className={`flex items-start gap-4 transition-all ${ach.unlocked ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-2xl shadow-inner">
                    {ach.icon}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-500">{ach.name}</p>
                    <p className="text-[10px] text-slate-400 italic leading-tight">{ach.description}</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setShowAllMedals(true)}
                className="w-full py-4 border border-slate-800 bg-slate-950/50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all rounded-xl group"
              >
                System Achievements <ArrowUpRight className="inline-block w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>

      {showAllMedals && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setShowAllMedals(false)}>
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl p-10 rounded-3xl relative animate-in zoom-in duration-300 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAllMedals(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all">
              <X className="w-8 h-8" />
            </button>
            <div className="flex items-center gap-6 mb-12">
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-inner">
                <Trophy className="w-12 h-12 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">System Recognition</h2>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-1">Validated restoration milestones</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
              {allAchievements.map(medal => (
                <div key={medal.id} className={`p-6 border rounded-2xl bg-slate-950/40 flex items-center gap-5 transition-all duration-500 ${medal.unlocked ? 'border-emerald-500/30' : 'border-slate-800 opacity-30'}`}>
                  <div className="text-4xl">{medal.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black uppercase text-white">{medal.name}</h4>
                    <p className="text-[10px] text-slate-500 italic mt-1 leading-snug">{medal.description}</p>
                    <span className={`text-[8px] font-black tracking-[0.2em] mt-2 block ${medal.unlocked ? 'text-emerald-500' : 'text-slate-700'}`}>
                        {medal.unlocked ? 'VALIDATED' : 'LOCKED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
