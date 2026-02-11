
import React, { useState, useEffect } from 'react';
import { User, POI } from '../types';
import { getDailyBrief, getGeopoliticalPulse } from '../services/geminiService';

interface DashboardProps {
  user: User;
  pois: POI[];
  onTriggerDominance: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, pois, onTriggerDominance }) => {
  const [aiBrief, setAiBrief] = useState<string>("INITIALIZING_SYSTEM_READ...");
  const [pulse, setPulse] = useState<{ text: string, sources: any[] }>({ text: "SCANNING_CHANNELS...", sources: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [brief, pulseData] = await Promise.all([
        getDailyBrief(user, pois.length),
        getGeopoliticalPulse("Global flashpoints affecting US clandestine interests")
      ]);
      setAiBrief(brief);
      setPulse(pulseData);
      setIsLoading(false);
    };
    fetchData();
  }, [user, pois.length]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HUD HEADER */}
      <div className="bezel-card p-10 bg-surface/60 relative overflow-hidden min-h-[350px] flex flex-col justify-center border-accent/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--accent) 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-accent border border-accent/30 px-3 py-1 bg-accent/5 hud-bracket">NODE_ALPHA_TERMINAL</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-text-bright tracking-tighter uppercase italic leading-none monitor-flicker">
              Tactical_<span className="text-accent">Status</span>
            </h1>

            <div className="bg-black/40 border-l-4 border-accent p-6 shadow-inner">
              <p className="text-[12px] font-bold text-slate-300 leading-relaxed uppercase tracking-widest italic typewriter">
                {isLoading ? "DATA_STREAM_SYNC_IN_PROGRESS..." : `"${aiBrief}"`}
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={onTriggerDominance} className="tactical-btn bg-accent hover:bg-accent/80 text-obsidian px-10 py-4 text-[11px] font-black uppercase tracking-widest shadow-[0_0_30px_var(--accent-glow)]">
                OVERRIDE_STRATEGIC
              </button>
              <button className="tactical-btn border border-accent/40 text-accent px-10 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-accent/5">
                SAT_UPLINK
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 border-2 border-accent/10 rounded-full bg-accent/5 flex items-center justify-center overflow-hidden">
              <div className="radar-line"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="stroke-accent fill-none stroke-[0.2]">
                   <circle cx="50" cy="50" r="20" />
                   <circle cx="50" cy="50" r="35" />
                   <circle cx="50" cy="50" r="48" />
                   <line x1="50" y1="0" x2="50" y2="100" />
                   <line x1="0" y1="50" x2="100" y2="50" />
                </svg>
              </div>
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              
              <div className="relative z-10 text-center">
                <span className="text-[9px] text-slate-500 uppercase tracking-[0.4em] block mb-1">Global_Sync</span>
                <span className="text-lg font-black text-text-bright uppercase tracking-tighter italic">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* OSINT FEED */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bezel-card p-8 bg-surface/80 border-accent/10">
            <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h3 className="text-[11px] font-black text-accent uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_var(--accent-glow)]" />
                Live_Signals_Interception
              </h3>
              <div className="flex gap-4">
                 <span className="text-[8px] text-slate-600 font-black uppercase">FIPS-140 COMPLIANT</span>
                 <span className="text-[8px] text-accent font-black uppercase">ENCRYPT: AES-256</span>
              </div>
            </header>
            
            <div className="space-y-6">
              <div className="p-6 bg-black/60 border border-white/5 font-mono text-[11px] text-slate-400 leading-relaxed lowercase italic rounded-xl">
                <span className="text-accent mr-2">>>></span> {pulse.text}
              </div>
              <div className="flex flex-wrap gap-3">
                {pulse.sources.map((s, i) => (
                  <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-accent/5 hover:bg-accent/10 text-[9px] font-black text-accent/70 uppercase tracking-widest border border-accent/20 transition-all rounded-lg hud-bracket">
                    {s.title}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ASSET STATUS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'COGNITIVE_LOAD', val: '12%', color: 'text-accent', icon: '🧠' },
              { label: 'LOYALTY_INDEX', val: '99.8', color: 'text-blue-500', icon: '🔒' },
              { label: 'SYNC_STABILITY', val: 'NOMINAL', color: 'text-amber-500', icon: '🛰️' }
            ].map((m, i) => (
              <div key={i} className="bezel-card p-8 bg-surface/40 hover:bg-surface/60 transition-colors cursor-default">
                <div className="flex justify-between items-start mb-4">
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{m.label}</p>
                   <span className="opacity-40">{m.icon}</span>
                </div>
                <h4 className={`text-3xl font-black ${m.color} italic tracking-tighter uppercase`}>{m.val}</h4>
                <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-accent/40" style={{ width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR METRICS */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bezel-card p-8 bg-surface border-accent/20 shadow-2xl">
            <h3 className="text-[11px] font-black text-text-bright uppercase tracking-[0.4em] mb-8 flex items-center justify-between">
              Operational_Readiness
              <span className="w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_var(--accent-glow)]" />
            </h3>
            <div className="space-y-8">
              {[
                { label: 'Satellite Relay', val: 94, color: 'bg-accent' },
                { label: 'Crypto Entropy', val: 68, color: 'bg-blue-500' },
                { label: 'Field Buffer', val: 24, color: 'bg-red-500' }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="text-text-bright">{item.val}%</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 bg-accent/10 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-obsidian transition-all">
              SYSTEM_OPTIMIZE
            </button>
          </section>

          <section className="bezel-card p-10 bg-black/40 text-center space-y-6 border-white/5">
             <div className="text-4xl grayscale opacity-20 monitor-flicker">📡</div>
             <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Awaiting_Command_Packet</h4>
             <div className="flex justify-center gap-2">
                {[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-accent/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
