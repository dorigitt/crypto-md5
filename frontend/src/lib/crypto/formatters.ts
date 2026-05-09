const HEX_CHARS = '0123456789abcdef';

export function encodeUtf8(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

export function bytesToHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    out += HEX_CHARS[(b >>> 4) & 0x0f] + HEX_CHARS[b & 0x0f];
  }
  return out;
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s+/g, '').toLowerCase();
  if (clean.length % 2 !== 0) {
    throw new Error(`hex string must have even length, got ${clean.length}`);
  }
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) throw new Error(`invalid hex at index ${i * 2}`);
    bytes[i] = byte;
  }
  return bytes;
}

/** Little-endian byte slice → u32 array (MD5 block layout). */
export function bytesToWordsLE(bytes: Uint8Array): Uint32Array {
  if (bytes.length % 4 !== 0) {
    throw new Error(`byte length must be a multiple of 4, got ${bytes.length}`);
  }
  const words = new Uint32Array(bytes.length / 4);
  for (let i = 0; i < words.length; i++) {
    words[i] =
      (bytes[i * 4] |
        (bytes[i * 4 + 1] << 8) |
        (bytes[i * 4 + 2] << 16) |
        (bytes[i * 4 + 3] << 24)) >>>
      0;
  }
  return words;
}

/** u32 array → little-endian byte slice. */
export function wordsToBytesLE(words: Uint32Array): Uint8Array {
  const bytes = new Uint8Array(words.length * 4);
  for (let i = 0; i < words.length; i++) {
    const w = words[i] >>> 0;
    bytes[i * 4] = w & 0xff;
    bytes[i * 4 + 1] = (w >>> 8) & 0xff;
    bytes[i * 4 + 2] = (w >>> 16) & 0xff;
    bytes[i * 4 + 3] = (w >>> 24) & 0xff;
  }
  return bytes;
}

/** Display a u32 as big-endian hex (the numeric value itself, zero-padded to 8). */
export function wordToHex(word: number): string {
  return ((word >>> 0).toString(16)).padStart(8, '0');
}

/** Display a u32 as little-endian hex (how it sits in the 64-byte block memory). */
export function wordToHexLE(word: number): string {
  const w = word >>> 0;
  const b0 = (w & 0xff).toString(16).padStart(2, '0');
  const b1 = ((w >>> 8) & 0xff).toString(16).padStart(2, '0');
  const b2 = ((w >>> 16) & 0xff).toString(16).padStart(2, '0');
  const b3 = ((w >>> 24) & 0xff).toString(16).padStart(2, '0');
  return `${b0}${b1}${b2}${b3}`;
}

export function wordToBinary(word: number, separator: boolean = true): string {
  const bin = (word >>> 0).toString(2).padStart(32, '0');
  return separator ? bin.replace(/(.{8})(?=.)/g, '$1 ') : bin;
}

export function byteToBinary(byte: number): string {
  return (byte & 0xff).toString(2).padStart(8, '0');
}

export function bytesToBinary(bytes: Uint8Array, separator: string = ' '): string {
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i++) parts.push(byteToBinary(bytes[i]));
  return parts.join(separator);
}

export function bytesToAscii(bytes: Uint8Array, placeholder: string = '·'): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    out += b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : placeholder;
  }
  return out;
}

/** Produce the "final" hash hex for MD5 — bytes-to-hex on a 16-byte digest. */
export function digestToHex(digest: Uint8Array): string {
  return bytesToHex(digest);
}

export function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU');
}
