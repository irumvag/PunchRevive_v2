
import React, { useState, useEffect } from 'react';
import { User, ResurrectionResult, Achievement } from '../types';
import { database } from '../services/databaseService';
import { Activity, Zap, ShieldAlert, Award, ArrowUpRight, X, Trophy, Ghost, Terminal } from 'lucide-react';

export default function DashboardView({ user }: { user: User }) {
  const [cards, setCards] = useState<ResurrectionResult[]>(database.getCards().slice(0, 5));
  const [showAllMedals, setShowAllMedals] = useState(false);
  
  const stats = {
    exorcised: user.stats.cardsDecoded * 12 + 142,
    banished: user.stats.demonsBanished + 38,
    active: 9,
  };

  const allAchievements: Achievement[] = [
    { id: 'first_scan', name: 'First Card', icon: '🎯', description: 'Scanned your first punch card', unlocked: user.stats.cardsDecoded > 0 },
    { id: 'polyglot', name: 'Polyglot', icon: '🌐', description: 'Translated to all 5 languages', unlocked: user.stats.cardsDecoded > 5 },
    { id: 'cryptographer', name: 'Cryptographer', icon: '🔐', description: 'Sent 10 encrypted messages', unlocked: user.stats.messagesSent > 0 },
    { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Decoded in under 10 seconds', unlocked: false },
    { id: 'archaeologist', name: 'Archaeologist', icon: '🏛️', description: 'Decoded a 1960s card', unlocked: true },
    { id: 'master', name: 'Master Decoder', icon: '👑', description: 'Decoded 100 cards', unlocked: user.stats.cardsDecoded > 100 }
  ];

  const handleActivityClick = (card: ResurrectionResult) => {
    // Navigate or simulate detailed view
    alert(`INTERCEPTING: ${card.author}'s fragment.\nOriginal: ${card.language}\nTarget: ${card.targetLanguage}\nStatus: ${card.status.toUpperCase()}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Bytes Exorcised', val: stats.exorcised, icon: Activity, color: 'text-blue-400' },
          { label: 'Demons Banished', val: stats.banished, icon: Zap, color: 'text-yellow-400' },
          { label: 'Active Spirits', val: stats.active, icon: ShieldAlert, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#001100] border border-[#0f0]/20 p-6 rounded relative overflow-hidden group shadow-lg hover:border-[#0f0]/60 transition-all">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
               <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-black border border-[#0f0]/10 rounded shadow-inner ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-[#0f0]/40 uppercase font-black tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black glow-text">{stat.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-[#0f0]/10 pb-2">
             <h3 className="creepster text-3xl text-[#0f0]/80 flex items-center gap-2"><Ghost className="w-6 h-6" /> Spectral Activity Feed</h3>
             <span className="text-[10px] bg-[#0f0]/10 px-2 py-1 text-[#0f0] font-bold animate-pulse border border-[#0f0]/20 rounded">LIVE INTERCEPT</span>
          </div>

          <div className="space-y-4">
            {cards.length === 0 ? (
               <div className="py-24 text-center border border-dashed border-[#0f0]/10 rounded-lg opacity-40 bg-black/20">
                  <Terminal className="w-12 h-12 mx-auto mb-4 text-[#0f0]/20" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">No recent spectral activity detected...</p>
                  <p className="text-[10px] mt-2 italic">Scanning local archives for anomalies.</p>
               </div>
            ) : cards.map(card => (
              <div 
                key={card.id} 
                onClick={() => handleActivityClick(card)}
                className="bg-black/40 border border-[#0f0]/10 p-5 rounded-lg hover:border-[#0f0]/60 hover:bg-[#001100]/40 transition-all flex items-center justify-between group cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#001100] border border-[#0f0]/20 flex items-center justify-center rounded shadow-inner group-hover:border-[#0f0] transition-colors">
                     <span className="text-[10px] font-bold text-[#0f0]/60 group-hover:text-[#0f0]">{card.language.substring(0, 3)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight text-[#0f0]/80 group-hover:text-[#0f0] transition-colors">Scientist {card.author} reanimated {card.targetLanguage} logic</p>
                    <p className="text-[10px] text-[#0f0]/30 font-mono flex items-center gap-2">
                        <Clock className="w-2 h-2" />
                        {new Date(card.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#0f0]/20 group-hover:text-[#0f0] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Achievements */}
        <div className="space-y-6">
           <h3 className="creepster text-3xl text-[#0f0]/80 flex items-center gap-2"><Award className="w-6 h-6" /> Honors of the Grave</h3>
           <div className="bg-[#001100] border border-[#0f0]/20 p-6 rounded-lg space-y-6 shadow-xl">
              {allAchievements.slice(0, 3).map((ach, i) => (
                <div key={i} className={`flex items-start gap-4 transition-all ${ach.unlocked ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                  <div className="p-3 bg-black border border-[#0f0]/20 rounded-lg text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {ach.icon}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#0f0]">{ach.name}</p>
                    <p className="text-[10px] text-[#0f0]/40 italic leading-tight">{ach.description}</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setShowAllMedals(true)}
                className="w-full py-3 border border-[#0f0]/10 bg-black/20 text-[10px] font-black uppercase tracking-widest hover:bg-[#0f0] hover:text-black transition-all rounded shadow-md group"
              >
                View All {allAchievements.length} Medals <ArrowUpRight className="inline-block w-3 h-3 ml-2 group-hover:translate-x-1" />
              </button>
           </div>
        </div>
      </div>

      {/* Achievements Modal */}
      {showAllMedals && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowAllMedals(false)}>
          <div className="bg-[#001100] border-2 border-[#0f0] w-full max-w-2xl p-10 rounded-xl relative animate-in zoom-in duration-300 shadow-[0_0_100px_rgba(0,255,0,0.2)]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAllMedals(false)} className="absolute top-6 right-6 text-[#0f0]/40 hover:text-[#0f0] hover:scale-125 transition-all">
              <X className="w-8 h-8" />
            </button>
            <div className="flex items-center gap-5 mb-10">
              <div className="p-4 bg-[#0f0]/10 border border-[#0f0]/20 rounded-2xl">
                <Trophy className="w-12 h-12 text-[#0f0]" />
              </div>
              <div>
                <h2 className="creepster text-5xl text-[#0f0] glow-text">The Trophy Crypt</h2>
                <p className="text-[10px] text-[#0f0]/40 uppercase font-black tracking-[0.3em]">Scientific achievements of the void</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
              {allAchievements.map(medal => (
                <div key={medal.id} className={`p-5 border rounded-xl bg-black/40 flex items-center gap-5 transition-all duration-500 hover:scale-[1.02] ${medal.unlocked ? 'border-[#0f0]/40 shadow-lg shadow-[#0f0]/5' : 'border-[#0f0]/5 opacity-30 grayscale'}`}>
                  <div className="text-5xl drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]">{medal.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black uppercase tracking-tighter text-[#0f0]">{medal.name}</h4>
                    <p className="text-[10px] text-[#0f0]/40 italic leading-snug mt-1">{medal.description}</p>
                    {medal.unlocked ? (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="w-1.5 h-1.5 bg-[#0f0] rounded-full animate-pulse"></div>
                        <span className="text-[8px] text-[#0f0] font-black tracking-widest">UNLOCKED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="w-1.5 h-1.5 bg-red-900 rounded-full"></div>
                        <span className="text-[8px] text-red-900 font-black tracking-widest">LOCKED</span>
                      </div>
                    )}
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

function Clock({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
