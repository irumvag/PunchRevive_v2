
import React, { useState, useEffect } from 'react';
import { database } from '../services/databaseService';
import { Eye, Book, Code, User, Search, X, Archive, Filter } from 'lucide-react';
import { RestorationResult, Translation } from '../types';

export default function GalleryView() {
  const [cards, setCards] = useState<RestorationResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState<RestorationResult[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'language' | 'date'>('all');

  useEffect(() => {
    const allCards = database.getCards();
    setCards(allCards);
    setFilteredCards(allCards);
  }, []);

  useEffect(() => {
    if (!cards) return;

    let result = [...cards];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(card => {
        const searchableText = [
          card.language,
          card.originalCode,
          card.author,
          card.explanation || '',
          card.resurrectedCode,
          ...Object.keys(card.translations || {}),
          ...Object.values(card.translations || {}).map(t => (t as Translation).code)
        ].join(' ').toLowerCase();

        return searchableText.includes(q);
      });
    }

    if (filterType === 'language') {
      result.sort((a, b) => a.language.localeCompare(b.language));
    } else if (filterType === 'date') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    }

    setFilteredCards(result);
  }, [searchQuery, filterType, cards]);

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-8 gap-8">
          <div className="flex items-center gap-5 w-full">
             <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                <Archive className="w-7 h-7 text-emerald-500" />
             </div>
             <div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">Data Archive</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Centralized Heritage Logic</p>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full justify-end">
            <div className="relative group min-w-[320px]">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search modules, authors, eras..." 
                 className="bg-slate-900 border border-slate-800 pl-12 pr-12 py-3 text-sm focus:border-emerald-500 outline-none w-full text-white rounded-xl transition-all"
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                   <X className="w-4 h-4" />
                 </button>
               )}
            </div>

            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'language', label: 'By Language' },
                { id: 'date', label: 'By Date' }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setFilterType(opt.id as any)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filterType === opt.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCards.length === 0 ? (
          <div className="col-span-full py-48 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <Search className="w-16 h-16 mx-auto mb-6 text-slate-800" />
            <p className="text-2xl font-bold text-slate-600">No matching records found in archive</p>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-emerald-500 hover:underline text-xs font-bold uppercase tracking-widest">Clear Search Query</button>
          </div>
        ) : filteredCards.map(card => (
          <div key={card.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group flex flex-col justify-between shadow-lg">
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-xl border border-slate-800 flex items-center justify-center bg-slate-950 group-hover:border-emerald-500/50 transition-colors">
                      <User className="w-5 h-5 text-slate-500 group-hover:text-emerald-500" />
                   </div>
                   <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">{card.author}</p>
                      <p className="text-[10px] text-slate-600 font-mono">{new Date(card.timestamp).toLocaleDateString()}</p>
                   </div>
                </div>
                <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/10">
                   {card.language}
                </span>
             </div>

             <div className="h-40 overflow-hidden relative border border-slate-800 p-4 bg-slate-950 rounded-xl shadow-inner mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
                <pre className="text-[10px] font-mono text-slate-500 whitespace-pre-wrap group-hover:text-slate-300 transition-colors">{card.resurrectedCode}</pre>
             </div>

             <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> 843</span>
                   <span className="flex items-center gap-1.5">Optimized: {card.auditReport.length}</span>
                </div>
                <button className="p-2.5 bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-400 hover:text-emerald-500 transition-all rounded-xl">
                   <Code className="w-5 h-5" />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
