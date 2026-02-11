
import React from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';

interface ProblemStepProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

const ProblemStep: React.FC<ProblemStepProps> = ({ value, onChange, onNext }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">What is the core challenge?</h2>
        <p className="text-slate-500 mt-2 text-lg">Define the organizational problem we are here to investigate.</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
            <Lightbulb size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Problem Statement</h3>
            <p className="text-sm text-slate-500">Be as specific as possible about the context and perceived issues.</p>
          </div>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., We are seeing significant delays in the procurement cycle for our European electronics division, leading to missed production deadlines and $2M in quarterly losses..."
          className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700 text-lg leading-relaxed"
        />

        <div className="mt-8 flex justify-end">
          <button
            onClick={onNext}
            disabled={!value.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
          >
            Define Company Context
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h4 className="font-semibold text-indigo-900 mb-1">Effective Statements</h4>
          <p className="text-sm text-indigo-700">Include metrics, specific regions, and the impact on the business.</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-1">Next Step</h4>
          <p className="text-sm text-slate-700">You'll map out the business units and key roles involved.</p>
        </div>
      </div>
    </div>
  );
};

export default ProblemStep;
