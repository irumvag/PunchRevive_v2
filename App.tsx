
import React, { useState, useCallback } from 'react';
import { 
  Cpu, Terminal, LayoutDashboard, 
  Camera, MessageSquare, Book, User as UserIcon, 
  LogOut, Activity, Zap, ShieldCheck, Share2
} from 'lucide-react';
import { database } from './services/databaseService';
import { User } from './types';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ScannerView from './views/ScannerView';
import GalleryView from './views/GalleryView';
import MessagingView from './views/MessagingView';
import ProfileView from './views/ProfileView';
import LandingView from './views/LandingView';
import ArchitectureView from './views/ArchitectureView';

type View = 'dashboard' | 'scanner' | 'gallery' | 'messaging' | 'profile' | 'architecture';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(database.getCurrentUser());
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const refreshUser = useCallback(() => {
    const updated = database.getCurrentUser();
    setUser(updated);
  }, []);

  const handleLogin = (username: string) => {
    const existingUsers = database.getUsers();
    const existingUser = existingUsers.find(u => u.username === username);
    
    if (existingUser) {
      database.setCurrentUser(existingUser);
      setUser(existingUser);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        joined: Date.now(),
        isVerified: false,
        stats: { 
          cardsDecoded: 0, 
          messagesSent: 0, 
          optimizationsMade: 0, 
          systemIntegrations: 0 
        },
        achievements: []
      };
      database.saveUser(newUser);
      database.setCurrentUser(newUser);
      setUser(newUser);
    }
    setShowLogin(false);
  };

  if (!user) {
    if (showLogin) return <LoginView onLogin={handleLogin} />;
    return <LandingView onEnterLab={() => setShowLogin(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView user={user} />;
      case 'scanner': return <ScannerView user={user} />;
      case 'gallery': return <GalleryView />;
      case 'messaging': return <MessagingView user={user} onRefreshUser={refreshUser} />;
      case 'profile': return <ProfileView user={user} onRefreshUser={refreshUser} />;
      case 'architecture': return <ArchitectureView />;
      default: return <DashboardView user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex overflow-hidden">
      <nav className="w-20 md:w-72 border-r border-slate-800 bg-slate-950 flex flex-col p-6 space-y-8 z-50">
        <div className="flex items-center gap-4 px-2 mb-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <Cpu className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="hidden md:block text-2xl font-black tracking-tighter text-white">PUNCH<span className="text-emerald-500">REVIVE</span></span>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics' },
            { id: 'scanner', icon: Camera, label: 'Digitization' },
            { id: 'gallery', icon: Book, label: 'Central Vault' },
            { id: 'messaging', icon: MessageSquare, label: 'Secure Comms' },
            { id: 'architecture', icon: Share2, label: 'Blueprints' },
            { id: 'profile', icon: UserIcon, label: 'Account' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                currentView === item.id ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-800">
          <button onClick={() => { database.setCurrentUser(null); setUser(null); }} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-400 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-10 relative scrollbar-thin">
        <header className="mb-12 flex justify-between items-center border-b border-slate-800 pb-8">
           <div>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase">{currentView}</h2>
              <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">Session ID: PR-AUTH-{user.id.toUpperCase()}</p>
           </div>
           <div className="flex gap-4">
              <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
                 {user.isVerified ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <Activity className="w-4 h-4 text-slate-500" />}
                 <span className={`text-[10px] font-black uppercase tracking-widest ${user.isVerified ? 'text-emerald-500' : 'text-slate-500'}`}>
                   {user.isVerified ? 'Verified Architect' : 'Guest Access'}
                 </span>
              </div>
           </div>
        </header>
        <div className="max-w-7xl mx-auto">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
