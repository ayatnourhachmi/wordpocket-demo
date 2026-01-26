import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  try {
    const { words, type, language } = req.body;

    // Generate type-specific instructions
    let typeInstruction = '';
    if (type === 'Dialog') {
      typeInstruction = 'Create a natural conversation between 2-3 people.';
    } else if (type === 'Story') {
      typeInstruction = 'Write a short narrative story with a clear beginning, middle, and end.';
    } else {
      typeInstruction = 'Write a descriptive paragraph.';
    }

    const prompt = `
You are a language learning assistant. ${typeInstruction}

IMPORTANT RULES:
1. You MUST use ALL of these vocabulary words: ${words.join(", ")}
2. Wrap each vocabulary word in **double asterisks** (example: **word**)
3. Keep it SHORT and NATURAL - aim for 60-100 words total
4. Make the content engaging and suitable for language learners
5. First line MUST be: "# Title: [Your Creative Title]"
6. Write in ${language}

Format:
# Title: [Title]

[Your ${type.toLowerCase()} content here]
`.trim();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Updated to recommended Groq model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter API Error:', err);
      console.error('Status:', response.status);
      return res.status(500).json({ error: 'OpenRouter API Error', details: err });
    }

    const data = await response.json();
    const fullText = data?.choices?.[0]?.message?.content || "";

    // Parse title + content
    const titleMatch = fullText.match(/^# Title:\s*(.*)/m);
    const title = titleMatch ? titleMatch[1].trim() : "Practice Text";
    const content = fullText.replace(/^# Title:.*\n+/, "").trim();

    res.json({ title, content });
  } catch (e: any) {
    console.error('Server error:', e);
    res.status(500).send(e.message || "Server error");
  }
}
