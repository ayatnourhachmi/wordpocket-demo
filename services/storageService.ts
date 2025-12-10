import { Word, GeneratedText, User } from '../types';

// Keys for local storage
const WORDS_KEY = 'lingoloom_words';
const TEXTS_KEY = 'lingoloom_texts';
const USER_KEY = 'lingoloom_user';

// --- User ---
export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// --- Words ---
export const getWords = (userId: string): Word[] => {
  const data = localStorage.getItem(WORDS_KEY);
  const allWords: Word[] = data ? JSON.parse(data) : [];
  return allWords.filter(w => w.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
};

export const addWord = (word: Word): void => {
  const data = localStorage.getItem(WORDS_KEY);
  const allWords: Word[] = data ? JSON.parse(data) : [];
  allWords.push(word);
  localStorage.setItem(WORDS_KEY, JSON.stringify(allWords));
};

export const deleteWord = (wordId: string): void => {
  const data = localStorage.getItem(WORDS_KEY);
  if (!data) return;
  const allWords: Word[] = JSON.parse(data);
  const newWords = allWords.filter(w => w.id !== wordId);
  localStorage.setItem(WORDS_KEY, JSON.stringify(newWords));
};

// --- Texts ---
export const getTexts = (userId: string): GeneratedText[] => {
  const data = localStorage.getItem(TEXTS_KEY);
  const allTexts: GeneratedText[] = data ? JSON.parse(data) : [];
  return allTexts.filter(t => t.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
};

export const saveText = (text: GeneratedText): void => {
  const data = localStorage.getItem(TEXTS_KEY);
  const allTexts: GeneratedText[] = data ? JSON.parse(data) : [];
  allTexts.push(text);
  localStorage.setItem(TEXTS_KEY, JSON.stringify(allTexts));
};

export const deleteText = (textId: string): void => {
  const data = localStorage.getItem(TEXTS_KEY);
  if (!data) return;
  const allTexts: GeneratedText[] = JSON.parse(data);
  const newTexts = allTexts.filter(t => t.id !== textId);
  localStorage.setItem(TEXTS_KEY, JSON.stringify(newTexts));
};
