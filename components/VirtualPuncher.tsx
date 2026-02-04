
import React, { useState, useRef, useEffect } from 'react';
import { PunchGrid } from '../types';
import { BookOpen, Lock, Unlock, Download, Type, Key, Share2, ShieldCheck, X, Search, Zap } from 'lucide-react';
import { encryptWithPassword, decryptWithPassword } from '../services/cryptoService';
import { IBM_029_MAP, textToGrid, gridToText } from '../services/punchEncoder';

interface VirtualPuncherProps {
  grid: PunchGrid;
  setGrid: (grid: PunchGrid) => void;
  audioEnabled: boolean;
}

const VirtualPuncher: React.FC<VirtualPuncherProps> = ({ grid, setGrid, audioEnabled }) => {
  const [showRef, setShowRef] = useState(false);
  const [refSearch, setRefSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [password, setPassword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [lastClicked, setLastClicked] = useState<{ col: number; row: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const lastUpdateId = useRef(0);
  const isInternalUpdate = useRef(false);

  const rowLabels = ["12", "11", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  useEffect(() => {
    const updateGrid = async () => {
      const currentId = ++lastUpdateId.current;
      let textToPunch = inputText;
      
      if (isEncrypted) {
        if (password) {
          try {
            const ciphertext = await encryptWithPassword(inputText, password);
            if (currentId !== lastUpdateId.current) return;
            textToPunch = ciphertext;
          } catch (e) {
            if (currentId !== lastUpdateId.current) return;
            textToPunch = "ENCRYPT_ERR::" + inputText.toUpperCase();
          }
        } else {
          textToPunch = "SECURE::" + inputText.toUpperCase();
        }
      }

      isInternalUpdate.current = true;
      setGrid(textToGrid(textToPunch));
      setTimeout(() => { isInternalUpdate.current = false; }, 10);
    };

    updateGrid();
  }, [inputText, isEncrypted, password, setGrid]);

  useEffect(() => {
    if (isInternalUpdate.current) return;
    const decodedText = gridToText(grid);
    if (!decodedText) return;

    if (decodedText.includes("SECURE::") || decodedText.includes("ENCRYPT_ERR::")) {
      setIsEncrypted(true);
      const parts = decodedText.split("::");
      const raw = parts[parts.length - 1] || "";
      if (raw !== inputText) setInputText(raw);
    } else if (!isEncrypted && decodedText !== inputText) {
      setInputText(decodedText);
    }
  }, [grid]);

  const handleLockToggle = async () => {
    if (!isEncrypted) {
      setIsEncrypted(true);
    } else {
      if (password) {
        const currentSecureText = gridToText(grid);
        try {
          const cleartext = await decryptWithPassword(currentSecureText, password);
          setInputText(cleartext);
          setIsEncrypted(false);
        } catch (e) {
          alert("AUTHENTICATION FAILED: Invalid Access Key.");
        }
      } else {
        setIsEncrypted(false);
      }
    }
  };

  const togglePunch = (col: number, row: number) => {
    const newGrid = [...grid.map(c => [...c])];
    newGrid[col][row] = !newGrid[col][row];
    setGrid(newGrid);
    setLastClicked({ col, row });
    setTimeout(() => setLastClicked(null), 150);
  };

  const renderCanvasToBlob = (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return Promise.resolve(null);
    const ctx = canvas.getContext('2d');
    if (!ctx) return Promise.resolve(null);

    const scale = 3;
    const baseWidth = 1200;
    const baseHeight = 540;
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;
    ctx.scale(scale, scale);

    // Deep Dark UI Background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // Main Card Body
    ctx.fillStyle = isEncrypted ? "#0f172a" : "#f1f5f9";
    ctx.beginPath();
    ctx.roundRect(20, 20, baseWidth - 40, baseHeight - 40, 8);
    ctx.fill();
    
    // Physical Card Aesthetics: Corner Cut
    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.moveTo(20, 60); ctx.lineTo(60, 20); ctx.lineTo(20, 20);
    ctx.fill();

    const marginX = 80, marginY = 80;
    const cellW = (baseWidth - marginX * 2) / 80;
    const cellH = (baseHeight - marginY * 2) / 12;

    // Draw Column Numbers (Top & Bottom)
    ctx.fillStyle = isEncrypted ? "#1e293b" : "#cbd5e1";
    ctx.font = "bold 7px IBM Plex Mono";
    for(let i = 0; i < 80; i++) {
        if((i+1) % 5 === 0) {
            ctx.fillText((i+1).toString(), marginX + i * cellW, marginY - 10);
            ctx.fillText((i+1).toString(), marginX + i * cellW, baseHeight - marginY + 20);
        }
    }

    // Draw Row Labels (Sides)
    ctx.font = "bold 10px IBM Plex Mono";
    ctx.fillStyle = isEncrypted ? "#10b981" : "#0f172a";
    rowLabels.forEach((label, i) => {
       ctx.fillText(label, 40, marginY + i * cellH + (cellH / 2) + 4);
       ctx.fillText(label, baseWidth - 60, marginY + i * cellH + (cellH / 2) + 4);
    });

    // OVERHAULED: Draw the FULL GRID of boxes (unpunched and punched)
    grid.forEach((col, cIdx) => {
      col.forEach((punched, rIdx) => {
        const x = marginX + cIdx * cellW + 1;
        const y = marginY + rIdx * cellH + 1;
        const w = cellW - 2;
        const h = cellH - 2;

        if (punched) {
          // Punched Box (Solid)
          ctx.fillStyle = isEncrypted ? "#10b981" : "#0f172a";
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, 1);
          ctx.fill();
          
          if (isEncrypted) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(16, 185, 129, 0.5)";
            ctx.strokeRect(x, y, w, h);
            ctx.shadowBlur = 0;
          }
        } else {
          // Unpunched Box (Faint Outline)
          ctx.strokeStyle = isEncrypted ? "rgba(16, 185, 129, 0.1)" : "rgba(15, 23, 42, 0.1)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, 1);
          ctx.stroke();
        }
      });
    });

    // Branding & Authenticity Marks
    ctx.font = "bold 24px Inter";
    ctx.fillStyle = isEncrypted ? "#10b981" : "#0f172a";
    ctx.fillText("PUNCHREVIVE ARCHIVE RECORD", marginX, baseHeight - 25);
    
    ctx.font = "bold 10px IBM Plex Mono";
    const statusText = `CHANNEL: ${isEncrypted ? 'ENCRYPTED_LOGIC' : 'PUBLIC_DATA'} | CHARS: ${inputText.length}`;
    ctx.fillText(statusText, baseWidth - 350, baseHeight - 25);

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
  };

  const handleAction = async (type: 'share' | 'export') => {
    const blob = await renderCanvasToBlob();
    if (!blob) return;

    if (type === 'share' && navigator.share) {
      const file = new File([blob], `punchrevive-record-${Date.now()}.png`, { type: 'image/png' });
      try {
        await navigator.share({
          files: [file],
          title: 'PunchRevive Digitized Record',
          text: `Verified restoration manifest for legacy logic sequence.`
        });
      } catch (e) { console.error(e); }
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `punchrevive-card-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className={`relative p-8 rounded-2xl shadow-2xl border-b-8 transition-all duration-500 min-w-[960px] ${isEncrypted ? 'bg-slate-800 border-emerald-500' : 'bg-white border-slate-300'}`}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-slate-900 transform rotate-45 translate-x-8 -translate-y-8"></div>
          
          <div className="flex justify-between mb-4 text-[8px] font-mono opacity-20">
            {Array.from({ length: 80 }).map((_, i) => (
              <span key={i} className={`w-[10px] text-center ${isEncrypted ? 'text-emerald-500' : 'text-slate-900'}`}>
                {(i + 1) % 5 === 0 ? i + 1 : ''}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <div className={`flex flex-col gap-1 pr-3 border-r transition-colors duration-500 ${isEncrypted ? 'border-emerald-500/20' : 'border-slate-200'}`}>
              {rowLabels.map((label, i) => (
                <div key={i} className={`h-4 flex items-center text-[10px] font-mono font-bold ${isEncrypted ? 'text-emerald-500/40' : 'text-slate-400'}`}>{label}</div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-[repeat(80,minmax(0,1fr))] gap-x-1 gap-y-1">
              {Array.from({ length: 12 }).map((_, row) => (
                <React.Fragment key={row}>
                  {Array.from({ length: 80 }).map((_, col) => (
                    <button
                      key={`${col}-${row}`}
                      onClick={() => togglePunch(col, row)}
                      className={`h-4 w-[10px] border transition-all duration-150 rounded-[1px] ${
                        grid[col][row] 
                          ? (isEncrypted ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-900 border-slate-900') 
                          : (isEncrypted ? 'bg-slate-900/40 border-emerald-900/10 hover:bg-emerald-900/20' : 'bg-slate-50 border-slate-200 hover:bg-white')
                      } ${lastClicked?.col === col && lastClicked?.row === row ? 'scale-125 z-10' : ''}`}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-6 items-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400/50">
                {inputText.length > 80 ? (
                    <span className="text-emerald-500 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> System Compaction Mode (Dense Encoding Active)
                    </span>
                ) : 'Standard 80-Column Layout'}
            </div>
            {isEncrypted && (
                <div className="flex items-center gap-2 text-emerald-500/40 text-[10px] font-black uppercase tracking-widest">
                   <ShieldCheck className="w-4 h-4" /> SECURE_DATA_PACKET
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-inner">
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-widest">Logic Stream ({inputText.length}/120)</h4>
            </div>
          </div>
          <input
            type="text"
            value={inputText}
            maxLength={120}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="INPUT PATTERN..."
            className="w-full bg-slate-950 border border-slate-800 p-4 text-emerald-500 outline-none focus:border-emerald-500/50 font-mono text-sm rounded-xl transition-all"
          />
        </div>

        <div className={`bg-slate-900/40 border p-6 rounded-2xl space-y-4 transition-all shadow-inner ${isEncrypted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${isEncrypted ? 'text-emerald-500' : 'text-slate-500'}`}>
              {isEncrypted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <h4 className="text-xs font-bold uppercase tracking-widest">{isEncrypted ? 'Restricted' : 'Public'}</h4>
            </div>
            <button 
              onClick={handleLockToggle}
              className={`px-5 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                isEncrypted ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              {isEncrypted ? 'Unlock Channel' : 'Secure Pattern'}
            </button>
          </div>
          <div className="relative">
            <Key className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isEncrypted ? 'text-emerald-500' : 'text-slate-700'}`} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="SECURE ACCESS KEY..."
              className={`w-full bg-slate-950 border p-4 pl-12 text-sm outline-none font-mono rounded-xl transition-all ${
                isEncrypted ? 'border-emerald-500/40 text-emerald-400' : 'border-slate-800 text-slate-600'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-slate-900/20 p-4 rounded-2xl border border-slate-800/50">
         <button 
          onClick={() => setShowRef(true)} 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-500 flex items-center gap-3 transition-colors"
         >
           <BookOpen className="w-5 h-5" /> Open Pattern Reference
         </button>
         <div className="flex gap-4">
           <button onClick={() => handleAction('share')} className="flex items-center gap-2 px-6 py-2 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest rounded-xl">
             <Share2 className="w-4 h-4" /> Share Card
           </button>
           <button onClick={() => handleAction('export')} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white hover:bg-emerald-500 transition-all text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-900/20">
             <Download className="w-4 h-4" /> Export High-Res PNG
           </button>
         </div>
      </div>

      {/* Pattern Reference Modal */}
      {showRef && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setShowRef(false)}>
           <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl p-10 rounded-3xl relative animate-in zoom-in duration-300 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-thin" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowRef(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white">
                <X className="w-8 h-8" />
              </button>
              
              <div className="mb-8 text-center">
                 <h2 className="text-4xl font-extrabold text-white tracking-tight">Pattern Manual</h2>
                 <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em] mt-2">IBM Hollerith Encoding Guide</p>
              </div>

              <div className="relative mb-8 max-w-md mx-auto">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                 <input 
                    type="text" 
                    value={refSearch} 
                    onChange={e => setRefSearch(e.target.value)} 
                    placeholder="Search character..." 
                    className="w-full bg-slate-950 border border-slate-800 pl-12 pr-4 py-3 text-sm text-white rounded-xl outline-none focus:border-emerald-500 transition-all"
                 />
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 {[
                   { title: 'Numbers', chars: '0123456789'.split('') },
                   { title: 'Alpha A-I', chars: 'ABCDEFGHI'.split('') },
                   { title: 'Alpha J-R', chars: 'JKLMNOPQR'.split('') },
                   { title: 'Alpha S-Z', chars: 'STUVWXYZ'.split('') },
                   { title: 'Symbols', chars: '.,()+-*/=\'":! '.split('') }
                 ].map((cat, i) => {
                   const filteredChars = cat.chars.filter(c => c.toLowerCase().includes(refSearch.toLowerCase()) || refSearch === "");
                   if (filteredChars.length === 0) return null;
                   
                   return (
                     <div key={i} className="space-y-4">
                        <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-2">{cat.title}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {filteredChars.map(char => {
                            const punches = IBM_029_MAP[char] || [];
                            const labels = punches.map(p => rowLabels[p]).join(', ');
                            return (
                              <div key={char} className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800/50 group hover:border-emerald-500/30 transition-all">
                                 <span className="text-lg font-black text-emerald-500 font-mono w-10">{char === ' ' ? 'SPC' : char}</span>
                                 <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-300 transition-colors">Rows: {labels || 'None'}</span>
                              </div>
                            );
                          })}
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VirtualPuncher;
