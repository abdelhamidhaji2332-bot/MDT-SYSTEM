
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';

interface MessagingProps {
  currentUser: User;
  messages: Message[];
  onSendMessage: (msg: Message) => void;
}

const Messaging: React.FC<MessagingProps> = ({ currentUser, messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText,
      timestamp: new Date().toISOString()
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <h3 className="font-bold text-white tracking-tight">SECURE CHANNEL: GEN-PURPOSE-OPS</h3>
        </div>
        <div className="text-[10px] font-mono text-slate-500">AES-256-GCM ACTIVE</div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm">Channel initialized. Begin secure transmission.</p>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${isMe ? 'bg-blue-600 text-white rounded-l-xl rounded-tr-xl' : 'bg-white border border-slate-200 text-slate-800 rounded-r-xl rounded-tl-xl'} p-3 shadow-sm`}>
                {!isMe && <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase">{msg.senderName}</p>}
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type secure message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center w-12"
          >
            <span>➤</span>
          </button>
        </form>
        <p className="text-[9px] text-center text-slate-400 mt-2 uppercase tracking-tighter">Transmission is subject to automatic audit logging for compliance.</p>
      </div>
    </div>
  );
};

export default Messaging;
