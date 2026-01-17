
import React, { useState, useEffect } from 'react';
import { 
  Skull, FlaskConical, Terminal, LayoutDashboard, 
  Camera, MessageSquare, Book, User as UserIcon, 
  LogOut, Activity, Award, Search, Zap 
} from 'lucide-react';
import { database } from './services/databaseService';
import { User, ResurrectionResult, PunchGrid } from './types';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ScannerView from './views/ScannerView';
import GalleryView from './views/GalleryView';
import MessagingView from './views/MessagingView';
import ProfileView from './views/ProfileView';

type View = 'dashboard' | 'scanner' | 'gallery' | 'messaging' | 'profile';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(database.getCurrentUser());
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    const currentUser = database.getCurrentUser();
    if (currentUser) setUser(currentUser);
  }, []);

  const handleLogin = (username: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      joined: Date.now(),
      stats: { cardsDecoded: 0, messagesSent: 0, demonsBanished: 0 },
      achievements: []
    };
    database.saveUser(newUser);
    database.setCurrentUser(newUser);
    setUser(newUser);
  };

  const handleLogout = () => {
    database.setCurrentUser(null);
    setUser(null);
  };

  if (!user) return <LoginView onLogin={handleLogin} />;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView user={user} />;
      case 'scanner': return <ScannerView user={user} />;
      case 'gallery': return <GalleryView />;
      case 'messaging': return <MessagingView user={user} />;
      case 'profile': return <ProfileView user={user} />;
      default: return <DashboardView user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#0f0] font-mono selection:bg-[#0f0] selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 opacity-5 pointer-events-none -z-10 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale"></div>
      
      {/* Navigation Rail */}
      <div className="flex h-screen overflow-hidden">
        <nav className="w-20 md:w-64 border-r border-[#0f0]/20 bg-black flex flex-col p-4 space-y-8 z-50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <Skull className="w-8 h-8 text-[#0f0] animate-pulse" />
            <span className="hidden md:block creepster text-2xl tracking-tighter glow-text">PUNCHREVIVE</span>
          </div>

          <div className="flex-1 space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Control Room' },
              { id: 'scanner', icon: Camera, label: 'Scanner' },
              { id: 'gallery', icon: Book, label: 'The Vault' },
              { id: 'messaging', icon: MessageSquare, label: 'Ghost Comms' },
              { id: 'profile', icon: UserIcon, label: 'Laboratory' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`w-full flex items-center gap-4 p-3 rounded transition-all group ${
                  currentView === item.id ? 'bg-[#0f0] text-black shadow-[0_0_15px_rgba(0,255,0,0.4)]' : 'hover:bg-[#0f0]/10 text-[#0f0]/60 hover:text-[#0f0]'
                }`}
              >
                <item.icon className="w-6 h-6 shrink-0" />
                <span className="hidden md:block font-bold text-xs uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#0f0]/10 space-y-4">
            <div className="hidden md:block px-2">
                <p className="text-[10px] text-[#0f0]/30 uppercase font-black tracking-widest mb-2">Logged Scientist</p>
                <p className="text-sm font-bold truncate">{user.username}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-3 text-red-500 hover:bg-red-950/20 transition-all rounded"
            >
              <LogOut className="w-6 h-6 shrink-0" />
              <span className="hidden md:block font-bold text-xs uppercase">Terminate</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative p-6 md:p-10">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0f0]/10 pb-6">
            <div>
                <h2 className="creepster text-4xl text-[#0f0] tracking-widest capitalize">{currentView.replace('-', ' ')}</h2>
                <p className="text-[10px] text-[#0f0]/40 font-mono italic">Node ID: PR-LAB-{Math.floor(Math.random() * 9000 + 1000)} | Status: NOMINAL</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-[#001a00] border border-[#0f0]/30 rounded">
                  <Activity className="w-3 h-3 text-[#0f0] animate-pulse" />
                  <span className="text-[10px] font-bold">RADS: 0.04mSv</span>
               </div>
               <div className="h-8 w-px bg-[#0f0]/10"></div>
               <Zap className="w-5 h-5 text-yellow-500 animate-bounce" />
            </div>
          </header>

          <div className="max-w-6xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
