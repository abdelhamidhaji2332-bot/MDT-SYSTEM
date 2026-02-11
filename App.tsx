import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, UserStatus, POI, Mission, AuditLogEntry, Alert, Message } from './types';
import { MOCK_USERS, MOCK_POIS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MDTModule from './components/MDTModule';
import TeamManager from './components/TeamManager';
import Messaging from './components/Messaging';
import AuditLogViewer from './components/AuditLogViewer';
import Login from './components/Login';
import MissionControl from './components/MissionControl';
import StrategicDominance from './components/StrategicDominance';
import SignalIntelligence from './components/SignalIntelligence';
import CommandStrip from './components/CommandStrip';
import { sanitizeOpsLog } from './services/geminiService';

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [visualMode, setVisualMode] = useState<'standard' | 'infrared' | 'thermal' | 'stealth' | 'lockdown' | 'analyst' | 'director'>('standard');
  const [threatLevel, setThreatLevel] = useState<'low' | 'med' | 'high'>('low');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMFAVerified, setIsMFAVerified] = useState(false);
  
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [pois, setPois] = useState<POI[]>(MOCK_POIS);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isDominanceMode, setIsDominanceMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const body = document.body;
    body.classList.remove('mode-infrared', 'mode-thermal', 'mode-crisis', 'mode-lockdown', 'role-director', 'role-analyst');
    
    if (visualMode === 'infrared') body.classList.add('mode-infrared');
    if (visualMode === 'thermal') body.classList.add('mode-thermal');
    if (visualMode === 'lockdown') body.classList.add('mode-lockdown');
    if (visualMode === 'stealth') body.classList.add('mode-crisis');
    
    if (currentUser?.role === UserRole.DIRECTOR) body.classList.add('role-director');
    else body.classList.add('role-analyst');

  }, [visualMode, currentUser]);

  const addAuditLog = useCallback((action: string, resourceType: string, resourceId: string) => {
    if (!currentUser) return;
    const entry: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      resourceType,
      resourceId
    };
    setAuditLogs(prev => [entry, ...prev]);
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsMFAVerified(true);
    addAuditLog('Session Established', 'Auth', user.id);
  };

  const handleLogout = () => {
    if (currentUser) addAuditLog('Session Terminated', 'Auth', currentUser.id);
    setCurrentUser(null);
    setIsMFAVerified(false);
    setVisualMode('standard');
  };

  const handleDeletePOI = (id: string) => {
    const canDelete = [UserRole.DIRECTOR, UserRole.SAC, UserRole.SSA].includes(currentUser?.role as UserRole);
    if (!canDelete) {
      alert("INSUFFICIENT_CLEARANCE: DELETE_ACTION_REJECTED");
      return;
    }
    
    setPois(prev => prev.filter(p => p.id !== id));
    addAuditLog('Destructive Data Purge', 'POI', id);
  };

  const handleUpdatePOI = (updated: POI) => {
    setPois(prev => prev.map(p => p.id === updated.id ? updated : p));
    addAuditLog('Registry Update', 'POI', updated.id);
  };

  if (isBooting) return (
    <div className="fixed inset-0 bg-[#010409] flex flex-col items-center justify-center p-12 overflow-hidden z-[999]">
      <div className="w-full max-w-lg font-mono text-[10px] text-emerald-500 space-y-1 h-96 overflow-hidden relative border border-emerald-500/20 p-4 bg-emerald-500/5">
        <div className="absolute inset-0 bg-gradient-to-t from-[#010409] to-transparent pointer-events-none z-10" />
        <div className="space-y-1 animate-pulse">
          <p>[0.0000] CIA_CONTROL KERNEL v12.0.8</p>
          <p>[0.0012] SECURE_HANDSHAKE: DC_SERVER_UPLINK... OK</p>
          <p>[0.0045] DECRYPTING_OVERSIGHT_BYPASS... OK</p>
          <p>[0.0122] LOADING_ATMOSPHERE_ENGINE... [Scanlines, Grain, Vignette]</p>
          <p>[0.0456] ESTABLISHING_QUANTUM_UPLINK... OK</p>
          <p>[0.1245] BIO_METRIC_SENSORS: INITIALIZING</p>
          <p>[0.4552] LOADING_POI_REGISTRY: 512_RECORDS</p>
          <p>[0.8992] HUD_BRAKETS: ENGAGING</p>
          <p>[1.2112] THERMAL_IMAGING_MODULE: ONLINE</p>
          <p>[1.6772] CRITICAL_BLOOM_FILTERS: ACTIVE</p>
          <p>[2.1122] AUTH_ACCEPTED: CLEARANCE_PENDING</p>
          <p>[3.5552] PROTOCOL_OMEGA: FULL_SYSTEM_TAKEOVER</p>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="w-48 h-1 bg-emerald-500/10 rounded-full overflow-hidden">
           <div className="h-full bg-emerald-500 animate-[loading_4s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
        </div>
        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Booting_Spectre_OS</span>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  if (!currentUser || !isMFAVerified) return <Login onLogin={handleLogin} users={users} />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden relative">
      <Layout 
        currentUser={currentUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        tacticalControls={{
          threatLevel, setThreatLevel,
          visualMode, setVisualMode,
          onKillSwitch: () => { if(confirm("EXECUTE IDENTITY BURN?")) window.location.reload(); }
        }}
      />
      
      <main className={`flex-1 transition-all duration-300 md:ml-64 w-full relative`}>
        <div className={`pt-20 px-4 md:px-8 pb-32 w-full max-w-screen-2xl mx-auto transition-opacity duration-700 ${visualMode === 'stealth' ? 'opacity-40 grayscale' : 'opacity-100'}`}>
          {activeTab === 'dashboard' && <Dashboard user={currentUser!} pois={pois} onTriggerDominance={() => setIsDominanceMode(true)} />}
          {activeTab === 'mission' && <MissionControl missions={missions} agents={users} pois={pois} onAdd={m => setMissions([m, ...missions])} onUpdate={m => setMissions(missions.map(x => x.id === m.id ? m : x))} />}
          {activeTab === 'sigint' && <SignalIntelligence currentUser={currentUser!} />}
          {activeTab === 'mdt' && <MDTModule currentUser={currentUser!} onIncidentSubmit={(rep) => addAuditLog('Intel Filed', 'Report', rep.id)} isOffline={false} setIsOffline={() => {}} isSurvivalMode={visualMode === 'stealth'} />}
          {activeTab === 'team' && <TeamManager currentUser={currentUser!} users={users} onSendAlert={a => setAlerts([a, ...alerts])} onAddUser={u => setUsers([...users, u])} onUpdateUser={u => setUsers(users.map(x => x.id === u.id ? u : x))} onKickUser={id => setUsers(users.filter(x => x.id !== id))} />}
          {activeTab === 'messaging' && <Messaging currentUser={currentUser!} messages={messages} onSendMessage={m => setMessages([...messages, m])} />}
          {activeTab === 'audit' && <AuditLogViewer logs={auditLogs} onSanitize={async (id) => {
            const log = auditLogs.find(l => l.id === id);
            if (log) {
              const sanitized = await sanitizeOpsLog(log.action);
              setAuditLogs(prev => prev.map(l => l.id === id ? { ...l, action: sanitized, isSanitized: true } : l));
            }
          }} />}
          {isDominanceMode && <StrategicDominance onExit={() => setIsDominanceMode(false)} pois={pois} agents={users} />}
        </div>
      </main>

      <CommandStrip 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onPanic={() => setVisualMode(v => v === 'lockdown' ? 'standard' : 'lockdown')}
        onStealth={() => setVisualMode(v => v === 'stealth' ? 'standard' : 'stealth')}
      />
    </div>
  );
};

export default App;