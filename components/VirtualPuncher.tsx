
import React, { useState, useRef, useEffect } from 'react';
import { PunchGrid, CardRow } from '../types';
import { BookOpen, Lock, Unlock, Download, Type, Key, Volume2, VolumeX } from 'lucide-react';
import { encryptWithPassword } from '../services/cryptoService';
import { IBM_029_MAP, textToGrid } from '../services/punchEncoder';

interface VirtualPuncherProps {
  grid: PunchGrid;
  setGrid: (grid: PunchGrid) => void;
  audioEnabled: boolean;
}

const VirtualPuncher: React.FC<VirtualPuncherProps> = ({ grid, setGrid, audioEnabled }) => {
  const [showRef, setShowRef] = useState(false);
  const [inputText, setInputText] = useState("");
  const [password, setPassword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [lastClicked, setLastClicked] = useState<{ col: number; row: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rowLabels = ["12", "11", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const playClack = () => {
    if (!audioEnabled) return;
    const audio = new Audio('https://www.soundjay.com/communication/typewriter-key-1.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const togglePunch = (col: number, row: number) => {
    const newGrid = [...grid.map(c => [...c])];
    newGrid[col][row] = !newGrid[col][row];
    setGrid(newGrid);
    playClack();
    setLastClicked({ col, row });
    setTimeout(() => setLastClicked(null), 400);
  };

  const applyTextToCard = async (text: string) => {
    let textToPunch = text.toUpperCase();
    if (isEncrypted && password) {
      try {
        textToPunch = await encryptWithPassword(text, password);
      } catch (e) {
        console.error("Encryption ritual failed", e);
      }
    }
    setGrid(textToGrid(textToPunch));
    playClack();
  };

  const crystalizeToImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use higher scale for better OCR
    const scale = 2;
    const baseWidth = 860;
    const baseHeight = 300;
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;
    ctx.scale(scale, scale);

    // Drawing the card base
    ctx.fillStyle = "#e5d5b0";
    ctx.fillRect(0, 0, baseWidth, baseHeight);
    
    // Aesthetic corner cut
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(baseWidth - 40, 0);
    ctx.lineTo(baseWidth, 40);
    ctx.lineTo(baseWidth, 0);
    ctx.fill();

    // High contrast labels for OCR assistance
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.font = "bold 10px monospace";
    rowLabels.forEach((label, i) => {
        ctx.fillText(label, 5, 40 + (i * 20));
        ctx.fillText(label, baseWidth - 25, 40 + (i * 20));
    });

    // Punches - Pure black on card color is best for vision models
    ctx.fillStyle = "#000000";
    grid.forEach((col, colIdx) => {
        col.forEach((isPunched, rowIdx) => {
            if (isPunched) {
                // Precise rectangles for consistent OCR patterns
                ctx.fillRect(35 + (colIdx * 10), 30 + (rowIdx * 20), 7, 14);
            }
        });
    });

    const link = document.createElement('a');
    link.download = `punchcard_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-[#002200] border border-[#0f0]/30 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-end shadow-inner">
        <div className="flex-1 w-full space-y-1">
          <label className="text-[10px] font-bold text-[#0f0]/50 uppercase flex items-center gap-1">
            <Type className="w-3 h-3" /> Inscribe Soul Message
          </label>
          <input 
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              applyTextToCard(e.target.value);
            }}
            placeholder="Type code or secret message..."
            className="w-full bg-black border border-[#0f0]/40 p-2 text-[#0f0] font-mono text-sm focus:border-[#0f0] outline-none"
          />
        </div>

        <div className="w-full md:w-auto flex gap-2">
            <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-[#0f0]/50 uppercase flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Cipher Key
                </label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password..."
                    className="w-full bg-black border border-[#0f0]/40 p-2 text-[#0f0] font-mono text-sm focus:border-[#0f0] outline-none"
                />
            </div>
            <button 
                onClick={() => {
                    const next = !isEncrypted;
                    setIsEncrypted(next);
                    applyTextToCard(inputText);
                }}
                className={`mt-auto p-2 border transition-colors ${isEncrypted ? 'bg-red-900/40 border-red-500 text-red-500' : 'bg-green-900/20 border-[#0f0]/40 text-[#0f0]/40'}`}
            >
                {isEncrypted ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </button>
        </div>

        <button 
            onClick={crystalizeToImage}
            className="h-[42px] px-4 border border-[#0f0]/60 hover:bg-[#0f0] hover:text-black text-[#0f0] transition-all flex items-center gap-2 font-bold text-xs uppercase"
        >
            <Download className="w-4 h-4" /> Crystalize
        </button>
      </div>

      <div className="bg-[#e5d5b0] text-black p-4 rounded shadow-2xl overflow-x-auto relative border-t-8 border-r-8 border-gray-400 select-none cursor-default">
        <div className="absolute top-0 right-0 w-8 h-8 bg-black transform rotate-45 translate-x-4 -translate-y-4"></div>
        <div className="flex flex-col gap-1 min-w-[1200px]">
          {rowLabels.map((label, rowIndex) => (
            <div key={label} className="flex gap-1 items-center">
              <div className="w-8 text-[10px] font-bold opacity-30 text-right pr-2">{label}</div>
              <div className="flex gap-px flex-1">
                {Array.from({ length: 80 }).map((_, colIndex) => (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    onClick={() => togglePunch(colIndex, rowIndex)}
                    className={`w-3 h-5 border border-black/10 transition-all punch-cell ${
                      grid[colIndex][rowIndex] ? 'punched' : 'bg-white/5'
                    } ${
                      lastClicked?.col === colIndex && lastClicked?.row === rowIndex ? 'punch-effect' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <button 
            onClick={() => setShowRef(!showRef)}
            className="text-[10px] text-[#0f0]/40 hover:text-[#0f0] flex items-center gap-1 uppercase font-bold transition-colors"
        >
            <BookOpen className="w-3 h-3" /> {showRef ? 'Close Grimoire' : 'Open Spectral Guide'}
        </button>
        
        <div className="flex gap-4 items-center">
            <span className="text-[9px] text-red-500/40 font-bold uppercase tracking-widest animate-pulse">Radiation Levels Nominal</span>
            <div className="h-4 w-px bg-[#0f0]/10"></div>
            <span className="text-[10px] text-[#0f0]/40 font-mono">COLUMNS: 80 | ROWS: 12</span>
        </div>
      </div>

      {showRef && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-black/40 p-4 border border-[#0f0]/10 rounded-lg backdrop-blur-sm animate-in fade-in zoom-in duration-200">
          {Object.entries(IBM_029_MAP).slice(0, 24).map(([char, rows]) => (
            <div key={char} className="flex justify-between border-b border-[#0f0]/5 text-[10px] p-1 hover:bg-[#0f0]/5 transition-colors">
              <span className="text-[#0f0] font-bold">{char}</span>
              <span className="opacity-40">{rows.join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VirtualPuncher;
