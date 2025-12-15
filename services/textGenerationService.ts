import { TextType } from "../types";

interface CallLLMParams {
  words: string[];
  type: TextType;
  language: string;
  lengthPreference: "short" | "medium" | "long";
}

export const callLLM = async (params: CallLLMParams) => {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Failed to generate text");
  }

  return res.json(); // { title, content }
};
