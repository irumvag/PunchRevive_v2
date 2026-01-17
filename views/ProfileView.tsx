
import React from 'react';
import { User } from '../types';
import { Award, Zap, Activity, ShieldAlert, History } from 'lucide-react';

export default function ProfileView({ user }: { user: User }) {
  return (
    <div className="space-y-12 animate-in fade-in zoom-in duration-700">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row gap-10 items-center bg-[#001100] p-10 border border-[#0f0]/20 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <Award className="w-64 h-64" />
        </div>
        <div className="w-40 h-40 rounded-full border-4 border-[#0f0] flex items-center justify-center bg-black shadow-[0_0_30px_rgba(0,255,0,0.2)]">
           <Zap className="w-20 h-20 text-[#0f0] animate-pulse" />
        </div>
        <div className="text-center md:text-left space-y-4">
           <h2 className="creepster text-6xl text-[#0f0] glow-text">{user.username}</h2>
           <div className="flex gap-4 justify-center md:justify-start">
              <span className="text-[10px] bg-[#0f0]/10 px-3 py-1 border border-[#0f0]/30 rounded uppercase font-black">Rank: Senior Exorcist</span>
              <span className="text-[10px] bg-[#0f0]/10 px-3 py-1 border border-[#0f0]/30 rounded uppercase font-black">Join Date: {new Date(user.joined).toLocaleDateString()}</span>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Achievements */}
        <div className="space-y-6">
           <h3 className="creepster text-3xl text-[#0f0]/80">Commendations</h3>
           <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'COBOL Crusher', icon: ShieldAlert, active: true },
                { label: 'Ghost Talker', icon: History, active: false },
                { label: 'The Archivist', icon: Activity, active: true },
                { label: 'Demon Hunter', icon: Award, active: true },
              ].map((ach, i) => (
                <div key={i} className={`p-4 border border-[#0f0]/20 rounded bg-[#001100] flex flex-col items-center gap-3 ${ach.active ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                   <ach.icon className="w-8 h-8 text-yellow-500" />
                   <p className="text-[10px] font-black uppercase tracking-widest">{ach.label}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Deep Stats */}
        <div className="space-y-6">
           <h3 className="creepster text-3xl text-[#0f0]/80">Laboratory Data</h3>
           <div className="bg-black border border-[#0f0]/10 p-8 rounded space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>Resurrection Progress</span>
                    <span>74%</span>
                 </div>
                 <div className="w-full h-2 bg-[#002200] rounded-full overflow-hidden">
                    <div className="w-[74%] h-full bg-[#0f0] shadow-[0_0_10px_#0f0]"></div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div>
                    <p className="text-[10px] text-[#0f0]/40 uppercase font-black">Total Scans</p>
                    <p className="text-3xl font-black">{user.stats.cardsDecoded}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-[#0f0]/40 uppercase font-black">Demons Slain</p>
                    <p className="text-3xl font-black">{user.stats.demonsBanished}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
