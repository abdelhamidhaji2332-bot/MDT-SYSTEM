
import React, { useState, useMemo } from 'react';
import { POI, RiskLevel, User, UserRole, POITag } from '../types';
import { generateReconImage } from '../services/geminiService';

interface POIDossierProps {
  pois: POI[];
  currentUser: User;
  onAdd: (poi: POI) => void;
  onUpdate: (poi: POI) => void;
  onDelete: (id: string) => void;
}

const POIDossier: React.FC<POIDossierProps> = ({ pois, currentUser, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAging, setIsAging] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<POI>>({});

  const canManage = [UserRole.DIRECTOR, UserRole.SAC, UserRole.SSA].includes(currentUser.role);

  const filteredPOIs = useMemo(() => {
    return pois.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.ssn.includes(searchTerm) ||
      p.aliases.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [pois, searchTerm]);

  const handleEditStart = (poi: POI) => {
    setEditForm({ ...poi });
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleAddStart = () => {
    setEditForm({
      name: '',
      dob: '',
      ssn: '',
      aliases: [],
      addresses: [],
      tags: [POITag.SUSPECT],
      riskLevel: RiskLevel.LOW,
      photoUrl: '',
      patternOfLife: '',
    });
    setIsAdding(true);
    setIsEditing(false);
    setSelectedPOI(null);
  };

  const handleSave = () => {
    if (isAdding) {
      const newPOI: POI = {
        ...editForm as POI,
        id: 'POI-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser.name,
      };
      onAdd(newPOI);
      setIsAdding(false);
    } else if (isEditing && selectedPOI) {
      const updatedPOI: POI = {
        ...selectedPOI,
        ...editForm,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser.name,
      } as POI;
      onUpdate(updatedPOI);
      setSelectedPOI(updatedPOI);
      setIsEditing(false);
    }
    setEditForm({});
  };

  const executePurge = (id: string) => {
    setConfirmDeleteId(null);
    setIsDeleting(id);
    setTimeout(() => {
      onDelete(id);
      setIsDeleting(null);
      if (selectedPOI?.id === id) {
        setSelectedPOI(null);
      }
    }, 1200);
  };

  const handleAgingSim = async () => {
    if (!selectedPOI) return;
    setIsAging(true);
    // Predictive prompt for Gemini
    const agedImageUrl = await generateReconImage(`Predictive biological aging projection: ${selectedPOI.name}. Increase age by 25 years, weathered skin, surveillance style, grayscale CCTV.`);
    if (agedImageUrl) {
      const newSim = { 
        id: Date.now().toString(), 
        url: agedImageUrl, 
        timestamp: new Date().toISOString(), 
        type: 'FacialAging' as const, 
        coords: 'PROJECTION_VAR_7.1' 
      };
      const updatedPOI = { ...selectedPOI, facialAgingPredictions: [...(selectedPOI.facialAgingPredictions || []), newSim] };
      onUpdate(updatedPOI);
      setSelectedPOI(updatedPOI);
    }
    setIsAging(false);
  };

  const ImageFallback = ({ size = "large" }: { size?: "small" | "large" }) => (
    <div className={`w-full aspect-square bg-black border-2 border-red-900/40 flex flex-col items-center justify-center relative overflow-hidden group`}>
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-[140%] h-px bg-red-600 rotate-45 absolute"></div>
        <div className="w-[140%] h-px bg-red-600 -rotate-45 absolute"></div>
      </div>
      <span className={`${size === "large" ? 'text-6xl' : 'text-3xl'} font-black text-red-900/60 relative z-10 select-none`}>X</span>
      {size === "large" && (
        <p className="text-[10px] font-black text-red-600/40 tracking-[0.3em] uppercase mt-4 relative z-10">Identity_Unknown</p>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-900/10 overflow-hidden">
        <div className="h-full bg-red-600/40 animate-[loading_3s_infinite]"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 min-h-screen">
      {/* Tactical Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bezel-card max-w-md w-full p-8 border-red-600/50 bg-red-950/10">
              <h2 className="text-red-500 font-black text-xl tracking-tighter uppercase mb-4 italic">Authorization_Required</h2>
              <p className="text-slate-400 text-xs font-mono mb-8 uppercase leading-relaxed">
                You are about to execute a permanent data purge for asset <span className="text-white">[{confirmDeleteId}]</span>. 
                This will destroy all intelligence records, biometric signatures, and signal intercepts associated with this identity. 
                This action is non-recoverable.
              </p>
              <div className="flex gap-4">
                 <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10">Abort_Protocol</button>
                 <button onClick={() => executePurge(confirmDeleteId)} className="flex-1 py-4 bg-red-600 text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-500">Confirm_Purge</button>
              </div>
           </div>
        </div>
      )}

      {(isEditing || isAdding) ? (
        <div className="bezel-card p-10 bg-surface/90 min-h-[600px] animate-in slide-in-from-bottom-10 duration-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h3 className="text-2xl font-black italic text-accent tracking-tighter uppercase">
              {isAdding ? 'Provision_New_Target_Asset' : 'Modify_Target_Dossier'}
            </h3>
            <button onClick={() => { setIsEditing(false); setIsAdding(false); setEditForm({}); }} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Abort_Protocol</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            <div className="lg:col-span-4 space-y-6">
              <div className="hud-bracket p-2 bg-black/40">
                {editForm.photoUrl ? (
                  <img src={editForm.photoUrl} className="w-full aspect-square object-cover grayscale border border-white/10" alt="Preview" />
                ) : (
                  <ImageFallback />
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Target_Photo_Link</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={editForm.photoUrl || ''} 
                    onChange={e => setEditForm({...editForm, photoUrl: e.target.value})} 
                    placeholder="https://..."
                    className="flex-1 bg-black/60 border border-white/10 p-3 text-xs text-white outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Full_Name</label>
                  <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black/60 border border-white/10 p-3 text-sm text-white outline-none focus:border-accent" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Threat_Assessment</label>
                  <select value={editForm.riskLevel} onChange={e => setEditForm({...editForm, riskLevel: e.target.value as RiskLevel})} className="w-full bg-black/60 border border-white/10 p-3 text-sm text-white outline-none focus:border-accent appearance-none">
                    {Object.values(RiskLevel).map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Pattern_of_Life_Synthesis</label>
                </div>
                <textarea value={editForm.patternOfLife || ''} onChange={e => setEditForm({...editForm, patternOfLife: e.target.value})} className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white outline-none h-32 focus:border-accent" placeholder="Input observations..." />
              </div>

              <div className="flex gap-4 pt-6">
                <button onClick={handleSave} className="flex-1 bg-accent py-5 text-[11px] font-black uppercase tracking-[0.4em] text-black shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                  {isAdding ? 'COMMENCE_PROVISIONING' : 'COMMIT_DOSSIER_CHANGES'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : selectedPOI ? (
        <div className="bezel-card p-10 bg-surface/80 min-h-[600px] animate-in zoom-in duration-300 relative overflow-hidden">
          {isDeleting === selectedPOI.id && (
             <div className="absolute inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
                <div className="w-24 h-1 bg-red-600 animate-[loading_0.5s_infinite]"></div>
                <p className="text-red-600 font-black text-sm tracking-[1em] uppercase flicker">PURGING_REGISTRY_INDEX...</p>
                <div className="text-[8px] font-mono text-slate-700">SCRUBBING_BIOMETRICS_NODE_12... OK</div>
             </div>
          )}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <button onClick={() => setSelectedPOI(null)} className="text-[10px] font-black text-accent tracking-[0.4em] uppercase hover:underline">> RETURN_TO_REGISTRY</button>
            <div className="flex gap-4">
              {canManage && (
                <>
                  <button onClick={() => handleEditStart(selectedPOI)} className="px-6 py-2 bg-accent/10 border border-accent/40 text-accent text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all">EDIT_DOSSIER</button>
                  <button onClick={() => setConfirmDeleteId(selectedPOI.id)} className="px-6 py-2 bg-red-950/20 border border-red-500/40 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">PURGE_TARGET</button>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            <div className="lg:col-span-4 space-y-6">
              <div className="relative group hud-bracket p-2 bg-black/40">
                <div className="scanline"></div>
                {selectedPOI.photoUrl ? (
                  <img src={selectedPOI.photoUrl} className="w-full aspect-square object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all border border-white/5" alt={selectedPOI.name} />
                ) : (
                  <ImageFallback />
                )}
                <div className={`absolute top-4 right-4 text-white text-[8px] font-black px-3 py-1 shadow-xl ${selectedPOI.riskLevel === RiskLevel.CRITICAL ? 'bg-red-600 animate-pulse' : 'bg-amber-600'}`}>
                   THREAT_{selectedPOI.riskLevel.toUpperCase()}
                </div>
              </div>
              
              <div className="space-y-4">
                 <h4 className="text-[9px] font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">Operational Artifacts</h4>
                 <div className="grid grid-cols-1 gap-2">
                    <button className="p-3 bg-black/40 border border-white/5 text-[8px] text-left text-slate-400 font-bold uppercase hover:bg-white/5 flex justify-between group">
                       <span>Signal_Intercept_01.wav</span>
                       <span className="text-accent animate-pulse">LIVE</span>
                    </button>
                    <button className="p-3 bg-black/40 border border-white/5 text-[8px] text-left text-slate-400 font-bold uppercase hover:bg-white/5 flex justify-between">
                       <span>Financial_Trail_LOG.pdf</span>
                       <span className="text-red-500">ENCRYPTED</span>
                    </button>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10">
              <div className="animate-in fade-in duration-500">
                <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter monitor-flicker leading-none">{selectedPOI.name}</h1>
                <p className="text-[10px] text-accent font-black mt-2 tracking-[0.5em] uppercase typewriter">Clearance: Level_7_Clandestine | UID: {selectedPOI.id}</p>
              </div>

              <div className="bg-accent/5 border-l-4 border-accent p-8 relative overflow-hidden group">
                <div className="scanline opacity-20"></div>
                <h4 className="text-[9px] font-black text-accent uppercase tracking-[0.6em] mb-4">Behavioral_Synthesis_Report</h4>
                <p className="text-sm text-slate-300 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                  {selectedPOI.patternOfLife || "Initial biometric tracking suggests standard routine. Encrypted communication detected from known hotspots. Recommend satellite follow-up."}
                </p>
              </div>

              {/* Facial Aging Lab Section */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">Neural_Facial_Projections</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedPOI.facialAgingPredictions?.map(sim => (
                     <div key={sim.id} className="bezel-card p-2 bg-slate-900/40 relative group overflow-hidden border-white/10 border-dashed hover:border-accent/40 transition-all">
                        <div className="scanline opacity-30"></div>
                        <img src={sim.url} className="w-full h-32 object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Simulation" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 border-t border-white/5">
                           <p className="text-[7px] text-accent font-black tracking-widest uppercase">PROJECTION_VAR_{sim.id.slice(-3)}</p>
                           <p className="text-[6px] text-slate-500 font-mono mt-0.5">{sim.timestamp}</p>
                        </div>
                     </div>
                  ))}
                  
                  <button 
                    onClick={handleAgingSim} 
                    disabled={isAging} 
                    className="bezel-card p-6 bg-accent/5 border-dashed border-accent/40 flex flex-col items-center justify-center gap-4 hover:bg-accent/10 transition-all group min-h-[128px]"
                  >
                      {isAging ? (
                        <div className="flex flex-col items-center gap-3">
                           <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                           <span className="text-[7px] font-black text-accent uppercase tracking-widest text-center animate-pulse">CRUNCHING_GENETIC_DRIFT...</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-3xl group-hover:scale-125 transition-transform group-hover:rotate-12">🧬</span>
                          <span className="text-[7px] font-black text-accent uppercase tracking-widest text-center">RUN_BIOLOGICAL_PROJECTION</span>
                        </>
                      )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row justify-between items-center bg-surface/40 p-6 border-b border-white/5 relative overflow-hidden gap-6">
            <div className="absolute inset-0 bg-accent/5 opacity-50 blur-[50px] pointer-events-none" />
            <h2 className="text-xs font-black text-accent tracking-[1em] uppercase italic relative z-10">Target_Registry_Index</h2>
            <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Find Identity..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-black/60 border border-white/10 px-10 py-3 text-[10px] font-black text-accent outline-none w-full md:w-64 uppercase tracking-widest focus:border-accent transition-all"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
              </div>
              {canManage && (
                <button onClick={handleAddStart} className="bg-accent text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95 transition-all">
                  Provision_Asset
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPOIs.map(p => (
              <div 
                key={p.id} 
                className="bezel-card group p-5 bg-slate-900/20 hover:bg-slate-900/40 cursor-pointer transition-all border border-white/5 relative overflow-hidden"
              >
                {isDeleting === p.id && (
                   <div className="absolute inset-0 bg-red-950/40 z-30 flex items-center justify-center backdrop-blur-sm animate-in fade-in">
                      <div className="flex flex-col items-center gap-2">
                         <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                         <span className="text-[6px] text-red-500 font-black uppercase tracking-widest">PURGING...</span>
                      </div>
                   </div>
                )}
                
                <div onClick={() => setSelectedPOI(p)}>
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="scanline opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative aspect-square mb-4 overflow-hidden border border-white/5 bg-black">
                     {p.photoUrl ? (
                       <img src={p.photoUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700" alt={p.name} />
                     ) : (
                       <ImageFallback size="small" />
                     )}
                     <div className="absolute top-2 left-2 flex gap-1">
                        {p.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-accent/20 text-accent text-[6px] font-black uppercase tracking-widest border border-accent/20">{t}</span>)}
                     </div>
                  </div>
                  <h3 className="text-xs font-black text-white uppercase tracking-tighter italic truncate">{p.name}</h3>
                  <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
                      <span className={`text-[7px] font-black uppercase tracking-widest ${p.riskLevel === RiskLevel.CRITICAL ? 'text-red-500' : 'text-slate-500'}`}>{p.riskLevel} RISK</span>
                      <span className="text-[7px] text-accent font-mono">ID_{p.id}</span>
                  </div>
                </div>

                {/* Direct Delete Trigger */}
                {canManage && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(p.id); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600/10 border border-red-600/40 text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs hover:bg-red-600 hover:text-white z-20"
                    title="QUICK_PURGE"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {filteredPOIs.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No_Matching_Asset_Identified</p>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .flicker {
          animation: flicker-red 0.15s infinite;
        }
        @keyframes flicker-red {
          0% { opacity: 0.9; text-shadow: 2px 0 red; }
          50% { opacity: 1; text-shadow: -2px 0 red; }
          100% { opacity: 0.8; text-shadow: 0 0 red; }
        }
      `}</style>
    </div>
  );
};

export default POIDossier;
