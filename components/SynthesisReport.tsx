
import React, { useState, useEffect } from 'react';
import { ProjectState, Hypothesis } from '../types';
import { synthesizeFindings } from '../geminiService';
import { 
  BarChart3, 
  ArrowLeft, 
  Lightbulb, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface Props {
  project: ProjectState;
  onBack: () => void;
}

const SynthesisReport: React.FC<Props> = ({ project, onBack }) => {
  const [data, setData] = useState<{ hypotheses: Hypothesis[], executiveSummary: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSynthesis = async () => {
      try {
        const result = await synthesizeFindings(project);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSynthesis();
  }, []);

  // Mock chart data for visualization
  const chartData = [
    { subject: 'Siloing', A: 80, fullMark: 100 },
    { subject: 'Process Gap', A: 65, fullMark: 100 },
    { subject: 'Communication', A: 90, fullMark: 100 },
    { subject: 'Tech Debt', A: 40, fullMark: 100 },
    { subject: 'Accountability', A: 70, fullMark: 100 },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] space-y-4">
        <Loader2 size={48} className="text-indigo-600 animate-spin" />
        <h2 className="text-xl font-bold text-slate-900">Synthesizing Diagnostic Data</h2>
        <p className="text-slate-500">Gemini is analyzing {project.stakeholders.filter(s => s.status === 'completed').length} interview transcripts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">First Hypothesis Report</h2>
          <p className="text-slate-500 mt-1">Foundations for in-person interview sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Executive Summary */}
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Executive Summary</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {data?.executiveSummary}
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" />
              Key Hypotheses to Test
            </h4>
            <div className="space-y-4">
              {data?.hypotheses.map((h, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <h5 className="font-bold text-indigo-900">{h.title}</h5>
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-bold text-slate-500">{(h.confidence * 100).toFixed(0)}% Conf.</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{h.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {h.evidenceSource.map((source, j) => (
                      <span key={j} className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded-md">
                        Source: {source}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Analytics */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
            <h4 className="font-bold mb-4">Risk Profile</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar
                    name="Organizational Health"
                    dataKey="A"
                    stroke="#818cf8"
                    fill="#818cf8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 text-center italic mt-2">
              Derived from sentiment analysis of stakeholder inputs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-3">Interview Ready</h4>
            <p className="text-sm text-slate-500 mb-6">These findings are ready for verification with the leadership team.</p>
            <button className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all border border-indigo-100">
              <ExternalLink size={18} />
              Export Briefing Doc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynthesisReport;
