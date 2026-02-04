
import { PunchGrid } from '../types';

/**
 * IBM 029 / EBCDIC Punch Mapping
 */
export const IBM_029_MAP: Record<string, number[]> = {
  'A': [0, 3], 'B': [0, 4], 'C': [0, 5], 'D': [0, 6], 'E': [0, 7], 'F': [0, 8], 'G': [0, 9], 'H': [0, 10], 'I': [0, 11],
  'J': [1, 3], 'K': [1, 4], 'L': [1, 5], 'M': [1, 6], 'N': [1, 7], 'O': [1, 8], 'P': [1, 9], 'Q': [1, 10], 'R': [1, 11],
  'S': [2, 4], 'T': [2, 5], 'U': [2, 6], 'V': [2, 7], 'W': [2, 8], 'X': [2, 9], 'Y': [2, 10], 'Z': [2, 11],
  '0': [2], '1': [3], '2': [4], '3': [5], '4': [6], '5': [7], '6': [8], '7': [9], '8': [10], '9': [11],
  ' ': [], '.': [0, 10, 5], ',': [2, 10, 5], '(': [0, 10, 6], ')': [1, 10, 6], '+': [0, 10, 8], '-': [1],
  '*': [1, 10, 6], '/': [2, 3], '=': [2, 10, 8], '\'': [1, 10, 7], ':': [2, 10, 2], '"': [1, 10, 5],
  '!': [0, 1, 10], '?': [1, 2, 10],
};

const REVERSE_MAP: Record<string, string> = Object.entries(IBM_029_MAP).reduce((acc, [char, rows]) => {
  const key = [...rows].sort((a, b) => a - b).join(',');
  acc[key] = char;
  return acc;
}, {} as Record<string, string>);

/**
 * Converts text to a grid. 
 * If text length > 80, it switches to "Dense Mode" (Binary packing).
 * 12 bits per column * 80 columns = 960 bits = 120 bytes.
 */
export const textToGrid = (text: string): PunchGrid => {
  const grid = Array.from({ length: 80 }, () => Array(12).fill(false));
  const isDense = text.length > 80;
  
  if (!isDense) {
    const upperText = text.toUpperCase();
    for (let i = 0; i < Math.min(upperText.length, 80); i++) {
      const char = upperText[i];
      const punches = IBM_029_MAP[char] || [];
      punches.forEach(row => {
        if (row >= 0 && row < 12) grid[i][row] = true;
      });
    }
  } else {
    // Dense/Compressed Encoding: Each column is 12 bits of data
    const bytes = new TextEncoder().encode(text);
    let currentBit = 0;
    for (let col = 0; col < 80; col++) {
      for (let row = 0; row < 12; row++) {
        const byteIdx = Math.floor(currentBit / 8);
        const bitIdx = currentBit % 8;
        if (byteIdx < bytes.length) {
          const bit = (bytes[byteIdx] >> (7 - bitIdx)) & 1;
          if (bit === 1) grid[col][row] = true;
        }
        currentBit++;
      }
    }
  }
  return grid;
};

export const gridToText = (grid: PunchGrid): string => {
  // Check if it's standard or dense based on parity or simply attempt both
  // For this lab, we'll try to decode standard first, then fall back
  let decoded = "";
  let containsInvalid = false;
  
  for (let col = 0; col < 80; col++) {
    const activeRows: number[] = [];
    for (let row = 0; row < 12; row++) {
      if (grid[col][row]) activeRows.push(row);
    }
    const key = activeRows.sort((a, b) => a - b).join(',');
    const char = REVERSE_MAP[key];
    if (activeRows.length > 0 && !char) containsInvalid = true;
    decoded += char || (activeRows.length === 0 ? " " : "?");
  }

  // If standard decoding failed or text looks like binary, attempt dense decoding
  if (containsInvalid) {
    const bytes = new Uint8Array(120);
    let currentBit = 0;
    for (let col = 0; col < 80; col++) {
      for (let row = 0; row < 12; row++) {
        const byteIdx = Math.floor(currentBit / 8);
        const bitIdx = currentBit % 8;
        if (grid[col][row]) {
          bytes[byteIdx] |= (1 << (7 - bitIdx));
        }
        currentBit++;
      }
    }
    const denseText = new TextDecoder().decode(bytes).replace(/\0/g, '');
    return denseText.length > 0 ? denseText : decoded.trimEnd();
  }

  return decoded.trimEnd();
};
