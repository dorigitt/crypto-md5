import {
  BLOCK_SIZE_BYTES,
  DIGEST_SIZE_BYTES,
  IV,
  K,
  S,
} from './constants';
import {
  bytesToHex,
  bytesToWordsLE,
  encodeUtf8,
  wordsToBytesLE,
} from './formatters';
import type {
  BufferState,
  HashContext,
  Md5Step,
  RoundFuncName,
} from './types';

const ROUND_FUNC_NAMES: readonly RoundFuncName[] = ['F', 'G', 'H', 'I'];

const u32 = (n: number): number => n >>> 0;

const leftRotate = (x: number, n: number): number =>
  u32((x << n) | (x >>> (32 - n)));

const F = (x: number, y: number, z: number): number => u32((x & y) | (~x & z));
const G = (x: number, y: number, z: number): number => u32((x & z) | (y & ~z));
const H = (x: number, y: number, z: number): number => u32(x ^ y ^ z);
const I = (x: number, y: number, z: number): number => u32(y ^ (x | ~z));

/**
 * Message-word index g(i) for operation i.
 * Round 1: g = i
 * Round 2: g = (5i + 1) mod 16
 * Round 3: g = (3i + 5) mod 16
 * Round 4: g = (7i)     mod 16
 */
const messageScheduleIndex = (op: number): number => {
  if (op < 16) return op;
  if (op < 32) return (5 * op + 1) & 15;
  if (op < 48) return (3 * op + 5) & 15;
  return (7 * op) & 15;
};

/**
 * Append a 0x80 byte then zero-bytes so the length reaches 56 mod 64.
 * (The final 8 bytes of the block are reserved for the 64-bit length.)
 */
export function padMessage(bytes: Uint8Array): Uint8Array {
  const originalLen = bytes.length;
  const remainder = originalLen % BLOCK_SIZE_BYTES;
  const paddingLen = remainder < 56 ? 56 - remainder : 120 - remainder;
  const result = new Uint8Array(originalLen + paddingLen);
  result.set(bytes, 0);
  result[originalLen] = 0x80;
  return result;
}

export function appendLength(paddedBytes: Uint8Array, originalLenBytes: number): Uint8Array {
  const result = new Uint8Array(paddedBytes.length + 8);
  result.set(paddedBytes, 0);
  const lenBits = BigInt(originalLenBytes) * 8n;
  const view = new DataView(result.buffer, result.byteOffset, result.byteLength);
  view.setBigUint64(paddedBytes.length, lenBits, true);
  return result;
}

export function splitBlocks(finalBytes: Uint8Array): Uint32Array[] {
  if (finalBytes.length % BLOCK_SIZE_BYTES !== 0) {
    throw new Error(
      `split: length must be a multiple of ${BLOCK_SIZE_BYTES}, got ${finalBytes.length}`,
    );
  }
  const blocks: Uint32Array[] = [];
  for (let i = 0; i < finalBytes.length; i += BLOCK_SIZE_BYTES) {
    blocks.push(bytesToWordsLE(finalBytes.subarray(i, i + BLOCK_SIZE_BYTES)));
  }
  return blocks;
}

export interface Md5Result {
  steps: Md5Step[];
  digest: Uint8Array;
  hex: string;
}

export function md5Text(text: string, context: HashContext = 'plain'): Md5Result {
  return md5Bytes(encodeUtf8(text), context, text);
}

export function md5Bytes(
  bytes: Uint8Array,
  context: HashContext = 'plain',
  displayText?: string,
): Md5Result {
  const steps: Md5Step[] = [];

  steps.push({ kind: 'input', context, text: displayText, bytes });

  const padded = padMessage(bytes);
  steps.push({
    kind: 'padding',
    context,
    originalLenBytes: bytes.length,
    paddingBytesAdded: padded.length - bytes.length,
    paddedLenBytes: padded.length,
    paddedBytes: padded,
  });

  const finalBytes = appendLength(padded, bytes.length);
  steps.push({
    kind: 'length-appended',
    context,
    originalLenBits: bytes.length * 8,
    finalBytes,
  });

  const blocks = splitBlocks(finalBytes);
  steps.push({
    kind: 'block-split',
    context,
    blockCount: blocks.length,
    blocks,
  });

  let state: BufferState = { ...IV };
  steps.push({ kind: 'init', context, state: { ...state } });

  for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
    const block = blocks[bIdx];
    const stateBefore: BufferState = { ...state };

    steps.push({
      kind: 'block-start',
      context,
      blockIndex: bIdx,
      blockCount: blocks.length,
      block,
      stateBefore,
    });

    let a = state.a;
    let b = state.b;
    let c = state.c;
    let d = state.d;

    for (let round = 0; round < 4; round++) {
      steps.push({
        kind: 'round-start',
        context,
        blockIndex: bIdx,
        roundIndex: round as 0 | 1 | 2 | 3,
        roundName: ROUND_FUNC_NAMES[round],
      });

      for (let op = round * 16; op < (round + 1) * 16; op++) {
        const mIndex = messageScheduleIndex(op);
        const m = block[mIndex];
        let funcOutput: number;
        switch (round) {
          case 0:
            funcOutput = F(b, c, d);
            break;
          case 1:
            funcOutput = G(b, c, d);
            break;
          case 2:
            funcOutput = H(b, c, d);
            break;
          default:
            funcOutput = I(b, c, d);
            break;
        }

        const before: BufferState = { a, b, c, d };
        const fPlusA = u32(funcOutput + a);
        const plusK = u32(fPlusA + K[op]);
        const plusM = u32(plusK + m);
        const rotated = leftRotate(plusM, S[op]);
        const newB = u32(b + rotated);

        const after: BufferState = { a: d, b: newB, c: b, d: c };

        steps.push({
          kind: 'operation',
          context,
          blockIndex: bIdx,
          opIndex: op,
          roundIndex: round as 0 | 1 | 2 | 3,
          funcName: ROUND_FUNC_NAMES[round],
          funcInputs: { x: b, y: c, z: d },
          funcOutput,
          k: K[op],
          s: S[op],
          mIndex,
          m,
          before,
          substates: { funcOutput, fPlusA, plusK, plusM, rotated },
          after,
        });

        a = after.a;
        b = after.b;
        c = after.c;
        d = after.d;
      }
    }

    const stateAfterOps: BufferState = { a, b, c, d };
    state = {
      a: u32(stateBefore.a + a),
      b: u32(stateBefore.b + b),
      c: u32(stateBefore.c + c),
      d: u32(stateBefore.d + d),
    };

    steps.push({
      kind: 'block-end',
      context,
      blockIndex: bIdx,
      stateBefore,
      stateAfterOps,
      stateAfter: { ...state },
    });
  }

  const digest = wordsToBytesLE(
    Uint32Array.of(state.a, state.b, state.c, state.d),
  );
  const hex = bytesToHex(digest);

  steps.push({
    kind: 'output',
    context,
    finalState: state,
    hashHex: hex,
    hashBytes: digest,
  });

  if (digest.length !== DIGEST_SIZE_BYTES) {
    throw new Error(`internal: digest length ${digest.length} !== ${DIGEST_SIZE_BYTES}`);
  }

  return { steps, digest, hex };
}
