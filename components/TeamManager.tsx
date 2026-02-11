
import React, { useState, useMemo } from 'react';
import { User, UserRole, UserStatus, Alert } from '../types';

interface TeamManagerProps {
  currentUser: User;
  users: User[];
  onSendAlert: (alert: Alert) => void;
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onKickUser: (userId: string) => void;
}

const TeamManager: React.FC<TeamManagerProps> = ({ currentUser, users, onSendAlert, onAddUser, onUpdateUser, onKickUser }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    badge: '',
    role: UserRole.SPECIAL_AGENT,
    securityCode: '',
    specialization: '',
    status: UserStatus.OFF_DUTY,
    biometricIntegrity: 100
  });

  const canManage = [
    UserRole.DIRECTOR, 
    UserRole.DEPUTY_DIRECTOR, 
    UserRole.ASSISTANT_DIRECTOR, 
    UserRole.SAC, 
    UserRole.SSA
  ].includes(currentUser.role);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handlePushAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertMessage) return;
    onSendAlert({
      id: Math.random().toString(36).substr(2, 9),
      priority,
      message: alertMessage,
      from: currentUser.name,
      timestamp: new Date().toISOString()
    });
    setAlertMessage('');
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setIsAdding(false);
    setFormData({
      name: user.name,
      badge: user.badgeNumber,
      role: user.role,
      securityCode: user.securityCode,
      specialization: user.specialization || '',
      status: user.status,
      biometricIntegrity: user.biometricIntegrity || 100
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.badge || !formData.securityCode) return;

    const baseName = formData.name.trim().toUpperCase();
    const formattedName = baseName.startsWith('AGENT') ? baseName : `AGENT ${baseName}`;

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        name: formattedName,
        badgeNumber: formData.badge.trim().toUpperCase(),
        role: formData.role,
        securityCode: formData.securityCode.trim(),
        status: formData.status,
        specialization: formData.specialization || 'General Duties',
        biometricIntegrity: formData.biometricIntegrity
      });
      setEditingUser(null);
    } else {
      onAddUser({
        id: 'u' + Date.now(),
        name: formattedName,
        badgeNumber: formData.badge.trim().toUpperCase(),
        role: formData.role,
        securityCode: formData.securityCode.trim(),
        status: UserStatus.OFF_DUTY,
        specialization: formData.specialization || 'General Duties',
        biometricIntegrity: 100
      });
    }
    
    setFormData({ name: '', badge: '', role: UserRole.SPECIAL_AGENT, securityCode: '', specialization: '', status: UserStatus.OFF_DUTY, biometricIntegrity: 100 });
    setIsAdding(false);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.DIRECTOR: return 'text-red-600 bg-red-50 border-red-100';
      case UserRole.SAC:
      case UserRole.SSA: return 'text-slate-900 bg-slate-100 border-slate-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Dynamic Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -mr-16 -mt-16 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="px-2 py-0.5 rounded bg-blue-600 text-[8px] font-black text-white uppercase tracking-widest">CIA Control Node</div>
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Management Terminal</h2>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Intelligence Roster</h1>
          <p className="text-slate-500 mt-2 text-xs font-medium font-mono">SECTOR_ID: DC-88-OPS | ENCRYPTED_LEDGER_SYNCED</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Find Intelligence Asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-slate-100 border-2 border-transparent focus:border-blue-600 rounded-2xl px-10 py-3 text-xs font-bold transition-all outline-none uppercase tracking-widest"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
           </div>
           {canManage && (
              <button 
                onClick={() => {
                    if (editingUser) setEditingUser(null);
                    else setIsAdding(!isAdding);
                }}
                className={`px-8 py-3 rounded-2xl font-black text-[10px] shadow-xl transition-all active:scale-95 uppercase tracking-widest ${
                  (isAdding || editingUser) ? 'bg-red-600 text-white shadow-red-500/20' : 'bg-slate-900 text-white shadow-slate-900/20'
                }`}
              >
                {(isAdding || editingUser) ? 'Cancel Operation' : 'Provision Asset'}
              </button>
           )}
        </div>
      </header>

      {/* Enrollment / Edit Protocol Form */}
      {(isAdding || editingUser) && (
        <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in slide-in-from-top-8 duration-500 relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 animate-pulse" />
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                {editingUser ? '📝' : '👤'}
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                {editingUser ? 'Asset Record Re-classification' : 'Identity Provisioning Protocol'}
              </h3>
              <p className="text-[10px] text-blue-400 font-mono font-bold tracking-widest">
                {editingUser ? `MODIFYING_UID: ${editingUser.id}` : 'LEVEL_4_CLEARANCE_REQUIRED'}
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Operational Surname</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all uppercase placeholder:text-slate-700"
                placeholder="e.g. MILLER"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Agency Badge Proxy</label>
              <input 
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData(prev => ({...prev, badge: e.target.value}))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-mono font-bold focus:border-blue-600 outline-none transition-all uppercase placeholder:text-slate-700"
                placeholder="CIA-XXXX"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Intelligence Specialization</label>
              <input 
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData(prev => ({...prev, specialization: e.target.value}))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all uppercase placeholder:text-slate-700"
                placeholder="Cyber / Field Ops / Signals"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Security Rank</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData(prev => ({...prev, role: e.target.value as UserRole}))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all cursor-pointer appearance-none"
              >
                {Object.values(UserRole).map(role => <option key={role} value={role} className="bg-slate-900">{role}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Secure Pass-key</label>
              <input 
                type="password"
                value={formData.securityCode}
                onChange={(e) => setFormData(prev => ({...prev, securityCode: e.target.value}))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all placeholder:text-slate-700"
                placeholder="********"
                required
              />
            </div>
            {editingUser && (
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Status Override</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as UserStatus}))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-600 outline-none transition-all cursor-pointer appearance-none"
                >
                  {Object.values(UserStatus).map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                </select>
              </div>
            )}
            <div className="flex items-end lg:col-span-1">
              <button 
                type="submit"
                className="w-full h-[60px] bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/50 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
              >
                {editingUser ? 'Commit Profile Re-classification' : 'Execute Identity Link'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Main Roster Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map(person => (
              <div key={person.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-blue-500 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-12 -mt-12 rounded-full group-hover:bg-blue-50 transition-colors" />
                
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-slate-200 shrink-0">
                  {person.name.split(' ').pop()?.[0]}
                </div>

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h4 className="font-black text-slate-900 text-base uppercase tracking-tight truncate">{person.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border border-current self-center ${getRoleColor(person.role)}`}>
                      {person.role}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono truncate mb-2">{person.specialization || 'GENERAL INTELLIGENCE'}</p>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                    <div className="flex items-center gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${person.status === UserStatus.AVAILABLE ? 'bg-emerald-500' : person.status === UserStatus.BUSY ? 'bg-amber-500' : 'bg-slate-300'}`} />
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{person.status}</span>
                    </div>
                    <div className="h-3 w-px bg-slate-100" />
                    <span className="text-[9px] font-mono font-bold text-blue-600">{person.badgeNumber}</span>
                  </div>

                  {/* Biometric Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Biometric Stability</span>
                      <span className={`text-[8px] font-black ${person.biometricIntegrity && person.biometricIntegrity > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{person.biometricIntegrity}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${person.biometricIntegrity && person.biometricIntegrity > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${person.biometricIntegrity}%` }} />
                    </div>
                  </div>
                </div>

                {canManage && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <button 
                      onClick={() => startEdit(person)}
                      className="text-slate-400 hover:text-blue-600 p-2 transition-all"
                      title="Modify Intelligence Record"
                    >
                      <span className="text-lg">✏️</span>
                    </button>
                    {person.id !== currentUser.id && (
                      <button 
                        onClick={() => onKickUser(person.id)}
                        className="text-slate-400 hover:text-red-500 p-2 transition-all"
                        title="Revoke Credentials"
                      >
                        <span className="text-lg">✕</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2rem] py-20 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">No Identity Match Found in Local Agency Registry</p>
            </div>
          )}
        </div>

        {/* Right Sidebar HUD */}
        <div className="xl:col-span-4 space-y-8">
           {/* High-Tech Alert Terminal */}
           {canManage && (
             <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
               <div className="flex justify-between items-center mb-8 relative z-10">
                 <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                   SECURE BROADCAST
                 </h3>
                 <span className="text-[7px] font-mono text-slate-500">ENCRYPT_LEVEL: AES-256</span>
               </div>
               
               <form onSubmit={handlePushAlert} className="space-y-6 relative z-10">
                 <div className="grid grid-cols-3 gap-2">
                   {['High', 'Medium', 'Low'].map(p => (
                     <button
                       key={p}
                       type="button"
                       onClick={() => setPriority(p as any)}
                       className={`py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                         priority === p 
                           ? (p === 'High' ? 'bg-red-600 border-red-600 shadow-lg shadow-red-900/40' : p === 'Medium' ? 'bg-amber-600 border-amber-600 shadow-lg shadow-amber-900/40' : 'bg-white text-slate-900 border-white')
                           : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                       }`}
                     >
                       {p}
                     </button>
                   ))}
                 </div>
                 <textarea 
                   value={alertMessage}
                   onChange={(e) => setAlertMessage(e.target.value)}
                   placeholder="Enter encrypted briefing narrative..."
                   className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-[11px] font-medium focus:border-blue-600 outline-none transition-all placeholder:text-slate-700 min-h-[120px] resize-none"
                 />
                 <button 
                   type="submit"
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/40 transition-all active:scale-95 uppercase tracking-[0.2em] text-[9px]"
                 >
                   Inject Intel Uplink
                 </button>
               </form>
             </section>
           )}

           {/* Tactical Monitoring Feed */}
           <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3 border-b border-slate-50 pb-4">
               <span className="text-blue-500">🛡️</span> Asset Status Log
             </h3>
             <div className="space-y-6">
                {[
                  { m: 'Biometric stability check complete', t: '2m ago', s: 'STABLE' },
                  { m: 'Personnel roster synchronized', t: '14m ago', s: 'OK' },
                  { m: 'Security credentials rotated', t: '2h ago', s: 'ROTATED' },
                  { m: 'Satellite Relay Node active', t: '12h ago', s: 'SYNCED' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-blue-600" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-slate-800 leading-tight uppercase tracking-tight">{item.m}</p>
                        <span className="text-[7px] font-black text-blue-500 ml-2 tracking-widest">{item.s}</span>
                      </div>
                      <p className="text-[8px] text-slate-400 font-mono mt-0.5 uppercase tracking-widest font-bold">{item.t}</p>
                    </div>
                  </div>
                ))}
             </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default TeamManager;
