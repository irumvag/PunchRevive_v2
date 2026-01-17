
import { PunchGrid, CardRow } from '../types';

/**
 * IBM 029 / EBCDIC Punch Mapping
 * Rows are indexed 0-11 corresponding to labels [12, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 */
export const IBM_029_MAP: Record<string, number[]> = {
  // Letters
  'A': [0, 3], 'B': [0, 4], 'C': [0, 5], 'D': [0, 6], 'E': [0, 7], 'F': [0, 8], 'G': [0, 9], 'H': [0, 10], 'I': [0, 11],
  'J': [1, 3], 'K': [1, 4], 'L': [1, 5], 'M': [1, 6], 'N': [1, 7], 'O': [1, 8], 'P': [1, 9], 'Q': [1, 10], 'R': [1, 11],
  'S': [2, 4], 'T': [2, 5], 'U': [2, 6], 'V': [2, 7], 'W': [2, 8], 'X': [2, 9], 'Y': [2, 10], 'Z': [2, 11],
  // Digits
  '0': [2], '1': [3], '2': [4], '3': [5], '4': [6], '5': [7], '6': [8], '7': [9], '8': [10], '9': [11],
  // Special Characters
  ' ': [], 
  '.': [0, 10, 5], 
  ',': [2, 10, 5], 
  '(': [0, 10, 6], 
  ')': [1, 10, 6], 
  '+': [0, 10, 8], 
  '-': [1], 
  '*': [1, 10, 6], 
  '/': [2, 3],
  '=': [2, 10, 8],
  '\'': [1, 10, 7],
  ':': [2, 10, 2], // Often mapped to 0, 8, 2 or similar
  '"': [1, 10, 5]
};

const REVERSE_MAP: Record<string, string> = Object.entries(IBM_029_MAP).reduce((acc, [char, rows]) => {
  const key = [...rows].sort((a, b) => a - b).join(',');
  acc[key] = char;
  return acc;
}, {} as Record<string, string>);

export const textToGrid = (text: string): PunchGrid => {
  const grid = Array.from({ length: 80 }, () => Array(12).fill(false));
  const upperText = text.toUpperCase();
  
  for (let i = 0; i < Math.min(upperText.length, 80); i++) {
    const char = upperText[i];
    const punches = IBM_029_MAP[char] || [];
    punches.forEach(row => {
      grid[i][row] = true;
    });
  }
  return grid;
};

export const gridToText = (grid: PunchGrid): string => {
  let decoded = "";
  for (let col = 0; col < 80; col++) {
    const activeRows: number[] = [];
    for (let row = 0; row < 12; row++) {
      if (grid[col][row]) activeRows.push(row);
    }
    
    if (activeRows.length === 0) {
      decoded += " ";
    } else {
      const key = activeRows.sort((a, b) => a - b).join(',');
      decoded += REVERSE_MAP[key] || "?";
    }
  }
  return decoded.trimEnd();
};
