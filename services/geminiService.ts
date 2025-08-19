
import { GoogleGenAI, Type } from "@google/genai";
import { Mood, Key, AiSuggestion } from '../types';

const getGeminiService = () => {
  if (!process.env.API_KEY) {
    // In a real app, you'd have a more robust way of handling this.
    // For this example, we'll simulate an error state if the key is missing.
    console.error("API_KEY environment variable not set.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getBeatSuggestion = async (prompt: string): Promise<AiSuggestion | null> => {
  const ai = getGeminiService();
  if (!ai) {
    throw new Error("Gemini AI Service not available. Please check your API key.");
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
          },
          required: ["bpm", "key", "mood"],
        },
      },
    });

    const jsonText = response.text.trim();
    const suggestion = JSON.parse(jsonText);

    // Basic validation
    if (suggestion.bpm && suggestion.key && suggestion.mood) {
      return suggestion as AiSuggestion;
    } else {
      throw new Error("Invalid response structure from AI.");
    }
  } catch (error) {
    console.error("Error fetching beat suggestion:", error);
    throw new Error("Failed to get a suggestion from the AI. Please try again.");
  }
};
