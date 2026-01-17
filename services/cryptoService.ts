
/**
 * Spectral Cryptography Service
 * Uses Web Crypto API for secure code cursing and exorcism.
 */

export const generateKeyId = () => Math.random().toString(36).substring(2, 15);

// Prefix to identify encrypted punch card data
const SPECTRAL_PREFIX = "CURSED::";

export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const pair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const pubExport = await window.crypto.subtle.exportKey("spki", pair.publicKey);
  const privExport = await window.crypto.subtle.exportKey("pkcs8", pair.privateKey);

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(pubExport))),
    privateKey: btoa(String.fromCharCode(...new Uint8Array(privExport))),
  };
}

export async function encryptWithPassword(text: string, password: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password.padEnd(32, '0').substring(0, 32)),
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

  return SPECTRAL_PREFIX + btoa(String.fromCharCode(...combined));
}

export async function decryptWithPassword(cursedText: string, password: string): Promise<string> {
  if (!cursedText.startsWith(SPECTRAL_PREFIX)) return cursedText;
  
  const data = atob(cursedText.replace(SPECTRAL_PREFIX, ""));
  const bytes = new Uint8Array(data.split('').map(c => c.charCodeAt(0)));
  const iv = bytes.slice(0, 12);
  const ciphertext = bytes.slice(12);

  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password.padEnd(32, '0').substring(0, 32)),
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
}
