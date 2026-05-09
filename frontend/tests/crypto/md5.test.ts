import { describe, expect, it } from 'vitest';
import { md5Text, md5Bytes } from '@/lib/crypto/md5';
import { encodeUtf8 } from '@/lib/crypto/formatters';

/**
 * RFC 1321 test vectors (Appendix A.5) — the canonical correctness check for MD5.
 */
const RFC_VECTORS: readonly [input: string, expected: string][] = [
  ['', 'd41d8cd98f00b204e9800998ecf8427e'],
  ['a', '0cc175b9c0f1b6a831c399e269772661'],
  ['abc', '900150983cd24fb0d6963f7d28e17f72'],
  ['message digest', 'f96b697d7cb7938d525a2f31aaf161d0'],
  ['abcdefghijklmnopqrstuvwxyz', 'c3fcd3d76192e4007dfb496cca67e13b'],
  [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    'd174ab98d277d9f5a5611c2c9f419d9f',
  ],
  [
    '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
    '57edf4a22be3c955ac49da2e2107b67a',
  ],
];

describe('md5 — RFC 1321 test vectors', () => {
  for (const [input, expected] of RFC_VECTORS) {
    it(`md5(${JSON.stringify(input)}) === ${expected}`, () => {
      expect(md5Text(input).hex).toBe(expected);
    });
  }
});

describe('md5 — step instrumentation invariants', () => {
  it('emits exactly 64 operation steps per block', () => {
    const { steps } = md5Text('abc');
    const ops = steps.filter((s) => s.kind === 'operation');
    expect(ops).toHaveLength(64);
  });

  it('single-block input ("abc") produces one block', () => {
    const { steps } = md5Text('abc');
    const starts = steps.filter((s) => s.kind === 'block-start');
    expect(starts).toHaveLength(1);
  });

  it('55-byte input fits in one block; 56-byte input needs two blocks', () => {
    const oneBlock = md5Text('a'.repeat(55));
    const twoBlocks = md5Text('a'.repeat(56));
    expect(oneBlock.steps.filter((s) => s.kind === 'block-start')).toHaveLength(1);
    expect(twoBlocks.steps.filter((s) => s.kind === 'block-start')).toHaveLength(2);
  });

  it('input step carries the original bytes, output step carries the digest', () => {
    const { steps, digest } = md5Text('hello');
    const inputStep = steps.find((s) => s.kind === 'input');
    const outputStep = steps.find((s) => s.kind === 'output');
    expect(inputStep && inputStep.kind === 'input' ? inputStep.bytes : null).toEqual(encodeUtf8('hello'));
    expect(outputStep && outputStep.kind === 'output' ? outputStep.hashBytes : null).toEqual(digest);
  });

  it('every operation step has matching before → after rotation semantics', () => {
    const { steps } = md5Text('abc');
    const ops = steps.filter((s) => s.kind === 'operation');
    for (const op of ops) {
      if (op.kind !== 'operation') continue;
      // Per RFC: A := D; D := C; C := B; B := B + rot(F + A + K[i] + M[g], s[i])
      expect(op.after.a).toBe(op.before.d);
      expect(op.after.c).toBe(op.before.b);
      expect(op.after.d).toBe(op.before.c);
      // B is nonlinear, checked via final hash match
    }
  });

  it('final chain state serialised little-endian equals the digest hex', () => {
    const { steps, hex } = md5Text('The quick brown fox jumps over the lazy dog');
    const output = steps[steps.length - 1];
    expect(output.kind).toBe('output');
    if (output.kind === 'output') expect(output.hashHex).toBe(hex);
  });
});

describe('md5 — context propagation', () => {
  it('all steps carry the context from md5Bytes', () => {
    const { steps } = md5Bytes(encodeUtf8('hi'), 'hmac-inner');
    for (const step of steps) {
      if ('context' in step) {
        expect(step.context).toBe('hmac-inner');
      }
    }
  });
});
