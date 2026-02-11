
import React from 'react';
import { InterviewConfig } from '../types';
import { Settings, MessageSquare, Zap, Target, ArrowLeft, ChevronRight } from 'lucide-react';

interface Props {
  config: InterviewConfig;
  onChange: (config: InterviewConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

const InterviewConfigStep: React.FC<Props> = ({ config, onChange, onNext, onBack }) => {
  const updateConfig = (updates: Partial<InterviewConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Configure Interview Bot</h2>
        <p className="text-slate-500 mt-2 text-lg">Adjust how the AI interacts with your stakeholders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Conciseness */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              Questioning Volume
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => updateConfig({ conciseness: level })}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                    config.conciseness === level 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                  }`}
                >
                  {level === 'high' ? 'Concise (1 Q)' : level === 'medium' ? 'Standard' : 'Detailed'}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 italic">
              {config.conciseness === 'high' 
                ? "The bot will ask exactly one question at a time and keep responses short." 
                : "The bot will provide more context and potentially multi-part questions."}
            </p>
          </div>

          {/* Tone */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-500" />
              Interview Tone
            </h3>
            <div className="flex gap-2">
              {(['professional', 'friendly', 'direct'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => updateConfig({ tone: tone })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all capitalize ${
                    config.tone === tone 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Target size={18} className="text-emerald-500" />
            Specific Instructions
          </h3>
          <textarea
            value={config.customInstructions}
            onChange={(e) => updateConfig({ customInstructions: e.target.value })}
            placeholder="e.g., Avoid asking about financial metrics, focus on day-to-day friction..."
            className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-700 resize-none"
          />
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-800 mb-1">Pro Tip</h4>
            <p className="text-[10px] text-emerald-700 leading-relaxed">
              If the bot is "asking too much," try adding: "Always ask only ONE question per turn and wait for an answer."
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-semibold hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
        >
          To Interview Hub
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default InterviewConfigStep;
