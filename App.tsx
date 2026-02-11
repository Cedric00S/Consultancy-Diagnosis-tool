
import React, { useState, useCallback } from 'react';
import { AppStep, ProjectState, Stakeholder, OrgEntity, InterviewConfig } from './types';
import Sidebar from './components/Sidebar';
import ProblemStep from './components/ProblemStep';
import CompanyOverviewStep from './components/CompanyOverviewStep';
import StakeholderSetupStep from './components/StakeholderSetupStep';
import InterviewConfigStep from './components/InterviewConfigStep';
import InterviewHub from './components/InterviewHub';
import InterviewSession from './components/InterviewSession';
import SynthesisReport from './components/SynthesisReport';
import { 
  ClipboardList, 
  Building2, 
  Users, 
  Settings,
  Mic2, 
  BarChart3, 
  ChevronRight 
} from 'lucide-react';

const INITIAL_STATE: ProjectState = {
  problemStatement: '',
  businessUnits: [
    { id: 'bu1', name: 'Global Procurement' },
    { id: 'bu2', name: 'Operations & Production' }
  ],
  geographies: [
    { id: 'geo1', name: 'EMEA' },
    { id: 'geo2', name: 'North America' }
  ],
  labels: [
    { id: 'l1', name: 'Management' },
    { id: 'l2', name: 'Engineering' }
  ],
  stakeholders: [],
  interviewConfig: {
    persona: 'Expert Consultant',
    tone: 'professional',
    conciseness: 'high',
    customInstructions: 'Always ask only ONE question at a time. Be direct and avoid filler sentences.'
  }
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.PROBLEM_STATEMENT);
  const [project, setProject] = useState<ProjectState>(INITIAL_STATE);
  const [activeStakeholderId, setActiveStakeholderId] = useState<string | null>(null);

  const updateProject = useCallback((updates: Partial<ProjectState>) => {
    setProject(prev => ({ ...prev, ...updates }));
  }, []);

  const startInterview = (id: string) => {
    setActiveStakeholderId(id);
    setCurrentStep(AppStep.INTERVIEW_SESSION);
  };

  const completeInterview = (id: string, transcript: string) => {
    setProject(prev => ({
      ...prev,
      stakeholders: prev.stakeholders.map(s => 
        s.id === id ? { ...s, status: 'completed', transcript } : s
      )
    }));
    setCurrentStep(AppStep.INTERVIEW_HUB);
    setActiveStakeholderId(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.PROBLEM_STATEMENT:
        return <ProblemStep 
          value={project.problemStatement} 
          onChange={(v) => updateProject({ problemStatement: v })} 
          onNext={() => setCurrentStep(AppStep.COMPANY_OVERVIEW)} 
        />;
      case AppStep.COMPANY_OVERVIEW:
        return <CompanyOverviewStep 
          project={project}
          onUpdateUnits={(u) => updateProject({ businessUnits: u })}
          onUpdateGeographies={(g) => updateProject({ geographies: g })}
          onUpdateLabels={(l) => updateProject({ labels: l })}
          onNext={() => setCurrentStep(AppStep.STAKEHOLDER_SETUP)}
          onBack={() => setCurrentStep(AppStep.PROBLEM_STATEMENT)}
        />;
      case AppStep.STAKEHOLDER_SETUP:
        return <StakeholderSetupStep 
          project={project}
          onUpdateStakeholders={(s) => updateProject({ stakeholders: s })}
          onNext={() => setCurrentStep(AppStep.INTERVIEW_CONFIG)}
          onBack={() => setCurrentStep(AppStep.COMPANY_OVERVIEW)}
        />;
      case AppStep.INTERVIEW_CONFIG:
        return <InterviewConfigStep 
          config={project.interviewConfig}
          onChange={(c) => updateProject({ interviewConfig: c })}
          onNext={() => setCurrentStep(AppStep.INTERVIEW_HUB)}
          onBack={() => setCurrentStep(AppStep.STAKEHOLDER_SETUP)}
        />;
      case AppStep.INTERVIEW_HUB:
        return <InterviewHub 
          stakeholders={project.stakeholders}
          project={project}
          onStartInterview={startInterview}
          onSynthesize={() => setCurrentStep(AppStep.SYNTHESIS_REPORT)}
        />;
      case AppStep.INTERVIEW_SESSION:
        const s = project.stakeholders.find(x => x.id === activeStakeholderId)!;
        return <InterviewSession 
          stakeholder={s}
          project={project}
          onComplete={(t) => completeInterview(s.id, t)}
          onCancel={() => setCurrentStep(AppStep.INTERVIEW_HUB)}
        />;
      case AppStep.SYNTHESIS_REPORT:
        return <SynthesisReport project={project} onBack={() => setCurrentStep(AppStep.INTERVIEW_HUB)} />;
      default:
        return null;
    }
  };

  const steps = [
    { key: AppStep.PROBLEM_STATEMENT, label: 'Problem', icon: ClipboardList },
    { key: AppStep.COMPANY_OVERVIEW, label: 'Organization', icon: Building2 },
    { key: AppStep.STAKEHOLDER_SETUP, label: 'Stakeholders', icon: Users },
    { key: AppStep.INTERVIEW_CONFIG, label: 'Bot Settings', icon: Settings },
    { key: AppStep.INTERVIEW_HUB, label: 'Interviews', icon: Mic2 },
    { key: AppStep.SYNTHESIS_REPORT, label: 'Analysis', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentStep={currentStep} 
        steps={steps} 
        onNavigate={(s) => {
          if (s === AppStep.INTERVIEW_HUB && project.stakeholders.length === 0) return;
          setCurrentStep(s as AppStep);
        }}
      />
      
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto">
          {renderStep()}
        </div>
      </main>
    </div>
  );
};

export default App;
