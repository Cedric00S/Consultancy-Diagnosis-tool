
import React from 'react';
import { Stakeholder, ProjectState } from '../types';
import { Play, CheckCircle2, Clock, BarChart3, Info, MapPin, Briefcase } from 'lucide-react';

interface Props {
  stakeholders: Stakeholder[];
  project: ProjectState;
  onStartInterview: (id: string) => void;
  onSynthesize: () => void;
}

const InterviewHub: React.FC<Props> = ({ stakeholders, project, onStartInterview, onSynthesize }) => {
  const completedCount = stakeholders.filter(s => s.status === 'completed').length;
  const canSynthesize = completedCount >= 2;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Interview Hub</h2>
          <p className="text-slate-500 mt-2">Launch the interactive sessions for your stakeholders.</p>
        </div>
        
        {canSynthesize && (
          <button
            onClick={onSynthesize}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 animate-pulse"
          >
            <BarChart3 size={20} />
            Generate Synthesis
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Avg. Time</p>
            <p className="text-xl font-bold text-slate-900">15 mins</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Completed</p>
            <p className="text-xl font-bold text-slate-900">{completedCount} / {stakeholders.length}</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-900 shadow-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-indigo-400" />
            <p className="text-xs font-semibold text-indigo-400 uppercase">Status</p>
          </div>
          <p className="text-sm font-medium">
            {canSynthesize 
              ? "Ready for synthesis report." 
              : "Minimum 2 interviews required."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stakeholders.map(s => {
          const bus = project.businessUnits.filter(u => s.businessUnitIds.includes(u.id));
          const geos = project.geographies.filter(g => s.geographyIds.includes(g.id));
          const labels = project.labels.filter(l => s.labelIds.includes(l.id));
          const isCompleted = s.status === 'completed';
          
          return (
            <div 
              key={s.id}
              className={`group relative bg-white p-6 rounded-3xl border transition-all flex flex-col ${
                isCompleted 
                  ? 'border-emerald-200 bg-emerald-50/20' 
                  : 'border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                }`}>
                  {s.name.charAt(0)}
                </div>
                {isCompleted ? (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400 px-2 py-1 bg-slate-50 rounded-md">Pending</span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 leading-tight mb-3">{s.name}</h3>
              
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-1.5 text-[9px] text-slate-500 font-medium">
                  <Briefcase size={10} className="mt-0.5 shrink-0" /> 
                  <span className="leading-tight">{bus.length > 0 ? bus.map(b => b.name).join(', ') : 'Global/General'}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[9px] text-slate-500 font-medium">
                  <MapPin size={10} className="mt-0.5 shrink-0" /> 
                  <span className="leading-tight">{geos.length > 0 ? geos.map(g => g.name).join(', ') : 'Global'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-6 min-h-[1.5rem]">
                {labels.map(l => (
                  <span key={l.id} className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                    {l.name}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto">
                {!isCompleted ? (
                  <button
                    onClick={() => onStartInterview(s.id)}
                    className="w-full py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play size={14} fill="white" />
                    Start Session
                  </button>
                ) : (
                  <div className="text-xs font-bold text-emerald-600 text-center uppercase tracking-widest">
                    Recorded
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewHub;
