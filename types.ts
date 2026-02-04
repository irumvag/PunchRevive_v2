
export type PunchGrid = boolean[][]; // 80 columns x 12 rows

export interface CodeAuditReport {
  issue: string;
  optimization: string;
  moduleName: string;
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

export interface RestorationResult {
  id: string;
  author: string;
  originalCode: string;
  resurrectedCode: string; 
  language: string; 
  targetLanguage: string;
  translations?: Record<string, Translation>;
  explanation?: string;
  confidence?: number;
  holes?: [number, number][];
  auditReport: CodeAuditReport[];
  documentation?: Documentation;
  status: 'processing' | 'verified' | 'failed';
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
  isVerified: boolean;
  stats: {
    cardsDecoded: number;
    messagesSent: number;
    optimizationsMade: number;
    systemIntegrations: number;
  };
  achievements: string[];
}

export interface SecureMessage {
  id: string;
  from: string;
  to: string;
  timestamp: number;
  encryptedGrid: PunchGrid;
  ciphertext?: string;
  preview?: string; 
  keyCardId?: string;
  isDecrypted: boolean;
  plaintext?: string;
}

export enum CardRow {
  R12 = 0, R11 = 1, R0 = 2, R1 = 3, R2 = 4, R3 = 5, R4 = 6, R5 = 7, R6 = 8, R7 = 9, R8 = 10, R9 = 11,
}
