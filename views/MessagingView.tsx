
import React, { useState, useEffect } from 'react';
import { User, SpectralMessage } from '../types';
import { database } from '../services/databaseService';
import { Send, Lock, Eye, Mail, Skull, Key, ShieldCheck, X, RefreshCw, Terminal, Ghost, ShieldAlert } from 'lucide-react';
import { generateKeyCard } from '../services/geminiService';

export default function MessagingView({ user }: { user: User }) {
  const [messages, setMessages] = useState<SpectralMessage[]>(database.getMessages(user.username));
  const [targetUser, setTargetUser] = useState('');
  const [messageText, setMessageText] = useState('');
  const [encryptionKey, setEncryptionKey] = useState<{ holes: [number, number][], hash: string } | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Spectral XOR encryption with Base64 encoding for safe transport
  const spectralEncrypt = (text: string, key: string) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  };

  const spectralDecrypt = (encoded: string, key: string) => {
    try {
        const text = atob(encoded);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    } catch (e) {
        return "Decryption Error: Sigil Mismatch.";
    }
  };

  const handleInitialize = async () => {
    if (!targetUser) {
        alert("Target Scientist identity required for spectral binding.");
        return;
    }
    setIsInitializing(true);
    try {
      const key = await generateKeyCard();
      setEncryptionKey(key);
      alert(`Secure channel bound to ${targetUser}.\nKey Sigil: ${key.hash.substring(0, 12)}...`);
    } catch (e) {
      alert("Failed to bind spectral keys. The frequency is blocked.");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSend = () => {
    if (!targetUser || !messageText) return;
    
    let ciphertext = messageText;
    let keyId = undefined;

    if (encryptionKey) {
      ciphertext = spectralEncrypt(messageText, encryptionKey.hash);
      keyId = encryptionKey.hash;
    }

    const newMsg: SpectralMessage = {
      id: Math.random().toString(36).substr(2, 9),
      from: user.username,
      to: targetUser,
      timestamp: Date.now(),
      encryptedGrid: Array.from({ length: 80 }, () => Array(12).fill(false)), // Visualization placeholder
      ciphertext: ciphertext,
      keyCardId: keyId,
      isDecrypted: !encryptionKey,
      plaintext: !encryptionKey ? messageText : undefined
    };

    database.sendMessage(newMsg);
    setMessages(database.getMessages(user.username));
    setMessageText('');
    
    // Achievement check
    if (!user.stats.messagesSent) {
        user.stats.messagesSent = 1;
        database.saveUser(user);
    }
    
    alert("Message cast into the void.");
  };

  const handleDecrypt = (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg || !msg.ciphertext) return;

    if (!encryptionKey || encryptionKey.hash !== msg.keyCardId) {
      alert("Spectral Signature Mismatch.\nYou need the correct key sigil to expose this logic.");
      return;
    }

    const decrypted = spectralDecrypt(msg.ciphertext, encryptionKey.hash);
    const updated = messages.map(m => m.id === msgId ? { ...m, isDecrypted: true, plaintext: decrypted } : m);
    setMessages(updated);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 h-[750px] animate-in slide-in-from-bottom duration-700 pb-20">
      {/* Contact List */}
      <div className="bg-[#001100] border border-[#0f0]/20 rounded-xl p-6 space-y-4 flex flex-col shadow-2xl">
          <div className="flex items-center gap-2 border-b border-[#0f0]/10 pb-4">
            <Terminal className="w-5 h-5 text-[#0f0]" />
            <h3 className="creepster text-2xl text-[#0f0]">Frequency Log</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-20 space-y-4">
                    <Ghost className="w-12 h-12" />
                    <p className="text-center text-[10px] uppercase font-black tracking-widest">No signals intercepted.</p>
                </div>
            ) : Array.from(new Set(messages.map(m => m.from === user.username ? m.to : m.from))).map(contact => {
                const lastMsg = messages.find(m => m.from === contact || m.to === contact);
                return (
                    <div 
                        key={contact} 
                        className={`p-4 bg-black/40 border transition-all cursor-pointer group rounded-lg ${targetUser === contact ? 'border-[#0f0] bg-[#002200]/20' : 'border-[#0f0]/10 hover:border-[#0f0]/40'}`} 
                        onClick={() => setTargetUser(contact)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-widest text-[#0f0]/80 group-hover:text-[#0f0]">{contact}</span>
                            {lastMsg?.keyCardId && <Lock className="w-3 h-3 text-red-500 opacity-60" />}
                        </div>
                        <div className="text-[8px] text-[#0f0]/30 italic flex justify-between mt-2">
                            <span>Last Signal: {new Date(lastMsg?.timestamp || 0).toLocaleTimeString()}</span>
                            {lastMsg?.isDecrypted ? <Eye className="w-3 h-3 text-green-500" /> : <ShieldAlert className="w-3 h-3" />}
                        </div>
                    </div>
                );
            })}
          </div>
      </div>

      {/* Main Chat / Composer */}
      <div className="lg:col-span-2 flex flex-col gap-6">
         <div className="flex-1 bg-black/60 border border-[#0f0]/10 rounded-xl p-8 overflow-y-auto space-y-6 shadow-inner scrollbar-thin">
            {!targetUser ? (
               <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-20">
                  <Skull className="w-24 h-24 animate-pulse" />
                  <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-[0.5em] glow-text">Secure Spectral Channel</p>
                    <p className="text-[10px] mt-2 italic tracking-widest">Awaiting target Scientist identity to begin interception.</p>
                  </div>
               </div>
            ) : messages.filter(m => m.from === targetUser || m.to === targetUser).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-30">
                    <RefreshCw className="w-10 h-10 animate-spin" />
                    <p className="text-xs font-black tracking-widest uppercase">Channel Established with {targetUser}</p>
                    <p className="text-[10px] italic">Inscribe first manifest to begin transmission.</p>
                </div>
            ) : messages.filter(m => m.from === targetUser || m.to === targetUser).sort((a,b) => a.timestamp - b.timestamp).map(m => (
              <div key={m.id} className={`flex ${m.from === user.username ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-4 rounded-xl border font-mono text-xs shadow-lg transition-all ${m.from === user.username ? 'bg-[#002200]/40 border-[#0f0]/30 ml-10' : 'bg-black/60 border-[#0f0]/20 mr-10'}`}>
                  {m.isDecrypted ? (
                    <div className="space-y-2">
                        <p className="text-[#0f0] leading-relaxed">{m.plaintext}</p>
                        <div className="h-px bg-[#0f0]/10 w-full"></div>
                        <span className="text-[8px] text-[#0f0]/30 font-bold uppercase flex items-center gap-1"><ShieldCheck className="w-2 h-2" /> Verified Sigil</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <p className="break-all opacity-20 line-clamp-2 select-none">{m.ciphertext}</p>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-red-500/30" />
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDecrypt(m.id)}
                        className="w-full flex items-center justify-center gap-2 text-[8px] bg-red-900/20 px-3 py-2 border border-red-500/30 text-red-400 font-black hover:bg-red-500 hover:text-white transition-all rounded uppercase tracking-widest"
                      >
                        <Lock className="w-3 h-3" /> EXPOSE LOGIC
                      </button>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-2 opacity-30 text-[8px] uppercase font-bold tracking-tighter">
                    <span>{m.from.toUpperCase()}</span>
                    <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
         </div>

         <div className="bg-[#001100] border border-[#0f0]/20 p-6 rounded-xl space-y-4 relative shadow-2xl">
            {isInitializing && (
               <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl">
                  <RefreshCw className="w-12 h-12 text-[#0f0] animate-spin" />
                  <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#0f0]">Binding Spectral Frequency...</p>
               </div>
            )}
            <div className="flex gap-4">
                <div className="flex-1 relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0f0]/30 group-focus-within:text-[#0f0]" />
                    <input 
                        type="text" 
                        value={targetUser}
                        onChange={(e) => setTargetUser(e.target.value)}
                        placeholder="Target Identity..."
                        className="w-full bg-black border border-[#0f0]/20 pl-10 pr-3 py-3 text-xs outline-none focus:border-[#0f0] text-[#0f0] rounded-lg transition-all"
                    />
                </div>
                <button 
                  onClick={handleInitialize}
                  className={`flex items-center gap-2 px-6 py-2 border transition-all text-[9px] font-black uppercase tracking-widest rounded-lg ${encryptionKey ? 'bg-[#0f0]/10 border-[#0f0] text-[#0f0]' : 'bg-[#0f0]/5 border-[#0f0]/20 text-[#0f0]/40 hover:text-[#0f0] hover:border-[#0f0]/60'}`}
                >
                    {encryptionKey ? <ShieldCheck className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                    {encryptionKey ? 'SIGIL BOUND' : 'BIND FREQUENCY'}
                </button>
            </div>
            <div className="flex gap-4">
                <textarea 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Inscribe your manifest for the void..."
                    className="flex-1 bg-black border border-[#0f0]/20 p-4 text-xs outline-none focus:border-[#0f0] h-24 resize-none text-[#0f0] rounded-lg scrollbar-thin transition-all placeholder:text-[#0f0]/20"
                />
                <button 
                  onClick={handleSend}
                  disabled={!targetUser || !messageText}
                  className="w-24 bg-[#0f0] text-black flex items-center justify-center rounded-lg hover:bg-white transition-all group disabled:opacity-20 shadow-lg shadow-[#0f0]/20"
                >
                    <Send className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
            {encryptionKey && (
                <div className="flex items-center justify-between text-[8px] font-black text-[#0f0]/30 uppercase tracking-[0.2em] pt-2 border-t border-[#0f0]/5">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-2 h-2" /> E2E Encrypted Spectral Channel</span>
                    <span className="opacity-50">Sigil: {encryptionKey.hash.substring(0, 32)}...</span>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}

function User({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
