import {
  BLOCK_SIZE_BYTES,
  HMAC_IPAD,
  HMAC_OPAD,
} from './constants';
import { bytesToHex, encodeUtf8 } from './formatters';
import { md5Bytes } from './md5';
import type { Md5Step, Step } from './types';

export interface HmacResult {
  steps: Step[];
  mac: Uint8Array;
  hex: string;
}

interface KeyPrep {
  keyUsed: Uint8Array;
  action: 'padded' | 'hashed-and-padded' | 'unchanged';
  hashSteps?: Md5Step[];
  hashBytes?: Uint8Array;
}

function prepareKey(key: Uint8Array): KeyPrep {
  if (key.length === BLOCK_SIZE_BYTES) {
    return { keyUsed: key, action: 'unchanged' };
  }
  if (key.length < BLOCK_SIZE_BYTES) {
    const padded = new Uint8Array(BLOCK_SIZE_BYTES);
    padded.set(key, 0);
    return { keyUsed: padded, action: 'padded' };
  }
  const { steps, digest } = md5Bytes(key, 'hmac-key-hash');
  const padded = new Uint8Array(BLOCK_SIZE_BYTES);
  padded.set(digest, 0);
  return {
    keyUsed: padded,
    action: 'hashed-and-padded',
    hashSteps: steps,
    hashBytes: digest,
  };
}

function xorWithPad(keyUsed: Uint8Array, pad: number): Uint8Array {
  const out = new Uint8Array(BLOCK_SIZE_BYTES);
  for (let i = 0; i < BLOCK_SIZE_BYTES; i++) out[i] = keyUsed[i] ^ pad;
  return out;
}

export function hmacMd5Text(text: string, key: string): HmacResult {
  return hmacMd5Bytes(encodeUtf8(text), encodeUtf8(key), text, key);
}

export function hmacMd5Bytes(
  textBytes: Uint8Array,
  keyBytes: Uint8Array,
  displayText?: string,
  displayKey?: string,
): HmacResult {
  const steps: Step[] = [];

  steps.push({
    kind: 'hmac-input',
    text: displayText,
    textBytes,
    key: displayKey,
    keyBytes,
  });

  const keyPrep = prepareKey(keyBytes);
  if (keyPrep.hashSteps) steps.push(...keyPrep.hashSteps);
  steps.push({
    kind: 'hmac-key-prep',
    blockSize: BLOCK_SIZE_BYTES,
    originalKey: keyBytes,
    keyUsed: keyPrep.keyUsed,
    action: keyPrep.action,
  });

  const kIpad = xorWithPad(keyPrep.keyUsed, HMAC_IPAD);
  steps.push({
    kind: 'hmac-xor',
    pad: 'ipad',
    padValue: HMAC_IPAD,
    keyUsed: keyPrep.keyUsed,
    xorResult: kIpad,
  });

  const innerInput = new Uint8Array(BLOCK_SIZE_BYTES + textBytes.length);
  innerInput.set(kIpad, 0);
  innerInput.set(textBytes, BLOCK_SIZE_BYTES);
  steps.push({ kind: 'hmac-inner-start', innerInput });

  const innerResult = md5Bytes(innerInput, 'hmac-inner');
  steps.push(...innerResult.steps);

  const kOpad = xorWithPad(keyPrep.keyUsed, HMAC_OPAD);
  steps.push({
    kind: 'hmac-xor',
    pad: 'opad',
    padValue: HMAC_OPAD,
    keyUsed: keyPrep.keyUsed,
    xorResult: kOpad,
  });

  const outerInput = new Uint8Array(BLOCK_SIZE_BYTES + innerResult.digest.length);
  outerInput.set(kOpad, 0);
  outerInput.set(innerResult.digest, BLOCK_SIZE_BYTES);
  steps.push({
    kind: 'hmac-outer-start',
    innerDigest: innerResult.digest,
    outerInput,
  });

  const outerResult = md5Bytes(outerInput, 'hmac-outer');
  steps.push(...outerResult.steps);

  const mac = outerResult.digest;
  const hex = bytesToHex(mac);

  steps.push({
    kind: 'hmac-output',
    macHex: hex,
    macBytes: mac,
  });

  return { steps, mac, hex };
}
