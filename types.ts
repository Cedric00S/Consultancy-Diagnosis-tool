
export enum AppStep {
  PROBLEM_STATEMENT = 'PROBLEM_STATEMENT',
  COMPANY_OVERVIEW = 'COMPANY_OVERVIEW',
  STAKEHOLDER_SETUP = 'STAKEHOLDER_SETUP',
  INTERVIEW_CONFIG = 'INTERVIEW_CONFIG',
  INTERVIEW_HUB = 'INTERVIEW_HUB',
  INTERVIEW_SESSION = 'INTERVIEW_SESSION',
  SYNTHESIS_REPORT = 'SYNTHESIS_REPORT'
}

export interface OrgEntity {
  id: string;
  name: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  businessUnitIds: string[];
  geographyIds: string[];
  labelIds: string[];
  status: 'pending' | 'completed' | 'in-progress';
  transcript?: string;
  summary?: string;
}

export interface InterviewConfig {
  persona: string;
  tone: 'professional' | 'friendly' | 'direct';
  conciseness: 'high' | 'medium' | 'low';
  customInstructions: string;
}

export interface ProjectState {
  problemStatement: string;
  businessUnits: OrgEntity[];
  geographies: OrgEntity[];
  labels: OrgEntity[];
  stakeholders: Stakeholder[];
  interviewConfig: InterviewConfig;
}

export interface Hypothesis {
  title: string;
  description: string;
  confidence: number;
  evidenceSource: string[];
}
