
import React, { useState, useEffect, useRef } from 'react';
import { Stakeholder, ProjectState } from '../types';
import { getInterviewResponse } from '../geminiService';
import { Send, ArrowLeft, Mic, MicOff, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  stakeholder: Stakeholder;
  project: ProjectState;
  onComplete: (transcript: string) => void;
  onCancel: () => void;
}

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const InterviewSession: React.FC<Props> = ({ stakeholder, project, onComplete, onCancel }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const startInterview = async () => {
      setIsLoading(true);
      const initialHistory: Message[] = [
        { role: 'user', parts: [{ text: "Start the interview. Introduce yourself briefly and ask the first diagnostic question related to my business unit. Ask only one question." }] }
      ];
      const response = await getInterviewResponse(stakeholder, project, initialHistory);
      setMessages([{ role: 'model', parts: [{ text: response || '' }] }]);
      setIsLoading(false);
    };
    startInterview();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', parts: [{ text: input }] }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getInterviewResponse(stakeholder, project, newMessages);
      setMessages([...newMessages, { role: 'model', parts: [{ text: response || '' }] }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    const transcript = messages.map(m => `${m.role === 'user' ? 'Stakeholder' : 'Consultant'}: ${m.parts[0].text}`).join('\n\n');
    onComplete(transcript);
  };

  const bus = project.businessUnits.filter(u => stakeholder.businessUnitIds.includes(u.id)).map(u => u.name).join(', ');

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{stakeholder.name}</h2>
            <p className="text-xs text-slate-500">{bus || 'General/Global'} • Diagnostic Interview</p>
          </div>
        </div>
        <button 
          onClick={handleFinish}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
        >
          <CheckCircle2 size={16} /> Finish Session
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col shadow-inner">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                {m.parts[0].text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl p-4 text-slate-500 animate-pulse flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer/Input */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
          <button 
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`p-3 rounded-xl transition-all ${isVoiceActive ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white text-slate-400 border border-slate-200'}`}
          >
            {isVoiceActive ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isVoiceActive ? "Listening..." : "Type your response..."}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-indigo-100"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      
      <p className="mt-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        Style: {project.interviewConfig.conciseness === 'high' ? 'One question at a time' : project.interviewConfig.conciseness}
      </p>
    </div>
  );
};

export default InterviewSession;
