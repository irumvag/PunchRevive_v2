
import { GoogleGenAI, Type } from "@google/genai";
import { ResurrectionResult, Documentation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Clean AI response by removing markdown blocks.
 */
const cleanAIResponse = (text: string): string => {
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
};

/**
 * Analyzes an image of a punch card to detect hole patterns.
 */
export const analyzePunchCard = async (imageBase64: string): Promise<{ holes: [number, number][], confidence: number }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          text: `Analyze this vintage punch card image. Identify all hole positions in standard 80-column × 12-row format.
          Return ONLY valid JSON in this exact format:
          {
            "holes": [[col, row], [col, row], ...],
            "confidence": 85
          }`
        },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.split(',')[1] || imageBase64,
          },
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            holes: {
              type: Type.ARRAY,
              items: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER }
              }
            },
            confidence: { type: Type.NUMBER }
          },
          required: ["holes", "confidence"]
        }
      }
    });

    return JSON.parse(cleanAIResponse(response.text));
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    throw new Error('Failed to analyze punch card holes.');
  }
};

/**
 * Translates a detected hole pattern into multiple modern programming languages.
 */
export const translateHolesToCode = async (holes: [number, number][]): Promise<Partial<ResurrectionResult>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Punch card hole pattern: ${JSON.stringify(holes)}
      
      Convert this to code. Return a JSON object with the following structure:
      {
        "language": "FORTRAN",
        "originalCode": "actual code",
        "explanation": "detailed explanation",
        "translations": {
          "python": { "code": "python code", "notes": "notes" },
          "javascript": { "code": "js code", "notes": "notes" },
          "cpp": { "code": "cpp code", "notes": "notes" }
        },
        "exorcismReport": [
          { "bug": "...", "remedy": "...", "demonName": "..." }
        ]
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            language: { type: Type.STRING },
            originalCode: { type: Type.STRING },
            explanation: { type: Type.STRING },
            translations: {
              type: Type.OBJECT,
              properties: {
                python: { 
                  type: Type.OBJECT, 
                  properties: { code: { type: Type.STRING }, notes: { type: Type.STRING } }
                },
                javascript: { 
                  type: Type.OBJECT, 
                  properties: { code: { type: Type.STRING }, notes: { type: Type.STRING } }
                },
                cpp: { 
                  type: Type.OBJECT, 
                  properties: { code: { type: Type.STRING }, notes: { type: Type.STRING } }
                }
              }
            },
            exorcismReport: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  bug: { type: Type.STRING },
                  remedy: { type: Type.STRING },
                  demonName: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(cleanAIResponse(response.text));
    return {
      ...parsed,
      resurrectedCode: parsed.originalCode,
      status: 'purified'
    };
  } catch (error) {
    console.error('Gemini translation failed:', error);
    throw new Error('Failed to translate holes to code.');
  }
};

/**
 * Generates text documentation for a piece of code.
 */
export const generateTextDocumentation = async (code: string, language: string): Promise<Documentation> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this ${language} code from a vintage punch card:
      
      ${code}
      
      Generate comprehensive spectral documentation as JSON:
      {
        "plainSummary": "A summary for non-programmers",
        "stepByStep": ["step 1", "step 2", "step 3"],
        "historicalContext": "Why this was used in the 60s",
        "modernEquivalent": "How we solve this today",
        "useCases": ["use case 1", "use case 2"]
      }`,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(cleanAIResponse(response.text));
  } catch (error) {
    console.error('Gemini documentation generation failed:', error);
    throw new Error('Failed to generate spectral documentation.');
  }
};

/**
 * Helper to generate a secure encryption key as a punch card pattern.
 */
export const generateKeyCard = async (): Promise<{ holes: [number, number][], hash: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a secure encryption key as a random punch card pattern. Return JSON: {"holes": [[col, row], ...], "hash": "sha256_hash"}',
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(cleanAIResponse(response.text));
  } catch (error) {
    console.error('Gemini key generation failed:', error);
    throw new Error('Failed to generate encryption key.');
  }
};

export const resurrectCode = async (legacyCode: string, targetLanguage: string): Promise<ResurrectionResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Resurrect this code fragment: "${legacyCode}" to ${targetLanguage}. 
      Identify bugs as demons. Return JSON.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(cleanAIResponse(response.text));
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      likes: 0,
      targetLanguage
    } as ResurrectionResult;
  } catch (error) {
    console.error('Gemini resurrection failed:', error);
    throw new Error('The ritual of resurrection failed.');
  }
};

export const ocrPunchCard = async (imageBase64: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { inlineData: { mimeType: "image/jpeg", data: imageBase64.split(',')[1] || imageBase64 } },
        { text: "Decode this IBM 029 punch card. Return only the raw decoded string." }
      ]
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error('Gemini OCR failed:', error);
    throw new Error('OCR Ritual failed.');
  }
};
