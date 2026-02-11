
import React from 'react';
import { AuditLogEntry } from '../types';

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
  onSanitize: (id: string) => void;
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs, onSanitize }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Operational Audit Ledger</h2>
          <p className="text-slate-500 font-medium">Compliance monitoring & cryptographic verification of mission entries.</p>
        </div>
        <div className="flex gap-4">
           <button className="text-[10px] bg-slate-100 text-slate-600 px-6 py-2 rounded-xl font-black uppercase tracking-widest border border-slate-200">Export FIPS-140</button>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="bg-slate-900 px-8 py-5 flex justify-between items-center">
          <h3 className="font-black text-white text-xs tracking-widest uppercase">System Activity Record</h3>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Integrity: Verified</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Timestamp [UTC]</th>
                <th className="px-8 py-4">Identity Proxy</th>
                <th className="px-8 py-4">Action Pipeline</th>
                <th className="px-8 py-4">Resource Node</th>
                <th className="px-8 py-4 text-right">Deniability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {logs.length > 0 ? logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5 text-slate-500 text-[10px]">{new Date(log.timestamp).toISOString().replace('T', ' ').split('.')[0]}</td>
                  <td className="px-8 py-5">
                    <span className="font-black text-slate-800">{log.userName}</span>
                    <br />
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{log.userId}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest ${
                      log.action.includes('Burned') || log.action.includes('Kill') ? 'bg-red-100 text-red-700' : 
                      log.action.includes('View') ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-slate-600 font-bold uppercase">{log.resourceType}</span>
                    <br />
                    <span className="text-[9px] text-slate-400 font-mono">{log.resourceId}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => onSanitize(log.id)}
                      className="text-[9px] font-black text-blue-600 hover:text-blue-800 tracking-widest uppercase border border-blue-200 px-3 py-1 rounded-lg bg-blue-50 transition-all active:scale-95"
                    >
                      Sanitize
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <span className="text-6xl mb-4">📜</span>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ledger Empty: Synchronizing with Mainframe...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogViewer;
