import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface DictionaryResult {
  definition?: string;
  example?: string;
}

export const fetchDefinition = async (word: string, language: string): Promise<DictionaryResult> => {
  try {
    const prompt = `
      Provide a definition and a simple example sentence for the word "${word}" in the language "${language}".
      Return ONLY a JSON object with keys "definition" (string) and "example" (string).
      Keep the definition concise (under 20 words).
      The example sentence should be simple and use the word.
      If the word is invalid or you cannot find it, return empty strings.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    return {
      definition: data.definition || undefined,
      example: data.example || undefined
    };
  } catch (error) {
    console.error("Dictionary fetch error:", error);
    return {};
  }
};