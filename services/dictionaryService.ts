interface DictionaryResult {
  definition?: string;
  example?: string;
}

const normalizeLanguage = (language: string) => {
  const lang = (language || "").toLowerCase().trim();

  // allow both "English" and "en"
  if (lang === "english" || lang === "en") return "en";

  // fallback to english only (since your app is English-only)
  return "en";
};

export const fetchDefinition = async (
  word: string,
  language: string = "en"
): Promise<DictionaryResult> => {
  try {
    const langCode = normalizeLanguage(language);

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${langCode}/${encodeURIComponent(word)}`
    );

    if (!response.ok) return {};

    const data = await response.json();

    const entry = data?.[0];
    const meaning = entry?.meanings?.[0];
    const definition = meaning?.definitions?.[0];

    return {
      definition: definition?.definition,
      example: definition?.example
    };
  } catch (error) {
    console.error("Dictionary fetch error:", error);
    return {};
  }
};
