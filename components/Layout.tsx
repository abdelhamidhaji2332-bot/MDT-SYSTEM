import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOffline?: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  theme?: string;
  setTheme?: (t: any) => void;
  tacticalControls: {
    threatLevel: 'low' | 'med' | 'high'; 
    setThreatLevel: (v: 'low' | 'med' | 'high') => void;
    // Added visualMode and setVisualMode to tacticalControls to fix type error in App.tsx
    visualMode: string;
    setVisualMode: (v: any) => void;
    // Made other controls optional to allow App.tsx to pass a partial object
    isDarkSite?: boolean; 
    setIsDarkSite?: (v: boolean) => void;
    isCrisisMode?: boolean; 
    setIsCrisisMode?: (v: boolean) => void;
    isGhostMode?: boolean; 
    setIsGhostMode?: (v: boolean) => void;
    isBlackout?: boolean; 
    setIsBlackout?: (v: boolean) => void;
    isOneHandMode?: boolean; 
    setIsOneHandMode?: (v: boolean) => void;
    onPanic?: () => void;
    onKillSwitch: () => void;
  }
}

const Layout: React.FC<LayoutProps> = ({ 
  currentUser, activeTab, setActiveTab, onLogout, isSidebarOpen, setIsSidebarOpen, theme, setTheme, tacticalControls
}) => {
  const navItems = [
    { id: 'dashboard', label: 'STRATEGIC_HUD', icon: '01' },
    { id: 'mission', label: 'MISSION_C2', icon: '02' },
    { id: 'sigint', label: 'SIGINT_TERM', icon: '03' },
    { id: 'mdt', label: 'FIELD_OPS', icon: '04' },
    { id: 'team', label: 'ASSET_MGMT', icon: '05' },
    { id: 'messaging', label: 'SECURE_COMM', icon: '06' },
    { id: 'audit', label: 'AUDIT_LOG', icon: '07' },
  ];

  const getClearanceColor = (role: UserRole) => {
    if (role === UserRole.DIRECTOR) return 'text-amber-500 border-amber-500';
    if (role === UserRole.SAC || role === UserRole.SSA) return 'text-red-500 border-red-500';
    return 'text-blue-500 border-blue-500';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-xl border-b border-white/10 z-[60] flex items-center justify-between px-6 md:pl-72 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-accent font-bold">MENU</button>
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full animate-pulse bg-accent`}></span>
            <span className="text-[10px] font-black text-accent tracking-[0.2em] uppercase">SYSTEM_STATE: OMEGA</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2">
            {['slate', 'midnight', 'blood', 'arctic', 'infrared'].map(t => (
              <button 
                key={t} 
                onClick={() => setTheme?.(t)}
                className={`w-4 h-4 rounded-full border border-white/20 ${theme === t ? 'scale-125 ring-2 ring-accent' : ''}`}
                style={{ backgroundColor: t === 'slate' ? '#1e293b' : t === 'midnight' ? '#000000' : t === 'blood' ? '#ef4444' : t === 'arctic' ? '#ffffff' : '#00ff00' }}
              />
            ))}
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] font-black text-white tracking-widest uppercase">{tacticalControls.isGhostMode ? 'GHOST_SESSION' : currentUser.name}</p>
            <p className={`text-[8px] font-bold uppercase border-b ${getClearanceColor(currentUser.role)}`}>CLR: {currentUser.role}</p>
          </div>
        </div>
      </header>

      <nav className={`fixed top-0 left-0 bottom-0 w-64 bg-surface border-r border-white/5 flex flex-col z-[70] transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col items-center border-b border-white/5 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 radar-line h-px w-full" style={{ animationDuration: '2s' }}></div>
          <div className="w-14 h-14 border-2 border-accent/20 flex items-center justify-center mb-4 hud-bracket">
            <span className="text-lg font-black text-accent">Ω</span>
          </div>
          <h1 className="text-[11px] font-black text-white tracking-[0.6em] uppercase">Control_Suite</h1>
        </div>
        
        <div className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full tactical-btn group relative flex items-center gap-4 px-4 py-3 transition-all ${
                activeTab === item.id 
                  ? 'bg-accent/10 text-accent border border-accent/40 shadow-[0_0_15px_var(--accent-glow)]' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`text-[10px] font-bold ${activeTab === item.id ? 'text-accent' : 'text-slate-600'}`}>[{item.icon}]</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 space-y-3 bg-black/40 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => tacticalControls.setIsCrisisMode?.(!tacticalControls.isCrisisMode)} className={`py-2 text-[8px] font-bold border ${tacticalControls.isCrisisMode ? 'bg-accent/20 border-accent text-accent' : 'border-white/10 text-slate-500'}`}>CRISIS</button>
            <button onClick={() => tacticalControls.setIsGhostMode?.(!tacticalControls.isGhostMode)} className={`py-2 text-[8px] font-bold border ${tacticalControls.isGhostMode ? 'bg-accent/20 border-accent text-accent' : 'border-white/10 text-slate-500'}`}>GHOST</button>
          </div>
          <button onClick={tacticalControls.onPanic} className="w-full bg-red-950/20 border border-red-500/50 text-red-500 py-3 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all">
            PANIC_SIGNAL
          </button>
        </div>
      </nav>
    </>
  );
};

export default Layout;