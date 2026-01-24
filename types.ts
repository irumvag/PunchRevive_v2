
export type PunchGrid = boolean[][]; // 80 columns x 12 rows

export interface ExorcismReport {
  bug: string;
  remedy: string;
  demonName: string;
}

export interface Translation {
  code: string;
  notes: string;
}

export interface Documentation {
  plainSummary: string;
  stepByStep: string[];
  historicalContext: string;
  modernEquivalent: string;
  useCases: string[];
  technicalDocs?: string;
  learningNotes?: string;
}

export interface ResurrectionResult {
  id: string;
  author: string;
  originalCode: string;
  resurrectedCode: string; // This will act as the "main" translation or explanation
  language: string; // Original detected language
  targetLanguage: string;
  translations?: Record<string, Translation>;
  explanation?: string;
  confidence?: number;
  holes?: [number, number][];
  exorcismReport: ExorcismReport[];
  documentation?: Documentation;
  status: 'haunting' | 'purified' | 'failed';
  timestamp: number;
  likes: number;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface User {
  id: string;
  username: string;
  joined: number;
  stats: {
    cardsDecoded: number;
    messagesSent: number;
    demonsBanished: number;
  };
  achievements: string[];
}

export interface SpectralMessage {
  id: string;
  from: string;
  to: string;
  timestamp: number;
  encryptedGrid: PunchGrid;
  ciphertext?: string;
  keyCardId?: string;
  isDecrypted: boolean;
  plaintext?: string;
}

export enum CardRow {
  R12 = 0, R11 = 1, R0 = 2, R1 = 3, R2 = 4, R3 = 5, R4 = 6, R5 = 7, R6 = 8, R7 = 9, R8 = 10, R9 = 11,
}
