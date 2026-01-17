
import React, { useState } from 'react';
import { database } from '../services/databaseService';
// Fix: Added Search to the list of imported icons from lucide-react
import { Eye, Book, Code, User, Calendar, Search } from 'lucide-react';

export default function GalleryView() {
  const cards = database.getCards();

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-700">
      <div className="flex justify-between items-center border-b border-[#0f0]/10 pb-6">
          <div className="flex items-center gap-4">
             <Book className="w-8 h-8 text-[#0f0]" />
             <h2 className="creepster text-4xl text-[#0f0]">The Spectral Vault</h2>
          </div>
          <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0f0]/40 group-focus-within:text-[#0f0]" />
             <input 
               type="text" 
               placeholder="Search ancient logic..." 
               className="bg-black border border-[#0f0]/20 pl-10 pr-4 py-2 text-xs focus:border-[#0f0] outline-none w-64"
             />
          </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.length === 0 ? (
          <div className="col-span-full py-40 text-center opacity-20 italic">The vault is empty. No souls have been saved yet.</div>
        ) : cards.map(card => (
          <div key={card.id} className="bg-[#001100] border border-[#0f0]/20 rounded-lg p-6 hover:border-[#0f0] transition-all group cursor-pointer relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3">
                <span className="text-[8px] font-black uppercase bg-[#0f0]/10 text-[#0f0] px-2 py-1 rounded">
                   {card.targetLanguage}
                </span>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full border border-[#0f0]/20 flex items-center justify-center bg-black">
                      <User className="w-5 h-5 opacity-40" />
                   </div>
                   <div>
                      <p className="text-xs font-bold uppercase tracking-widest">{card.author}</p>
                      <p className="text-[10px] text-[#0f0]/30 italic">{new Date(card.timestamp).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="h-32 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#001100] to-transparent z-10"></div>
                   <pre className="text-[10px] font-mono text-[#0f0]/60 opacity-50">{card.resurrectedCode}</pre>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#0f0]/5">
                   <div className="flex items-center gap-4 text-[10px] font-black text-[#0f0]/40 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 1.2k</span>
                      <span className="flex items-center gap-1">Possessed: {card.exorcismReport.length}</span>
                   </div>
                   <button className="p-2 border border-[#0f0]/20 hover:bg-[#0f0] hover:text-black transition-all">
                      <Code className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
