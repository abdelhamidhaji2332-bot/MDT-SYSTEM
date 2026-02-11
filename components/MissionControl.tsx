
import React, { useState } from 'react';
import { Mission, User, POI } from '../types';
import { getMissionReplayCritique, generateReconImage } from '../services/geminiService';

interface MissionControlProps {
  missions: Mission[];
  agents: User[];
  pois: POI[];
  onAdd: (m: Mission) => void;
  onUpdate: (m: Mission) => void;
}

const MissionControl: React.FC<MissionControlProps> = ({ missions, agents, pois, onAdd, onUpdate }) => {
  const [isComposing, setIsComposing] = useState(false);
  const [formData, setFormData] = useState({
    codeName: '', targetId: '', assets: [] as string[], roe: 'Standard Self-Defense', exfil: 'Alpha_Gate'
  });
  const [activeReplay, setActiveReplay] = useState<Mission | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isReconning, setIsReconning] = useState(false);

  const handleReplay = async (mission: Mission) => {
    setActiveReplay(mission);
    setAiAnalysis(null);
    setAnalyzing(true);
    const critique = await getMissionReplayCritique(mission);
    setAiAnalysis(critique);
    setAnalyzing(false);
  };

  const handleRequestRecon = async (mission: Mission) => {
    if (isReconning) return;
    setIsReconning(true);
    const target = pois.find(p => p.id === mission.targetId)?.name || "Target Area";
    const imageUrl = await generateReconImage(target);
    
    if (imageUrl) {
      const newRecon = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        url: imageUrl,
        timestamp: new Date().toISOString(),
        type: 'Satellite' as const,
        coords: '38.8977° N, 77.0365° W'
      };
      onUpdate({ ...mission, reconImages: [...(mission.reconImages || []), newRecon] });
    }
    setIsReconning(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: 'M-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      codeName: formData.codeName || 'OP_PHANTOM',
      status: 'Planning',
      riskRating: Math.floor(Math.random() * 10) + 1,
      assets: formData.assets,
      targetId: formData.targetId,
      roe: formData.roe,
      startTime: new Date().toISOString(),
      extractionTime: new Date(Date.now() + 3600000).toISOString(),
      exfilCorridor: formData.exfil,
      quantumUncertainty: Math.floor(Math.random() * 100),
      events: [{ time: 'T+00:00', description: 'Operation Provisioned.', decisionBy: 'DIRECTOR' }]
    });
    setIsComposing(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Mission C2</h1>
          <p className="text-slate-500 font-medium tracking-tight mt-2">Strategic Command & Control | IMINT Asset Tasking</p>
        </div>
        <button onClick={() => setIsComposing(true)} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-2xl active:scale-95 transition-all">
          Provision Operation
        </button>
      </header>

      {isComposing && (
        <section className="bg-slate-950 text-white rounded-[3rem] p-12 border border-slate-800 shadow-2xl animate-in slide-in-from-top-10 duration-500">
          <h3 className="text-3xl font-black mb-10 tracking-tight italic">Mission Provisioning Protocol</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Code Name</label>
               <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black uppercase text-sm outline-none" placeholder="e.g. BLUE_FALCON" value={formData.codeName} onChange={e => setFormData({...formData, codeName: e.target.value})} required />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Extraction Corridor Planner</label>
               <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black uppercase text-sm outline-none" value={formData.exfil} onChange={e => setFormData({...formData, exfil: e.target.value})}>
                 <option value="Alpha_Gate">Alpha_Gate (High_Speed / Risk: MED)</option>
                 <option value="Bravo_Safehouse">Bravo_Safehouse (Stealth / Risk: LOW)</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HVT Priority Target</label>
               <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-black uppercase text-sm outline-none" value={formData.targetId} onChange={e => setFormData({...formData, targetId: e.target.value})} required>
                 <option value="">Select Target...</option>
                 {pois.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
               </select>
            </div>
            <button type="submit" className="md:col-span-2 bg-blue-600 py-6 rounded-2xl font-black text-[11px] tracking-[0.4em] uppercase shadow-2xl hover:bg-blue-500 transition-all active:scale-95 mt-4">Initialize Clandestine Pipeline</button>
          </form>
        </section>
      )}

      {activeReplay && (
        <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-2xl">
           <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-8">
              <h3 className="text-3xl font-black uppercase tracking-tight italic">Mission Forensic Replay: {activeReplay.codeName}</h3>
              <button onClick={() => setActiveReplay(null)} className="text-[10px] text-slate-500 uppercase font-black border border-slate-200 px-6 py-2 rounded-xl">Terminate Playback</button>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                 {activeReplay.events.map((step, i) => (
                   <div key={i} className="flex gap-8 items-start border-l-2 border-blue-100 pl-8 relative pb-8">
                      <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-blue-600 shadow-lg" />
                      <div className="w-20 shrink-0 text-[10px] font-mono text-blue-600 font-black">{step.time}</div>
                      <div className="flex-1">
                         <p className="text-xs font-black uppercase tracking-tight text-slate-900 leading-snug">{step.description}</p>
                         <p className="text-[8px] text-slate-400 font-black uppercase mt-1">Decision_By: {step.decisionBy}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="lg:col-span-7">
                 <div className="bg-slate-950 rounded-[3rem] p-10 text-white min-h-[400px] shadow-inner relative overflow-hidden">
                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4 italic">"What Went Wrong" AI Critique</h4>
                    {analyzing ? (
                       <div className="flex flex-col items-center justify-center h-64 space-y-4">
                          <div className="w-12 h-12 border-4 border-red-900 border-t-red-500 rounded-full animate-spin" />
                          <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Running Forensic Analysis...</p>
                       </div>
                    ) : (
                       <div className="text-slate-300 text-sm leading-relaxed font-medium space-y-6">
                          {aiAnalysis?.split('\n').map((line, i) => (
                            <p key={i} className={line.startsWith('-') ? 'pl-6 border-l-2 border-red-500 py-1' : ''}>{line}</p>
                          ))}
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-6">
           {missions.map(mission => (
             <div key={mission.id} className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group hover:border-blue-600 transition-all duration-500">
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <h4 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{mission.codeName}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${mission.status === 'Active' ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`}>Status: {mission.status}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Tactical Risk</p>
                      <div className="flex gap-1.5 justify-end">
                         {[...Array(10)].map((_, i) => (
                           <div key={i} className={`w-2 h-4 rounded-full ${i < mission.riskRating ? 'bg-red-600' : 'bg-slate-100'}`} />
                         ))}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Exfil Vector</p>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{mission.exfilCorridor}</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hidden md:block">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Target HVT</p>
                      <p className="text-xs font-black text-blue-600 uppercase truncate">{pois.find(p => p.id === mission.targetId)?.name || 'UNASSIGNED'}</p>
                   </div>
                </div>

                {mission.reconImages && mission.reconImages.length > 0 && (
                   <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {mission.reconImages.map(img => (
                        <div key={img.id} className="relative group/recon rounded-2xl overflow-hidden border-2 border-slate-950 aspect-video">
                           <img src={img.url} className="w-full h-full object-cover grayscale brightness-75 group-hover/recon:grayscale-0 group-hover/recon:brightness-100 transition-all" alt="Satellite Recon" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                              <p className="text-[8px] font-black text-blue-400 uppercase">IMINT_{img.type}</p>
                              <p className="text-[7px] text-white/50 font-mono">{img.coords}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                )}

                <div className="flex gap-4">
                   <button onClick={() => handleRequestRecon(mission)} disabled={isReconning} className="flex-1 bg-slate-950 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-slate-900 shadow-2xl transition-all disabled:opacity-50">
                     {isReconning ? 'Synthesizing Recon...' : 'Request Satellite Recon'}
                   </button>
                   <button onClick={() => handleReplay(mission)} className="flex-1 bg-slate-100 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-200 transition-all border border-slate-200">Forensic Playback</button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default MissionControl;
