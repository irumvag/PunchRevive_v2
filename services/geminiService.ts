
import { GoogleGenAI, Type } from "@google/genai";
import { ResurrectionResult } from "../types";

export const resurrectCode = async (legacyCode: string, targetLanguage: string): Promise<ResurrectionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Resurrect the following legacy code corpse.
    Legacy Logic Fragment:
    """
    ${legacyCode}
    """
    
    Target Modern Vessel: ${targetLanguage}
    
    Tasks:
    1. Identify the ancient language (FORTRAN, COBOL, ALGOL, Assembler, or BASIC).
    2. Perform a necro-translation to modern ${targetLanguage}.
    3. Identify "bugs" as haunting demons. Give them scary names.
    4. Provide the result in the specified JSON format.
    
    Tone: Spooky, 1960s mad scientist. Be dramatic. Use terms like "ectoplasm", "unholy loop", "undead variable".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalCode: { type: Type.STRING },
          resurrectedCode: { type: Type.STRING },
          language: { type: Type.STRING },
          exorcismReport: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                bug: { type: Type.STRING },
                remedy: { type: Type.STRING },
                demonName: { type: Type.STRING }
              },
              required: ["bug", "remedy", "demonName"]
            }
          },
          status: { type: Type.STRING }
        },
        required: ["originalCode", "resurrectedCode", "language", "exorcismReport", "status"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      likes: 0,
      targetLanguage
    } as ResurrectionResult;
  } catch (e) {
    throw new Error("The ritual failed. The spirits are restless.");
  }
};

export const ocrPunchCard = async (imageBase64: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { inlineData: { mimeType: "image/jpeg", data: imageBase64.split(',')[1] || imageBase64 } },
      { text: "Decode this IBM 029 punch card. Return only the raw decoded string." }
    ]
  });
  return response.text?.trim() || "";
};
