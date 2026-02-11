
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { User } from '../types';

interface SignalIntelligenceProps {
  currentUser: User;
}

const SignalIntelligence: React.FC<SignalIntelligenceProps> = ({ currentUser }) => {
  const [isIntercepting, setIsIntercepting] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number>(null);

  const startIntercept = async () => {
    setIsIntercepting(true);
    // Initialize Web Audio for Visualization
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
    
    setTranscription(prev => [...prev, `[${new Date().toLocaleTimeString()}] UPLINK ESTABLISHED. TUNING TO FREQUENCY 144.825 MHz...`]);
    draw();

    // Simulated Gemini Live Logic (Placeholder for real implementation)
    setTimeout(() => {
        setTranscription(prev => [...prev, `[${new Date().toLocaleTimeString()}] SIGNAL DECODED: "TARGET MOVING TO SECTOR 7. CONFIRM PROTOCOL GHOST."`]);
    }, 3000);
  };

  const stopIntercept = () => {
    setIsIntercepting(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    audioContextRef.current?.close();
    setTranscription(prev => [...prev, `[${new Date().toLocaleTimeString()}] UPLINK TERMINATED.`]);
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyserRef.current.frequencyBinCount;
    
    animationRef.current = requestAnimationFrame(draw);
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArrayRef.current[i] / 2;
      ctx.fillStyle = `rgb(37, 99, 235)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">SIGINT Terminal</h1>
          <p className="text-slate-500 font-medium tracking-tight mt-2">Signal Intelligence & Cryptographic Interception</p>
        </div>
        <button 
          onClick={isIntercepting ? stopIntercept : startIntercept}
          className={`px-10 py-5 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-2xl transition-all active:scale-95 border ${
            isIntercepting ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-950 border-slate-800 text-white'
          }`}
        >
          {isIntercepting ? 'Kill Intercept' : 'Initialize Uplink'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden h-[400px] flex flex-col">
              <div className="absolute top-0 right-0 p-8 flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isIntercepting ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intercept Status: {isIntercepting ? 'ACTIVE' : 'IDLE'}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto font-mono text-blue-500 space-y-4 p-4 custom-scrollbar">
                {transcription.map((line, i) => (
                  <p key={i} className="text-xs leading-relaxed animate-in slide-in-from-left-2 duration-300">{line}</p>
                ))}
                {transcription.length === 0 && <p className="opacity-20 text-center py-20 uppercase tracking-[0.4em]">Awaiting signal acquisition...</p>}
              </div>

              <div className="h-24 bg-black/40 rounded-3xl border border-white/5 overflow-hidden">
                 <canvas ref={canvasRef} width={800} height={100} className="w-full h-full" />
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-50 pb-4">Cryptographic Nodes</h3>
              <div className="space-y-6">
                 {[
                   { id: 'NODE_ALPHA', power: 98, status: 'SYNCED' },
                   { id: 'NODE_BRAVO', power: 42, status: 'NOISE' },
                   { id: 'GHOST_GATE', power: 100, status: 'STEALTH' }
                 ].map((node, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase">
                         <span className="text-slate-400">{node.id}</span>
                         <span className={node.status === 'NOISE' ? 'text-amber-500' : 'text-blue-500'}>{node.status}</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full ${node.status === 'NOISE' ? 'bg-amber-500' : 'bg-blue-600'}`} style={{ width: `${node.power}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SignalIntelligence;
