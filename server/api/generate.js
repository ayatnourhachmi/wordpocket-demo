export default async function handler(req, res) {
  try {
    const { words = [], type = 'Paragraph', language = 'English', lengthPreference = 'medium' } = req.body || {};

    const lengthPrompt =
      lengthPreference === 'short' ? 'approx 50-80 words' :
      lengthPreference === 'medium' ? 'approx 150-200 words' :
      'approx 300-400 words';

    const prompt = `
You are a helpful language tutor.
Create a ${type} in ${language}.

Constraints:
1. You MUST use the following vocabulary words: ${words.join(', ')}.
2. Every vocabulary word MUST be wrapped in **double asterisks**.
3. Length: ${lengthPrompt}.
4. First line MUST be: "# Title: ..."
5. Suitable for language learners.

Output:
# Title: [Title]

[Content]
`.trim();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'WordPocket',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nex-agi/deepseek-v3.1-nex-n1:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).send(err);
    }

    const data = await response.json();
    const fullText = data?.choices?.[0]?.message?.content || '';

    const titleMatch = fullText.match(/^# Title:\s*(.*)/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Practice Text';
    const content = fullText.replace(/^# Title:.*\n+/, '').trim();

    res.json({ title, content });
  } catch (e) {
    res.status(500).send(e?.message || 'Server error');
  }
}
