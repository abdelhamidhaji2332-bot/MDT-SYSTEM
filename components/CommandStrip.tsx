import React from 'react';

interface CommandStripProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPanic: () => void;
  onStealth: () => void;
}

const CommandStrip: React.FC<CommandStripProps> = ({ activeTab, setActiveTab, onPanic, onStealth }) => {
  const quickTools = [
    { id: 'dashboard', icon: '📊', label: 'HUD' },
    { id: 'mdt', icon: '📡', label: 'FIELD' },
    { id: 'messaging', icon: '💬', label: 'COMM' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-64 h-16 bg-surface/90 backdrop-blur-2xl border-t border-white/10 z-[55] flex items-center justify-between px-8 shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-10">
        {quickTools.map(tool => (
          <button 
            key={tool.id}
            onClick={() => setActiveTab(tool.id)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === tool.id ? 'text-accent scale-110 drop-shadow-[0_0_8px_var(--accent-glow)]' : 'text-slate-600 hover:text-white'}`}
          >
            <span className="text-xl">{tool.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-white/5 mx-4" />

      <div className="flex items-center gap-6">
        <button 
          onClick={onStealth}
          className="w-12 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg hover:bg-white/10 transition-all grayscale"
          title="Toggle Stealth Mode"
        >
          👁️‍🗨️
        </button>
        <button 
          onClick={onPanic}
          className="px-8 h-10 rounded-xl bg-red-600/20 border border-red-600/50 text-red-500 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-red-600 hover:text-white transition-all shadow-lg animate-pulse"
        >
          LOCKDOWN
        </button>
        <div className="hidden lg:flex flex-col items-end border-l border-white/5 pl-6 ml-2">
          <span className="text-[9px] font-black text-accent uppercase tracking-widest">UPLINK: STABLE</span>
          <span className="text-[8px] text-slate-600 font-mono italic">SESSION_TOKEN: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default CommandStrip;