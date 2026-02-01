export enum WritingStyle {
  PROFESSIONAL_EMAIL = 'Professional Email',
  CASUAL_TEXT = 'Casual Text',
  ACADEMIC = 'Academic Paper',
  IMPROVE_PHRASING = 'Improve Phrasing',
  GRAMMAR_CHECK = 'Grammar Check',
  CREATIVE = 'Creative Writing',
  PROFESSIONAL_SUMMARY = 'Professional Summary',
  SOCIAL_MEDIA_POST = 'Social Media Post',
  TECHNICAL_DOC = 'Technical Doc',
  REWRITE_BULLETS = 'Rewrite as Bullets'
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'premium';
}

export interface WritingVariation {
  id: string;
  label: string;
  suggestedText: string;
  tone: string;
  changes: { field: string; reason: string }[];
}

export interface FlaggedIssue {
  issue: string;
  suggestion: string;
  type: 'grammar' | 'clarity' | 'tone';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  style: WritingStyle;
  variations: WritingVariation[];
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'bn-IN', name: 'Bengali' },
  { code: 'tr-TR', name: 'Turkish' }
];
