
import { GoogleGenAI, Type } from "@google/genai";
import { POI, User, Mission } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Run a Parallel-Universe Simulation for a Mission
export const runParallelUniverseSimulation = async (mission: Mission) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Run a Parallel-Universe Simulation for Mission: ${mission.codeName}. 
      Current Goal: ${mission.roe}. Target HVT ID: ${mission.targetId}.
      Provide 3 alternative timelines with outcomes and probability scores.`,
      config: { thinkingConfig: { thinkingBudget: 2000 } }
    });
    return response.text || "Simulation inconclusive.";
  } catch (e) { return "Quantum link error."; }
};

// Get Geopolitical Pulse using Google Search Grounding
export const getGeopoliticalPulse = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze: "${query}". Latest news impact on covert ops.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "Clearance required.",
      sources: links.map((c: any) => ({ title: c.web?.title || "Classified", uri: c.web?.uri || "#" }))
    };
  } catch (e) { return { text: "Link severed.", sources: [] }; }
};

// Generate Recon Image using gemini-2.5-flash-image
export const generateReconImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High-fidelity tactical imagery: ${prompt}. Cinematic, detailed, military HUD overlays.` }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (e) { return null; }
};

// Get Mission Replay Critique using Thinking Config
export const getMissionReplayCritique = async (mission: Mission) => {
  try {
    const eventsStr = mission.events.map(e => `${e.time}: ${e.description}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Forensic analysis of CIA mission: ${mission.codeName}. Events: ${eventsStr}.`,
      config: { thinkingConfig: { thinkingBudget: 1500 } }
    });
    return response.text || "Analysis inconclusive.";
  } catch (e) { return "Link severed."; }
};

// Sanitize Ops Log for Plausible Deniability
export const sanitizeOpsLog = async (log: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Plausible Deniability Redaction: ${log}. Make it bureaucratic and oversight-safe.`
    });
    return response.text || log;
  } catch (e) { return log; }
};

// Get Daily Brief for the Agent
export const getDailyBrief = async (user: User, poiCount: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CIA Morning Brief for ${user.role}. Active POIs: ${poiCount}. Highlight predictive betrayal markers.`
    });
    return response.text || "Systems nominal.";
  } catch (error) { return "Tactical link active."; }
};

// Synthesize POI Dossier Summary
export const getPOISummary = async (poi: POI): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize dossier: ${poi.name}. Patterns: ${poi.aliases.join(',')}. Tone: Cold intel summary.`
    });
    return response.text || "No synthesis.";
  } catch (error) { return "Stream error."; }
};

/**
 * Generates strategic dominance options based on field data using JSON mode.
 * Returns an array of objects with name, risk, payoff, and action.
 */
export const getStrategicDominanceOptions = async (fieldData: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze current CIA status and field data: ${fieldData}. Generate 3 optimized strategic trajectories for maximum operational dominance.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'The operational code name of the trajectory.' },
              risk: { type: Type.NUMBER, description: 'The inherent risk level from 1 (low) to 10 (critical).' },
              payoff: { type: Type.NUMBER, description: 'The strategic payoff/reward from 1 to 10.' },
              action: { type: Type.STRING, description: 'Detailed action description for the trajectory.' },
            },
            required: ["name", "risk", "payoff", "action"],
            propertyOrdering: ["name", "risk", "payoff", "action"],
          },
        },
      },
    });
    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Dominance options error:", e);
    // Fallback trajectories if API fails
    return [
      { name: "STATUS_QUO", risk: 2, payoff: 1, action: "Maintain current posture and surveillance." },
      { name: "CAUTIOUS_PROBE", risk: 4, payoff: 5, action: "Deploy signals assets for a non-invasive breach." },
      { name: "FULL_SURGE", risk: 9, payoff: 10, action: "Execute non-attributable direct kinetic action." }
    ];
  }
};

/**
 * Gets a cryptic, high-level prediction from the Black Box Oracle using Thinking Config.
 */
export const getBlackBoxOraclePrediction = async (fieldData: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Field Data: ${fieldData}. You are the CIA Black Box Oracle. Based on this complex data, provide one single, cryptic, high-level strategic directive in 10 words or less.`,
      config: { 
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return response.text || "DECISION_VOID";
  } catch (e) { 
    console.error("Oracle link error:", e);
    return "ORACLE_LINK_OFFLINE"; 
  }
};
