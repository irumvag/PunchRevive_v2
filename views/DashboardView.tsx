
import React, { useState, useEffect } from 'react';
import { User, ResurrectionResult } from '../types';
import { database } from '../services/databaseService';
import { Activity, Zap, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';

export default function DashboardView({ user }: { user: User }) {
  const [cards, setCards] = useState<ResurrectionResult[]>(database.getCards().slice(0, 5));
  const [stats, setStats] = useState({
    exorcised: 142,
    banished: 38,
    active: 9,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Bytes Exorcised', val: stats.exorcised, icon: Activity, color: 'text-blue-400' },
          { label: 'Demons Banished', val: stats.banished, icon: Zap, color: 'text-yellow-400' },
          { label: 'Active Spirits', val: stats.active, icon: ShieldAlert, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#001100] border border-[#0f0]/20 p-6 rounded relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
               <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-black border border-[#0f0]/10 rounded ${stat.color}`}>
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
          <div className="flex items-center justify-between">
             <h3 className="creepster text-3xl text-[#0f0]/80">Spectral Activity Feed</h3>
             <span className="text-[10px] bg-[#0f0]/10 px-2 py-1 text-[#0f0] font-bold">LIVE INTERCEPT</span>
          </div>

          <div className="space-y-4">
            {cards.length === 0 ? (
               <div className="py-20 text-center border border-dashed border-[#0f0]/10 rounded opacity-40">
                  <p>No recent spectral activity detected...</p>
               </div>
            ) : cards.map(card => (
              <div key={card.id} className="bg-black border border-[#0f0]/10 p-5 rounded hover:border-[#0f0]/40 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#001100] border border-[#0f0]/20 flex items-center justify-center rounded">
                     <span className="text-[10px] font-bold text-[#0f0]/60">{card.language.substring(0, 3)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">Scientist {card.author} reanimated {card.targetLanguage} logic</p>
                    <p className="text-[10px] text-[#0f0]/30 font-mono">{new Date(card.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <button className="p-2 text-[#0f0]/20 hover:text-[#0f0] transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Achievements */}
        <div className="space-y-6">
           <h3 className="creepster text-3xl text-[#0f0]/80">Honors of the Grave</h3>
           <div className="bg-[#001100] border border-[#0f0]/20 p-6 rounded space-y-6">
              {[
                { title: 'The Archaeologist', desc: 'Resurrected FORTRAN code.', status: true },
                { title: 'Exorcist I', desc: 'Banished 10 heap demons.', status: true },
                { title: 'Spectral Commuter', desc: 'Sent an encrypted message.', status: false },
              ].map((ach, i) => (
                <div key={i} className={`flex items-start gap-4 ${ach.status ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                  <div className="p-2 bg-black border border-[#0f0]/20 rounded">
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">{ach.title}</p>
                    <p className="text-[10px] text-[#0f0]/40 italic">{ach.desc}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 border border-[#0f0]/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#0f0]/5 transition-all">
                View All Medals
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
