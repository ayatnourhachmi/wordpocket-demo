export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  WORD_BAG = 'WORD_BAG',
  GENERATE = 'GENERATE',
  MY_TEXTS = 'MY_TEXTS',
  TEXT_DETAIL = 'TEXT_DETAIL'
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Word {
  id: string;
  userId: string;
  word: string;
  language: string;
  translation?: string;
  exampleSentence?: string;
  createdAt: number;
}

export enum TextType {
  PARAGRAPH = 'Paragraph',
  DIALOG = 'Dialog',
  STORY = 'Short Story'
}

export interface GeneratedText {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: TextType;
  language: string;
  wordsUsed: string[];
  createdAt: number;
}

export interface GenerateOptions {
  type: TextType;
  language: string;
  length: 'short' | 'medium' | 'long';
  selectedWordIds: string[];
}
