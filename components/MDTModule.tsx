
import React, { useState } from 'react';
import { User, IncidentReport } from '../types';
import { sanitizeOpsLog } from '../services/geminiService';

interface MDTModuleProps {
  currentUser: User;
  onIncidentSubmit: (report: IncidentReport) => void;
  isOffline: boolean;
  setIsOffline: (status: boolean) => void;
  isSurvivalMode: boolean;
}

const MDTModule: React.FC<MDTModuleProps> = ({ currentUser, onIncidentSubmit, isOffline, setIsOffline, isSurvivalMode }) => {
  const [report, setReport] = useState({ category: 'Surveillance', description: '', location: '38.89 N, 77.03 W' });
  const [isRedacting, setIsRedacting] = useState(false);

  const handlePanicWipe = () => {
    if (window.confirm("EXECUTE PANIC WIPE? LOCAL DATA WILL BE DESTROYED.")) {
      setReport({ category: 'Surveillance', description: '', location: '' });
      alert("LOCAL DATA BURNED.");
    }
  };

  const handleBeacon = () => {
    alert("EMERGENCY BEACON ACTIVE. EXTRACTION TEAM DISPATCHED.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRedacting(true);
    const sanitizedDescription = await sanitizeOpsLog(report.description);
    
    const newReport: IncidentReport = {
      id: 'IR-' + Date.now(),
      ...report,
      redactedDescription: sanitizedDescription,
      timestamp: new Date().toISOString(),
      agentId: currentUser.id,
      status: 'Classified'
    };
    onIncidentSubmit(newReport);
    setReport({ category: 'Surveillance', description: '', location: report.location });
    setIsRedacting(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button onClick={handlePanicWipe} className="bg-red-950/20 border border-red-500/50 text-red-500 py-4 text-[9px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">PANIC_WIPE</button>
        <button onClick={handleBeacon} className="bg-amber-950/20 border border-amber-500/50 text-amber-500 py-4 text-[9px] font-bold uppercase tracking-widest animate-pulse">EMERGENCY_BEACON</button>
      </div>

      <div className="bezel-card p-10 bg-[#0a0f1e]">
        <h3 className="text-sm font-black text-white uppercase mb-8 italic">Field Intelligence Entry</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea 
            value={report.description} 
            onChange={e => setReport({...report, description: e.target.value})}
            className="w-full bg-black/40 border border-white/10 p-6 text-xs text-slate-300 outline-none h-48 font-mono"
            placeholder="INPUT RAW FIELD INTEL..."
          />
          <button type="submit" disabled={isRedacting} className="w-full bg-emerald-600 py-4 text-[10px] font-bold uppercase text-white shadow-xl shadow-emerald-900/40">
            {isRedacting ? 'AUTO_REDACTING_FOR_COMPLIANCE...' : 'COMMIT_SECURE_PAYLOAD'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MDTModule;
