import { describe, expect, it } from 'vitest';
import {
  bytesToHex,
  bytesToWordsLE,
  hexToBytes,
  wordToBinary,
  wordToHex,
  wordToHexLE,
  wordsToBytesLE,
} from '@/lib/crypto/formatters';

describe('formatters', () => {
  it('bytesToHex / hexToBytes round-trip', () => {
    const bytes = new Uint8Array([0, 1, 2, 15, 16, 127, 128, 255]);
    const hex = bytesToHex(bytes);
    expect(hex).toBe('0001020f107f80ff');
    expect(hexToBytes(hex)).toEqual(bytes);
  });

  it('bytesToWordsLE treats the first byte as the low byte of the word', () => {
    const bytes = new Uint8Array([0x78, 0x56, 0x34, 0x12]);
    expect(bytesToWordsLE(bytes)[0]).toBe(0x12345678);
  });

  it('wordsToBytesLE is the inverse of bytesToWordsLE', () => {
    const words = Uint32Array.of(0x12345678, 0xdeadbeef);
    const bytes = wordsToBytesLE(words);
    expect(Array.from(bytes)).toEqual([0x78, 0x56, 0x34, 0x12, 0xef, 0xbe, 0xad, 0xde]);
    expect(bytesToWordsLE(bytes)[0]).toBe(0x12345678);
    expect(bytesToWordsLE(bytes)[1]).toBe(0xdeadbeef);
  });

  it('wordToHex displays the integer value big-endian', () => {
    expect(wordToHex(0x12345678)).toBe('12345678');
  });

  it('wordToHexLE displays the memory layout (little-endian)', () => {
    expect(wordToHexLE(0x12345678)).toBe('78563412');
  });

  it('wordToBinary pads to 32 bits with spaces between bytes', () => {
    expect(wordToBinary(1)).toBe('00000000 00000000 00000000 00000001');
    expect(wordToBinary(0x80000000)).toBe('10000000 00000000 00000000 00000000');
  });
});
