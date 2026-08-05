
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, Key, AiSuggestion, AiSuggestionExtended, BeatSuggestionRequest } from '../types';

const getGeminiService = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Falls back to the local AI service when Gemini is unavailable.
 */
const getAiServiceSuggestion = async (request: BeatSuggestionRequest): Promise<AiSuggestionExtended | null> => {
  try {
    const response = await fetch('http://localhost:8001/ai/suggest_beat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.suggestion as AiSuggestionExtended;
  } catch {
    return null;
  }
};

export const getBeatSuggestion = async (prompt: string): Promise<AiSuggestion | null> => {
  const ai = getGeminiService();

  // Try local AI service as fallback when Gemini key is missing
  if (!ai) {
    const localSuggestion = await getAiServiceSuggestion({ prompt });
    if (localSuggestion) return localSuggestion;
    throw new Error("AI Service not available. Please check your API key or ensure the AI service is running.");
  }

  const model = "gemini-2.5-flash";
  const fullPrompt = `Based on the following lyrical theme or vibe, suggest the ideal beat parameters for a rap song. Vibe: "${prompt}"`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bpm: {
              type: Type.INTEGER,
              description: 'The suggested beats per minute (BPM) for the track, as a number.',
            },
            key: {
              type: Type.STRING,
              description: 'The suggested musical key for the track.',
              enum: Object.values(Key),
            },
            mood: {
              type: Type.STRING,
              description: 'The suggested mood or feeling for the track.',
              enum: Object.values(Mood),
            },
            reasoning: {
              type: Type.STRING,
              description: 'A brief explanation of why these parameters were chosen.',
            },
          },
          required: ["bpm", "key", "mood"],
        },
      },
    });

    const jsonText = response.text.trim();
    const suggestion = JSON.parse(jsonText);

    if (suggestion.bpm && suggestion.key && suggestion.mood) {
      return suggestion as AiSuggestionExtended;
    } else {
      throw new Error("Invalid response structure from AI.");
    }
  } catch (error) {
    console.error("Error fetching beat suggestion from Gemini:", error);
    // Try local AI service as a secondary fallback
    const localSuggestion = await getAiServiceSuggestion({ prompt });
    if (localSuggestion) return localSuggestion;
    throw new Error("Failed to get a suggestion from the AI. Please try again.");
  }
};

