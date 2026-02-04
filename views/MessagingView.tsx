
import React, { useState, useEffect, useMemo } from 'react';
import { User, SecureMessage, PunchGrid } from '../types';
import { database } from '../services/databaseService';
import { 
  Send, Lock, Eye, Terminal, Key, ShieldCheck, X, 
  RefreshCw, Fingerprint, Waves, AlertTriangle, 
  Cpu, Activity, Users, FileCode, Box, UserCheck, Search, Database
} from 'lucide-react';
import { generateSecurePreview } from '../services/geminiService';
import { encryptWithPassword, decryptWithPassword } from '../services/cryptoService';
import { textToGrid } from '../services/punchEncoder';

const MiniPunchCard = ({ grid, isEncrypted }: { grid: PunchGrid, isEncrypted: boolean }) => (
  <div className={`p-5 rounded-2xl border ${isEncrypted ? 'bg-slate-950 border-emerald-500/30' : 'bg-white border-slate-200'} overflow-x-auto shadow-inner`}>
    <div className="flex gap-0.5 min-w-max">
      {grid.map((col, cIdx) => (
        <div key={cIdx} className="flex flex-col gap-0.5">
          {col.map((punched, rIdx) => (
            <div 
              key={rIdx} 
              className={`w-1.5 h-3 rounded-[0.5px] transition-all duration-300 ${punched ? (isEncrypted ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-900') : (isEncrypted ? 'bg-emerald-900/10' : 'bg-slate-100')}`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default function MessagingView({ user, onRefreshUser }: { user: User, onRefreshUser: () => void }) {
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [targetUser, setTargetUser] = useState('');
  const [messageText, setMessageText] = useState('');
  const [password, setPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [securityViolation, setSecurityViolation] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [selectedCardMsg, setSelectedCardMsg] = useState<SecureMessage | null>(null);

  const systemNodes = useMemo(() => [
    { id: 'node-alpha', username: 'HeritageMainframe_01', joined: Date.now(), isVerified: true, stats: { cardsDecoded: 1402, messagesSent: 88, optimizationsMade: 42, systemIntegrations: 12 }, achievements: [] },
    { id: 'node-beta', username: 'DeepLogic_Vault', joined: Date.now(), isVerified: true, stats: { cardsDecoded: 8900, messagesSent: 12, optimizationsMade: 200, systemIntegrations: 45 }, achievements: [] },
  ], []);

  useEffect(() => {
    const refreshData = () => {
      const realUsers = database.getUsers().filter(u => u.username !== user.username);
      setAvailableUsers(realUsers.length > 0 ? [...realUsers, ...systemNodes] : systemNodes);
      setMessages(database.getMessages(user.username));
    };
    refreshData();
    const interval = setInterval(refreshData, 3000); 
    return () => clearInterval(interval);
  }, [user.username, systemNodes]);

  const startVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      const updatedUser = { ...user, isVerified: true };
      database.saveUser(updatedUser);
      database.setCurrentUser(updatedUser);
      setVerifying(false);
      onRefreshUser();
    }, 800);
  };

  const handleSend = async () => {
    if (!targetUser || !messageText) return;
    setIsSending(true);
    try {
      let ciphertext = messageText;
      let isEncrypted = false;

      if (password) {
        ciphertext = await encryptWithPassword(messageText, password);
        isEncrypted = true;
      }

      const preview = isEncrypted ? await generateSecurePreview(messageText) : undefined;
      const grid = textToGrid(ciphertext);

      const newMsg: SecureMessage = {
        id: Math.random().toString(36).substr(2, 9),
        from: user.username,
        to: targetUser,
        timestamp: Date.now(),
        encryptedGrid: grid,
        ciphertext: ciphertext,
        preview: preview,
        isDecrypted: !isEncrypted,
        plaintext: !isEncrypted ? messageText : undefined
      };

      database.sendMessage(newMsg);
      setMessages(database.getMessages(user.username));
      setMessageText('');
      setPassword('');

      // Auto-reply logic for system nodes to demonstrate "Live Comms"
      if (systemNodes.find(n => n.username === targetUser)) {
        setTimeout(async () => {
            const replyText = `ACK RECEIVED. LOGIC_SEGMENT: ${newMsg.id.toUpperCase()}. ANALYZING_PATTERN...`;
            const replyGrid = textToGrid(replyText);
            const replyMsg: SecureMessage = {
                id: Math.random().toString(36).substr(2, 9),
                from: targetUser,
                to: user.username,
                timestamp: Date.now(),
                encryptedGrid: replyGrid,
                ciphertext: replyText,
                isDecrypted: true,
                plaintext: replyText
            };
            database.sendMessage(replyMsg);
            setMessages(database.getMessages(user.username));
        }, 1500);
      }
    } catch (err) {
      setSecurityViolation("ENCRYPTION_FAILURE: Handshake mismatch or protocol violation.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDecrypt = async (msgId: string) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg || !msg.ciphertext) return;
    const inputPw = prompt("ENTER SEGMENT ACCESS KEY:");
    if (inputPw === null) return;
    try {
      const decrypted = await decryptWithPassword(msg.ciphertext, inputPw);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isDecrypted: true, plaintext: decrypted } : m));
    } catch (e) {
      setSecurityViolation("AUTH_ERROR: Invalid logical signature for this data packet.");
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8 h-[750px] animate-in slide-in-from-bottom duration-500 pb-20 relative">
      {securityViolation && (
        <div className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="bg-slate-900 border-2 border-red-500 max-w-sm w-full p-10 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] space-y-6">
              <div className="flex items-center gap-4 text-red-500">
                 <AlertTriangle className="w-12 h-12" />
                 <h2 className="text-2xl font-black uppercase tracking-tight text-white">Security Alert</h2>
              </div>
              <p className="text-xs font-mono text-red-400 bg-red-500/5 p-4 rounded-xl border border-red-500/10 leading-relaxed">
                {securityViolation}
              </p>
              <button onClick={() => setSecurityViolation(null)} className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-500 transition-all">
                Close Protocol Terminal
              </button>
           </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-6 flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20"></div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-black uppercase text-white tracking-widest">Lab Directory</h3>
            </div>
            {!user.isVerified && (
              <button onClick={startVerification} className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-all" title="Fast Auth">
                 {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {availableUsers.map(u => (
                <button 
                  key={u.id}
                  onClick={() => setTargetUser(u.username)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group ${targetUser === u.username ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                >
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${targetUser === u.username ? 'text-emerald-500' : 'text-slate-400'}`}>{u.username}</span>
                      <span className="text-[8px] text-slate-600 font-mono">STATUS: {u.isVerified ? 'ACTIVE' : 'GUEST'}</span>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${u.isVerified ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-800'}`}></div>
                </button>
            ))}
          </div>

          {!user.isVerified && (
             <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-3">
                <p className="text-[9px] font-black uppercase text-emerald-500/60 tracking-[0.2em] text-center">Unverified Profile</p>
                <button 
                  onClick={startVerification} 
                  disabled={verifying}
                  className="w-full py-3 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/10"
                >
                   {verifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                   {verifying ? 'Handshaking...' : 'Authenticate Profile'}
                </button>
             </div>
          )}
      </div>

      <div className="lg:col-span-3 flex flex-col gap-6">
         <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-[2.5rem] p-10 overflow-y-auto space-y-8 shadow-inner relative scrollbar-thin">
            {!targetUser ? (
               <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-20">
                  <div className="relative">
                    <Database className="w-20 h-20 text-emerald-500 animate-pulse" />
                    <Search className="absolute -right-2 -bottom-2 w-8 h-8 text-white" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.6em] text-center max-w-xs">Initialize connection to a lab node</p>
               </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">{targetUser}</h4>
                      <p className="text-[8px] text-slate-500 font-mono tracking-widest">UPLINK_SECURE: AES-GCM-256</p>
                    </div>
                  </div>
                </div>
                
                {messages.filter(m => (m.from === user.username && m.to === targetUser) || (m.from === targetUser && m.to === user.username))
                  .sort((a,b) => a.timestamp - b.timestamp)
                  .map(m => (
                    <div key={m.id} className={`flex ${m.from === user.username ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] space-y-2 flex flex-col ${m.from === user.username ? 'items-end' : 'items-start'}`}>
                        <div className={`p-6 rounded-3xl border transition-all ${m.from === user.username ? 'bg-slate-900 border-emerald-500/30 shadow-2xl' : 'bg-slate-900 border-slate-800 shadow-xl'}`}>
                          {m.isDecrypted ? (
                            <p className="text-slate-200 text-sm font-mono leading-relaxed break-words whitespace-pre-wrap">{m.plaintext}</p>
                          ) : (
                            <div className="space-y-5">
                              <div className="bg-slate-950 p-5 border border-slate-800/50 rounded-2xl relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/40"></div>
                                 <p className="text-[8px] font-black uppercase text-emerald-500/50 mb-3 tracking-widest flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> Metadata Packet
                                 </p>
                                 <p className="text-[10px] text-slate-500 italic leading-relaxed">
                                   "{m.preview || "Restricted legacy fragment. Requires decryption key."}"
                                 </p>
                              </div>
                              <button 
                                onClick={() => handleDecrypt(m.id)} 
                                className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/10"
                              >
                                <Fingerprint className="w-4 h-4" /> Resolve Data Segment
                              </button>
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/5 opacity-40 text-[8px] font-black uppercase tracking-[0.2em]">
                             <button 
                              onClick={() => setSelectedCardMsg(m)}
                              className="flex items-center gap-2 hover:text-emerald-500 transition-colors"
                             >
                              <FileCode className="w-3.5 h-3.5" /> View Punch Card
                             </button>
                             <span className="font-mono">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
         </div>

         <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-5 shadow-2xl">
            <div className="flex gap-5">
                <div className="flex-1 relative">
                  <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                  <input 
                      type="text" 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Input logic sequence for transmission..."
                      className="w-full bg-slate-950 border border-slate-800 pl-14 pr-6 py-5 text-sm outline-none focus:border-emerald-500 text-white rounded-[1.25rem] font-mono transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="w-64 relative">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Access Key..."
                      className="w-full bg-slate-950 border border-slate-800 pl-12 pr-6 py-5 text-sm outline-none focus:border-emerald-500 text-white rounded-[1.25rem] transition-all placeholder:text-slate-700"
                  />
                </div>
                <button 
                  onClick={handleSend} 
                  disabled={!targetUser || !messageText || isSending}
                  className="px-10 bg-emerald-600 text-white flex items-center justify-center rounded-[1.25rem] hover:bg-emerald-500 transition-all disabled:opacity-20 shadow-xl shadow-emerald-900/20 group"
                >
                    {isSending ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
            </div>
         </div>
      </div>

      {selectedCardMsg && (
        <div className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setSelectedCardMsg(null)}>
           <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl p-12 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] space-y-10 animate-in zoom-in duration-300 relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-8">
                 <div className="flex items-center gap-5">
                    <Box className="w-12 h-12 text-emerald-500" />
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Hollerith Physical State</h3>
                      <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">Segment ID: PR-{selectedCardMsg.id.toUpperCase()}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedCardMsg(null)} className="p-3 text-slate-500 hover:text-white bg-slate-800 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
              </div>
              <div className="space-y-8">
                <MiniPunchCard grid={selectedCardMsg.encryptedGrid} isEncrypted={!selectedCardMsg.isDecrypted} />
                <div className="grid grid-cols-2 gap-8 pt-4">
                   <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem] relative">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6 border-b border-white/5 pb-2">Segment Ciphertext</p>
                      <pre className="text-[11px] font-mono text-emerald-500/70 whitespace-pre-wrap break-all leading-relaxed h-32 overflow-y-auto scrollbar-thin">{selectedCardMsg.ciphertext || "PACKET_EMPTY"}</pre>
                   </div>
                   <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem] space-y-4">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 border-b border-white/5 pb-2">Packet Context</p>
                      <div className="space-y-3 text-[11px] font-mono text-slate-400">
                        <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-600 uppercase">Uplink</span><span>{selectedCardMsg.from}</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-600 uppercase">Downlink</span><span>{selectedCardMsg.to}</span></div>
                        <div className="flex justify-between"><span className="text-slate-600 uppercase">Status</span><span className={selectedCardMsg.isDecrypted ? "text-emerald-500" : "text-amber-500"}>{selectedCardMsg.isDecrypted ? "DECRYPTED" : "LOCKED_AES_GCM"}</span></div>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
