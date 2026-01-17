
import React, { useState } from 'react';
import { User, SpectralMessage } from '../types';
import { database } from '../services/databaseService';
import { Send, Lock, Eye, Mail, Skull } from 'lucide-react';

export default function MessagingView({ user }: { user: User }) {
  const [messages, setMessages] = useState<SpectralMessage[]>(database.getMessages(user.username));
  const [targetUser, setTargetUser] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (!targetUser || !messageText) return;
    const newMsg: SpectralMessage = {
      id: Math.random().toString(36).substr(2, 9),
      from: user.username,
      to: targetUser,
      timestamp: Date.now(),
      encryptedGrid: Array.from({ length: 80 }, () => Array(12).fill(false)), // Simulating encrypted grid
      isDecrypted: false,
    };
    database.sendMessage(newMsg);
    setMessages(database.getMessages(user.username));
    setMessageText('');
    alert("Message cast into the void!");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 h-[700px] animate-in slide-in-from-bottom duration-700">
      {/* Contact List */}
      <div className="bg-[#001100] border border-[#0f0]/20 rounded p-4 space-y-4">
          <h3 className="creepster text-2xl text-[#0f0]">Frequency Log</h3>
          <div className="space-y-2">
            {messages.length === 0 ? (
                <p className="text-center py-10 text-[10px] opacity-40 italic">No signals intercepted.</p>
            ) : messages.map(m => (
                <div key={m.id} className="p-3 bg-black border border-[#0f0]/10 hover:border-[#0f0] transition-all cursor-pointer group">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold">{m.from === user.username ? m.to : m.from}</span>
                      <Mail className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                   </div>
                   <p className="text-[8px] text-[#0f0]/30 italic">{new Date(m.timestamp).toLocaleString()}</p>
                </div>
            ))}
          </div>
      </div>

      {/* Main Chat / Composer */}
      <div className="lg:col-span-2 flex flex-col gap-6">
         <div className="flex-1 bg-black/40 border border-[#0f0]/10 rounded p-6 overflow-y-auto space-y-6">
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-20">
               <Skull className="w-16 h-16" />
               <p className="text-sm font-black uppercase tracking-[0.5em]">Secure Spectral Channel</p>
            </div>
         </div>

         <div className="bg-[#001100] border border-[#0f0]/20 p-6 rounded space-y-4">
            <div className="flex gap-4">
                <input 
                    type="text" 
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value)}
                    placeholder="Recipient Identity..."
                    className="flex-1 bg-black border border-[#0f0]/20 p-3 text-xs outline-none focus:border-[#0f0]"
                />
                <div className="flex items-center gap-2 px-3 py-1 bg-[#0f0]/5 border border-[#0f0]/20 rounded">
                    <Lock className="w-3 h-3 text-[#0f0]" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">RSA-2048 Sigil</span>
                </div>
            </div>
            <div className="flex gap-4">
                <textarea 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Inscribe your encrypted manifest..."
                    className="flex-1 bg-black border border-[#0f0]/20 p-3 text-xs outline-none focus:border-[#0f0] h-20 resize-none"
                />
                <button 
                  onClick={handleSend}
                  className="w-20 bg-[#0f0] text-black flex items-center justify-center hover:bg-white transition-all group"
                >
                    <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}
