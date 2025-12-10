
import { GoogleGenAI } from "@google/genai";
import { TextType } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface CallLLMParams {
  words: string[];
  type: TextType;
  language: string;
  lengthPreference: 'short' | 'medium' | 'long';
}

export const callLLM = async ({
  words,
  type,
  language,
  lengthPreference
}: CallLLMParams): Promise<{ content: string; title: string }> => {
  
  const lengthPrompt = 
    lengthPreference === 'short' ? 'approx 50-80 words' :
    lengthPreference === 'medium' ? 'approx 150-200 words' :
    'approx 300-400 words';

  // We explicitly instruct the model to use **bold** syntax so our parser can detect it.
  const prompt = `
    You are a helpful language tutor. 
    Create a ${type} in ${language}.
    
    Constraints:
    1. You MUST use the following vocabulary words: ${words.join(', ')}.
    2. IMPORTANT: Every time you use one of the vocabulary words, wrap it in double asterisks like this: **word**. Do NOT use stars for anything else.
    3. Length: ${lengthPrompt}.
    4. Provide a creative title for the text in the first line, formatted as "# Title: [Your Title]".
    5. The content should be suitable for a language learner.
    
    Output format:
    # Title: [The Title]
    
    [The generated content]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const fullText = response.text || '';
    
    // Parse out title and content
    const titleMatch = fullText.match(/^# Title:\s*(.*)/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Practice';
    
    // Remove the title line from content
    const content = fullText.replace(/^# Title:.*\n+/, '').trim();

    return { title, content };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate text. Please check your API key or try again.");
  }
};
