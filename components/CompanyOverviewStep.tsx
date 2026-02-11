
import React, { useState } from 'react';
import { OrgEntity, ProjectState } from '../types';
import { Plus, Trash2, ArrowLeft, ChevronRight, Map, Briefcase, Tag } from 'lucide-react';

interface Props {
  project: ProjectState;
  onUpdateUnits: (u: OrgEntity[]) => void;
  onUpdateGeographies: (g: OrgEntity[]) => void;
  onUpdateLabels: (l: OrgEntity[]) => void;
  onNext: () => void;
  onBack: () => void;
}

type TabType = 'units' | 'geographies' | 'labels';

const CompanyOverviewStep: React.FC<Props> = ({ project, onUpdateUnits, onUpdateGeographies, onUpdateLabels, onNext, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('units');

  const addItem = () => {
    const id = `${activeTab}-${Date.now()}`;
    const newItem = { id, name: `New ${activeTab.slice(0, -1)}` };
    if (activeTab === 'units') onUpdateUnits([...project.businessUnits, newItem]);
    else if (activeTab === 'geographies') onUpdateGeographies([...project.geographies, newItem]);
    else onUpdateLabels([...project.labels, newItem]);
  };

  const removeItem = (id: string) => {
    if (activeTab === 'units') onUpdateUnits(project.businessUnits.filter(i => i.id !== id));
    else if (activeTab === 'geographies') onUpdateGeographies(project.geographies.filter(i => i.id !== id));
    else onUpdateLabels(project.labels.filter(i => i.id !== id));
  };

  const updateItem = (id: string, name: string) => {
    if (activeTab === 'units') onUpdateUnits(project.businessUnits.map(i => i.id === id ? { ...i, name } : i));
    else if (activeTab === 'geographies') onUpdateGeographies(project.geographies.map(i => i.id === id ? { ...i, name } : i));
    else onUpdateLabels(project.labels.map(i => i.id === id ? { ...i, name } : i));
  };

  const currentList = activeTab === 'units' ? project.businessUnits : activeTab === 'geographies' ? project.geographies : project.labels;

  const tabs = [
    { id: 'units' as const, label: 'Business Units', icon: Briefcase },
    { id: 'geographies' as const, label: 'Geographies', icon: Map },
    { id: 'labels' as const, label: 'Other Labels', icon: Tag },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Company Structure</h2>
        <p className="text-slate-500 mt-2 text-lg">Define the building blocks of your organization.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-8 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 capitalize">
              {activeTab.replace('_', ' ')}
            </h3>
            <button 
              onClick={addItem}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-lg transition-colors"
            >
              <Plus size={14} /> Add {activeTab.slice(0, -1)}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto">
            {currentList.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center text-slate-300 py-12">
                <Plus size={48} className="opacity-20 mb-4" />
                <p className="text-sm">No items added yet</p>
              </div>
            ) : (
              currentList.map(item => (
                <div key={item.id} className="group flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-white transition-all">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2 text-sm font-medium text-slate-700 outline-none"
                    placeholder="Enter name..."
                  />
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
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
          Assign Stakeholders
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CompanyOverviewStep;
