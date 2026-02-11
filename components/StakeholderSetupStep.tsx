
import React from 'react';
import { ProjectState, Stakeholder, OrgEntity } from '../types';
import { Users, Plus, Trash2, ArrowLeft, ChevronRight, UserPlus, Check, Map, Briefcase, Tag } from 'lucide-react';

interface Props {
  project: ProjectState;
  onUpdateStakeholders: (s: Stakeholder[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const StakeholderSetupStep: React.FC<Props> = ({ project, onUpdateStakeholders, onNext, onBack }) => {
  const addStakeholder = () => {
    const id = `s-${Date.now()}`;
    onUpdateStakeholders([
      ...project.stakeholders, 
      { 
        id, 
        name: `Stakeholder ${project.stakeholders.length + 1}`, 
        businessUnitIds: [],
        geographyIds: [],
        labelIds: [],
        status: 'pending' 
      }
    ]);
  };

  const removeStakeholder = (id: string) => {
    onUpdateStakeholders(project.stakeholders.filter(s => s.id !== id));
  };

  const updateStakeholder = (id: string, updates: Partial<Stakeholder>) => {
    onUpdateStakeholders(project.stakeholders.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const toggleAssociation = (sId: string, type: 'businessUnitIds' | 'geographyIds' | 'labelIds', entityId: string) => {
    const s = project.stakeholders.find(x => x.id === sId);
    if (!s) return;
    const currentIds = s[type];
    const newIds = currentIds.includes(entityId) 
      ? currentIds.filter(id => id !== entityId) 
      : [...currentIds, entityId];
    updateStakeholder(sId, { [type]: newIds });
  };

  const SelectionGroup = ({ 
    title, 
    icon: Icon, 
    entities, 
    selectedIds, 
    onToggle, 
    activeColor 
  }: { 
    title: string, 
    icon: any, 
    entities: OrgEntity[], 
    selectedIds: string[], 
    onToggle: (id: string) => void,
    activeColor: string
  }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
        <Icon size={12} /> {title}
      </label>
      <div className="flex flex-wrap gap-2">
        {entities.length === 0 ? (
          <span className="text-[10px] text-slate-300 italic px-1">None defined in organization step</span>
        ) : (
          entities.map(e => {
            const isActive = selectedIds.includes(e.id);
            return (
              <button
                key={e.id}
                onClick={() => onToggle(e.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border ${
                  isActive 
                    ? `${activeColor} border-transparent text-white shadow-sm` 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {isActive && <Check size={10} />}
                {e.name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Map Stakeholders</h2>
          <p className="text-slate-500 mt-2">Assign people to multiple units, locations, and roles.</p>
        </div>
        <button 
          onClick={addStakeholder}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={18} /> Add Participant
        </button>
      </div>

      <div className="space-y-6">
        {project.stakeholders.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-slate-400">
            <UserPlus size={64} className="opacity-10 mb-4" />
            <p className="font-medium">No stakeholders defined yet</p>
            <button onClick={addStakeholder} className="text-indigo-600 text-sm mt-2 hover:underline">Click here to add one</button>
          </div>
        ) : (
          project.stakeholders.map(s => (
            <div key={s.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <input 
                  type="text" 
                  value={s.name} 
                  onChange={(e) => updateStakeholder(s.id, { name: e.target.value })}
                  className="text-2xl font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-indigo-300 outline-none w-1/2"
                  placeholder="Stakeholder Name"
                />
                <button onClick={() => removeStakeholder(s.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <SelectionGroup 
                  title="Business Units" 
                  icon={Briefcase} 
                  entities={project.businessUnits} 
                  selectedIds={s.businessUnitIds}
                  onToggle={(id) => toggleAssociation(s.id, 'businessUnitIds', id)}
                  activeColor="bg-indigo-600"
                />

                <SelectionGroup 
                  title="Geographies" 
                  icon={Map} 
                  entities={project.geographies} 
                  selectedIds={s.geographyIds}
                  onToggle={(id) => toggleAssociation(s.id, 'geographyIds', id)}
                  activeColor="bg-emerald-600"
                />

                <SelectionGroup 
                  title="Other Labels" 
                  icon={Tag} 
                  entities={project.labels} 
                  selectedIds={s.labelIds}
                  onToggle={(id) => toggleAssociation(s.id, 'labelIds', id)}
                  activeColor="bg-amber-600"
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center pt-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-semibold hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={project.stakeholders.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
        >
          Configure Bot
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default StakeholderSetupStep;
