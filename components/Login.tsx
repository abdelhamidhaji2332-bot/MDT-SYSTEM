import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [badgeCode, setBadgeCode] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [validatedUser, setValidatedUser] = useState<User | null>(null);
  const [handshakeProgress, setHandshakeProgress] = useState(0);

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setHandshakeProgress(p => {
          if (p >= 100) { clearInterval(interval); return 100; }
          return p + 10;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleInitialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.badgeNumber.toUpperCase() === badgeCode.toUpperCase());
    if (!user || password !== user.securityCode) {
      setError('ACCESS_DENIED: CREDENTIALS_INVALID');
      return;
    }
    setValidatedUser(user);
    setStep(2);
  };

  const handleMFAVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatedUser && mfaCode.length === 6) {
      onLogin(validatedUser);
    } else {
      setError('AUTH_DENIED: INVALID_BYPASS_TOKEN');
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background HUD Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-10 left-10 w-32 h-32 border border-emerald-500/10 rounded-full animate-ping pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 border-t border-r border-emerald-500/5 pointer-events-none" />

      <div className="max-w-md w-full bezel-card bg-[#0a0f1e]/80 p-10 border border-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative z-10">
        <header className="text-center mb-10">
          <div className="w-16 h-16 border-2 border-emerald-500/20 flex items-center justify-center mx-auto mb-6 relative hud-bracket">
             <div className="w-10 h-10 border border-emerald-500/50 flex items-center justify-center animate-pulse">
                <span className="text-sm font-black text-emerald-500 italic">Ω</span>
             </div>
          </div>
          <h2 className="text-xs font-black text-white tracking-[0.8em] uppercase mb-1">CIA_CONTROL</h2>
          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Secure_Node_Uplink: v4.8.2-OMEGA</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-950/20 border-l-2 border-red-500 text-red-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-2 italic animate-bounce">
            [!] {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleInitialLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Identity_Proxy</label>
              <input 
                type="text"
                value={badgeCode}
                onChange={(e) => setBadgeCode(e.target.value)}
                placeholder="ID_LOGIN"
                className="w-full bg-black/60 border border-emerald-500/10 px-4 py-3 text-white text-[10px] font-bold focus:border-emerald-500 outline-none transition-all uppercase tracking-widest"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Crypto_Passkey</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full bg-black/60 border border-emerald-500/10 px-4 py-3 text-white text-[10px] font-bold focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-[#010409] font-black py-4 text-[10px] uppercase tracking-[0.4em] transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Establish_Tunnel
            </button>
          </form>
        ) : (
          <form onSubmit={handleMFAVerify} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-emerald-500 text-[8px] font-black uppercase tracking-widest">Handshake: {handshakeProgress}%</p>
              <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${handshakeProgress}%` }}></div>
              </div>
              <h3 className="text-white text-xs font-black mt-6 tracking-[0.3em] uppercase italic typewriter">Inject_Bypass_Token</h3>
            </div>
            <input 
              type="text"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full bg-black/60 border border-emerald-500/10 px-4 py-4 text-center text-white text-2xl font-mono tracking-[0.8em] focus:border-emerald-500 outline-none transition-all"
              required
              autoFocus
            />
            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 text-[8px] font-black text-slate-500 uppercase border border-white/5 tracking-widest">Abort</button>
              <button type="submit" className="flex-[2] bg-emerald-600 text-[#010409] font-black py-3 text-[9px] uppercase tracking-widest">Verify_Bio</button>
            </div>
          </form>
        )}
        
        <footer className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[6px] text-slate-700 uppercase tracking-[0.5em] font-black">
            Classified_Intel_Network_Subject_to_Oversight
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;