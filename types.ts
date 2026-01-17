
export type PunchGrid = boolean[][]; // 80 columns x 12 rows

export interface ExorcismReport {
  bug: string;
  remedy: string;
  demonName: string;
}

export interface ResurrectionResult {
  id: string;
  author: string;
  originalCode: string;
  resurrectedCode: string;
  language: string;
  targetLanguage: string;
  exorcismReport: ExorcismReport[];
  status: 'haunting' | 'purified' | 'failed';
  timestamp: number;
  likes: number;
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
  isDecrypted: boolean;
}

export enum CardRow {
  R12 = 0, R11 = 1, R0 = 2, R1 = 3, R2 = 4, R3 = 5, R4 = 6, R5 = 7, R6 = 8, R7 = 9, R8 = 10, R9 = 11,
}
