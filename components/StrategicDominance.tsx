
import React, { useState, useEffect } from 'react';
import { getStrategicDominanceOptions, getBlackBoxOraclePrediction } from '../services/geminiService';
import { POI, User } from '../types';

interface StrategicDominanceProps {
  onExit: () => void;
  pois: POI[];
  agents: User[];
}

const StrategicDominance: React.FC<StrategicDominanceProps> = ({ onExit, pois, agents }) => {
  const [options, setOptions] = useState<any[]>([]);
  const [oracleRec, setOracleRec] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyze = async () => {
      const fieldData = `Active POIs: ${pois.length}. Top Threat: ${pois[0]?.name}. Available Agents: ${agents.filter(a => a.status === 'Available').length}.`;
      const [res, oracle] = await Promise.all([
        getStrategicDominanceOptions(fieldData),
        getBlackBoxOraclePrediction(fieldData)
      ]);
      setOptions(res);
      setOracleRec(oracle);
      setLoading(false);
    };
    analyze();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[100] p-10 flex flex-col text-blue-500 font-mono overflow-y-auto">
      {/* Background Quantum Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

      <div className="flex justify-between items-start mb-20 shrink-0 relative z-10">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-blue-400 animate-pulse italic">STRATEGIC DOMINANCE OVERRIDE</h1>
          <p className="text-[10px] mt-2 text-blue-800 font-black tracking-[0.5em]">DECISION SURFACE ACTIVE | QUANTUM_MULTI_CORE_FORECASTING</p>
        </div>
        <button onClick={onExit} className="border-2 border-red-900 px-8 py-3 hover:bg-red-900 hover:text-white transition-all text-[10px] font-black tracking-[0.3em] uppercase">TERMINATE MODE</button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center flex-col gap-10 relative z-10">
           <div className="relative">
              <div className="w-32 h-32 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 border-4 border-blue-800 border-b-blue-400 rounded-full animate-reverse-spin" />
              </div>
           </div>
           <div className="text-center space-y-2">
              <p className="text-sm tracking-[1em] animate-pulse text-blue-400">SYNTHESIZING OPTIMAL TRAJECTORIES</p>
              <p className="text-[9px] text-blue-900 font-black tracking-widest uppercase">Consulting Black Box Oracle Database...</p>
           </div>
        </div>
      ) : (
        <div className="flex-1 space-y-16 relative z-10 pb-20">
          {/* Legend Tier: Black Box Oracle Display */}
          <div className="bg-slate-900/40 border-2 border-blue-900 rounded-[3rem] p-12 text-center animate-in slide-in-from-top-10 duration-700 shadow-[0_0_100px_rgba(37,99,235,0.1)] relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
             <div className="relative z-10">
                <p className="text-[11px] text-blue-700 font-black tracking-[0.6em] mb-8 uppercase italic">Black Box Oracle Directive</p>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-widest leading-tight italic uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  "{oracleRec}"
                </h2>
                <div className="mt-8 flex justify-center gap-1.5">
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="w-1 h-1 bg-blue-900 rounded-full" />
                   ))}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {options.map((opt, i) => (
              <div key={i} className="bg-slate-950 border-2 border-blue-900/50 p-12 rounded-[3rem] hover:border-blue-500 hover:bg-blue-600/5 transition-all duration-500 flex flex-col group cursor-pointer relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-6 text-[11px] font-black text-blue-900 italic tracking-widest border-b border-l border-blue-900">TRAJECTORY_{i+1}</div>
                 
                 <div className="mb-10">
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tighter group-hover:text-blue-400 transition-colors uppercase italic">{opt.name}</h3>
                    <div className="w-12 h-1 bg-blue-900 rounded-full group-hover:w-24 transition-all" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="p-6 bg-blue-950/20 border border-blue-900/50 rounded-3xl group-hover:border-blue-500 transition-all">
                      <p className="text-[10px] text-blue-800 font-black uppercase tracking-widest mb-2">Inherent Risk</p>
                      <p className={`text-3xl font-black ${opt.risk > 7 ? 'text-red-600' : 'text-blue-400'}`}>{opt.risk}/10</p>
                    </div>
                    <div className="p-6 bg-blue-950/20 border border-blue-900/50 rounded-3xl group-hover:border-blue-500 transition-all">
                      <p className="text-[10px] text-blue-800 font-black uppercase tracking-widest mb-2">Strategic Payoff</p>
                      <p className="text-3xl font-black text-emerald-500">{opt.payoff}/10</p>
                    </div>
                 </div>

                 <div className="flex-1 mb-12">
                    <p className="text-blue-300 text-sm leading-relaxed italic border-l-2 border-blue-900 pl-6 group-hover:border-blue-500 transition-all">"{opt.action}"</p>
                 </div>
                 
                 <button className="w-full py-6 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-95">
                   EXECUTE TRAJECTORY
                 </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-blue-900/50 pt-8 flex justify-between text-[11px] text-blue-900 font-black uppercase tracking-widest relative z-10">
        <div className="flex items-center gap-4">
           <span>ENCRYPTION: AES-256-QUANTUM</span>
           <span className="w-1 h-1 bg-blue-900 rounded-full" />
           <span>NODE: CONTROL_DC_WAR_ROOM</span>
        </div>
        <div className="flex items-center gap-4">
           <span>LATENCY: 0.0004 MS</span>
           <span className="w-1 h-1 bg-blue-900 rounded-full" />
           <span>CORE_SYNC: 100%</span>
        </div>
      </div>

      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StrategicDominance;
