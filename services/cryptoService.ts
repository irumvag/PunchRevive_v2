
/**
 * Secure Data Transmission Service
 * Uses Web Crypto API for authenticated encryption of card data.
 * 
 * NOTE: We use a custom Base32 alphabet (A-Z, 2-7) to ensure 
 * the resulting ciphertext only contains characters supported 
 * by the standard IBM 029 punch card character set.
 */

const SECURE_PREFIX = "SECURE::";
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function toBase32(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function fromBase32(str: string): Uint8Array {
  let bits = 0;
  let value = 0;
  const output = [];
  for (let i = 0; i < str.length; i++) {
    const idx = ALPHABET.indexOf(str[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(output);
}

export async function encryptWithPassword(text: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  // Ensure the password is exactly 32 bytes for the AES key
  const pwData = enc.encode(password.padEnd(32, '0').substring(0, 32));
  
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    pwData,
    "AES-GCM",
    false,
    ["encrypt"]
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    keyMaterial,
    enc.encode(text)
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return SECURE_PREFIX + toBase32(combined);
}

export async function decryptWithPassword(secureText: string, password: string): Promise<string> {
  const pureText = secureText.trim();
  if (!pureText.includes(SECURE_PREFIX)) return secureText;
  
  try {
    const b32Part = pureText.split(SECURE_PREFIX)[1];
    const bytes = fromBase32(b32Part);
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);

    const enc = new TextEncoder();
    const pwData = enc.encode(password.padEnd(32, '0').substring(0, 32));

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      pwData,
      "AES-GCM",
      false,
      ["decrypt"]
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      keyMaterial,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("Decryption failed:", e);
    throw new Error("AUTHENTICATION_FAILURE");
  }
}
