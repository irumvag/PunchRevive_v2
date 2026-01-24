
import React, { useState, useEffect } from 'react';
import { database } from '../services/databaseService';
import { Eye, Book, Code, User, Calendar, Search, Filter, X } from 'lucide-react';
import { ResurrectionResult } from '../types';

export default function GalleryView() {
  const [cards, setCards] = useState<ResurrectionResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState<ResurrectionResult[]>([]);
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
          Object.keys(card.translations || {}).join(' '),
          Object.values(card.translations || {}).map(t => (t as any).code).join(' ')
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
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-[#0f0]/10 pb-6 gap-6">
          <div className="flex items-center gap-4 w-full">
             <Book className="w-8 h-8 text-[#0f0]" />
             <h2 className="creepster text-4xl text-[#0f0]">The Spectral Vault</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full justify-end">
            <div className="relative group min-w-[300px]">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0f0]/40 group-focus-within:text-[#0f0]" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search ancient logic, authors, or eras..." 
                 className="bg-black border border-[#0f0]/20 pl-10 pr-10 py-2 text-xs focus:border-[#0f0] outline-none w-full text-[#0f0]"
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0f0]/40 hover:text-[#0f0]">
                   <X className="w-3 h-3" />
                 </button>
               )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border transition-all ${filterType === 'all' ? 'bg-[#0f0] text-black border-[#0f0]' : 'border-[#0f0]/20 text-[#0f0]/40 hover:text-[#0f0]'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterType('language')}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border transition-all ${filterType === 'language' ? 'bg-[#0f0] text-black border-[#0f0]' : 'border-[#0f0]/20 text-[#0f0]/40 hover:text-[#0f0]'}`}
              >
                Lang
              </button>
              <button 
                onClick={() => setFilterType('date')}
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border transition-all ${filterType === 'date' ? 'bg-[#0f0] text-black border-[#0f0]' : 'border-[#0f0]/20 text-[#0f0]/40 hover:text-[#0f0]'}`}
              >
                Date
              </button>
            </div>
          </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-[#0f0]/40 uppercase font-black tracking-widest">
        <span>Vault contains {cards.length} Spectral Fragments</span>
        {searchQuery && <span>Filter Result: {filteredCards.length} matches</span>}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCards.length === 0 ? (
          <div className="col-span-full py-40 text-center opacity-20 italic space-y-4">
            <Search className="w-12 h-12 mx-auto mb-4" />
            <p className="creepster text-2xl">The vault yields no results for your query.</p>
            <button onClick={() => setSearchQuery('')} className="text-[10px] underline hover:text-white transition-colors">Clear Interception Query</button>
          </div>
        ) : filteredCards.map(card => (
          <div key={card.id} className="bg-[#001100] border border-[#0f0]/20 rounded-lg p-6 hover:border-[#0f0] transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[#0f0]/10">
             <div className="absolute top-0 right-0 p-3 flex gap-2">
                <span className="text-[8px] font-black uppercase bg-[#0f0]/10 text-[#0f0] px-2 py-1 rounded border border-[#0f0]/10">
                   {card.language}
                </span>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full border border-[#0f0]/20 flex items-center justify-center bg-black group-hover:border-[#0f0]/60 transition-colors">
                      <User className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                   </div>
                   <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#0f0]/80">{card.author}</p>
                      <p className="text-[10px] text-[#0f0]/30 italic">{new Date(card.timestamp).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="h-32 overflow-hidden relative border border-[#0f0]/5 p-3 bg-black/40 rounded shadow-inner">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#001100] to-transparent z-10"></div>
                   <pre className="text-[10px] font-mono text-[#0f0]/60 opacity-50 whitespace-pre-wrap group-hover:opacity-80 transition-opacity">{card.resurrectedCode}</pre>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#0f0]/5">
                   <div className="flex items-center gap-4 text-[10px] font-black text-[#0f0]/40 uppercase tracking-widest">
                      <span className="flex items-center gap-1 hover:text-[#0f0] transition-colors"><Eye className="w-3 h-3" /> 1.2k</span>
                      <span className="flex items-center gap-1 hover:text-[#0f0] transition-colors">Possessed: {card.exorcismReport.length}</span>
                   </div>
                   <div className="flex gap-2">
                        <button className="p-2 border border-[#0f0]/10 hover:border-[#0f0] hover:bg-[#0f0] hover:text-black transition-all rounded">
                            <Code className="w-4 h-4" />
                        </button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
