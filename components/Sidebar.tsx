
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarProps {
  currentStep: string;
  steps: { key: string; label: string; icon: LucideIcon }[];
  onNavigate: (step: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep, steps, onNavigate }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">OC</div>
          OrgConsult
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Diagnostic POC</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.key || (currentStep === 'INTERVIEW_SESSION' && step.key === 'INTERVIEW_HUB');
          
          return (
            <button
              key={step.key}
              onClick={() => onNavigate(step.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {step.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-900 rounded-xl p-4 text-white">
          <p className="text-xs text-slate-400 mb-1">Project Active</p>
          <p className="text-sm font-medium">Digital Transformation Q4</p>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full w-2/5"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
