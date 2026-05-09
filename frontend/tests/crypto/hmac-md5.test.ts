import { describe, expect, it } from 'vitest';
import { hmacMd5Text, hmacMd5Bytes } from '@/lib/crypto/hmac-md5';
import { encodeUtf8, hexToBytes } from '@/lib/crypto/formatters';

/**
 * RFC 2104 test vectors for HMAC-MD5.
 */
describe('hmac-md5 — RFC 2104 test vectors', () => {
  it('key="Jefe", msg="what do ya want for nothing?"', () => {
    expect(hmacMd5Text('what do ya want for nothing?', 'Jefe').hex).toBe(
      '750c783e6ab0b503eaa86e310a5db738',
    );
  });

  it('key=0x0b×16, msg="Hi There"', () => {
    const key = new Uint8Array(16).fill(0x0b);
    const msg = encodeUtf8('Hi There');
    expect(hmacMd5Bytes(msg, key).hex).toBe('9294727a3638bb1c13f48ef8158bfc9d');
  });

  it('key=0xAA×16, msg=0xDD×50', () => {
    const key = new Uint8Array(16).fill(0xaa);
    const msg = new Uint8Array(50).fill(0xdd);
    expect(hmacMd5Bytes(msg, key).hex).toBe('56be34521d144c88dbb8c733f0e8b3f6');
  });

  it('long key (> block size) gets hashed first then padded', () => {
    const key = new Uint8Array(80).fill(0xaa);
    const msg = encodeUtf8('Test Using Larger Than Block-Size Key - Hash Key First');
    expect(hmacMd5Bytes(msg, key).hex).toBe('6b1ab7fe4bd7bf8f0b62e6ce61b9d0cd');
  });
});

describe('hmac-md5 — step structure', () => {
  it('emits key-prep, two xor steps, two inner-/outer-start markers, and output', () => {
    const { steps } = hmacMd5Text('hello', 'secret');
    const kinds = steps.map((s) => s.kind);
    expect(kinds).toContain('hmac-key-prep');
    expect(kinds.filter((k) => k === 'hmac-xor')).toHaveLength(2);
    expect(kinds).toContain('hmac-inner-start');
    expect(kinds).toContain('hmac-outer-start');
    expect(kinds).toContain('hmac-output');
  });

  it('inner and outer MD5 step batches each emit their own output step', () => {
    const { steps } = hmacMd5Text('x', 'y');
    const outputs = steps.filter((s) => s.kind === 'output');
    expect(outputs.length).toBe(2);
    if (outputs[0].kind === 'output' && outputs[1].kind === 'output') {
      expect(outputs[0].context).toBe('hmac-inner');
      expect(outputs[1].context).toBe('hmac-outer');
    }
  });

  it('final hmac hex is the outer MD5 digest', () => {
    const result = hmacMd5Text('hello', 'secret');
    const hmacHex = result.hex;
    expect(hexToBytes(hmacHex)).toEqual(result.mac);
  });
});
