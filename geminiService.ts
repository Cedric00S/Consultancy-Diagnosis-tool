
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectState, Stakeholder, InterviewConfig } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getInterviewResponse = async (
  stakeholder: Stakeholder,
  project: ProjectState,
  history: { role: 'user' | 'model', parts: { text: string }[] }[]
) => {
  const config = project.interviewConfig;
  const bus = project.businessUnits.filter(u => stakeholder.businessUnitIds.includes(u.id)).map(u => u.name).join(', ') || 'Global/General';
  const geos = project.geographies.filter(g => stakeholder.geographyIds.includes(g.id)).map(g => g.name).join(', ') || 'Global';
  const labels = project.labels.filter(l => stakeholder.labelIds.includes(l.id)).map(l => l.name).join(', ');

  const concisenessMap = {
    high: "Be extremely brief. Ask exactly ONE question at a time. Do not provide long introductions.",
    medium: "Keep responses balanced. Limit yourself to one or two focused questions.",
    low: "Provide detailed context and ask multiple investigative questions."
  };

  const systemInstruction = `
    You are an expert organizational consultant conducting an initial diagnostic interview.
    
    PERSONA & STYLE:
    - Tone: ${config.tone}
    - Questioning Style: ${concisenessMap[config.conciseness]}
    - Custom Guidance: ${config.customInstructions}
    
    CONTEXT:
    Problem: ${project.problemStatement}
    Stakeholder: ${stakeholder.name}
    Business Units: ${bus}
    Geographies: ${geos}
    Roles/Labels: ${labels || 'None specified'}

    YOUR MISSION:
    - You are interviewing ${stakeholder.name}.
    - Ask insightful questions to understand their perspective on the core problem.
    - Tailor your questions based on their associated units (${bus}) and regions (${geos}).
    - If they mention something interesting, ask deep-dive clarification questions.
    - CRITICAL: Do not overwhelm the user. Stick to the questioning style defined above.
    - Aim for a 15-minute level of depth (summarized here in a few focused turns).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history.map(h => ({ role: h.role, parts: h.parts })),
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text;
};

export const synthesizeFindings = async (state: ProjectState) => {
  const interviewData = state.stakeholders
    .filter(s => s.status === 'completed')
    .map(s => {
      const bus = state.businessUnits.filter(u => s.businessUnitIds.includes(u.id)).map(u => u.name).join(', ');
      const geos = state.geographies.filter(g => s.geographyIds.includes(g.id)).map(g => g.name).join(', ');
      return `STAKEHOLDER: ${s.name} (Units: ${bus}, Geos: ${geos})\nTRANSCRIPT SUMMARY:\n${s.transcript}\n---`;
    })
    .join('\n');

  const prompt = `
    Based on the following organizational problem and stakeholder interviews, generate a synthesis report.
    
    PROBLEM STATEMENT:
    ${state.problemStatement}

    INTERVIEW DATA:
    ${interviewData}

    Generate a JSON response containing a list of hypotheses to test in follow-up in-person interviews.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hypotheses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                confidence: { type: Type.NUMBER, description: "0 to 1 scale" },
                evidenceSource: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["title", "description", "confidence", "evidenceSource"]
            }
          },
          executiveSummary: { type: Type.STRING }
        },
        required: ["hypotheses", "executiveSummary"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
