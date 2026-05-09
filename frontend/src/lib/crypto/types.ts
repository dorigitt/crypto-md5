export type ExplanationLevel = 'easy' | 'medium' | 'hard';

export type HashMode = 'md5' | 'hmac-md5';

export type RoundFuncName = 'F' | 'G' | 'H' | 'I';

export type HashContext = 'plain' | 'hmac-inner' | 'hmac-outer' | 'hmac-key-hash';

export interface BufferState {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface RoundFuncInputs {
  x: number;
  y: number;
  z: number;
}

export interface OperationSubstates {
  /** result of F/G/H/I applied to b,c,d */
  funcOutput: number;
  /** funcOutput + a */
  fPlusA: number;
  /** previous + K[i] */
  plusK: number;
  /** previous + M[g] */
  plusM: number;
  /** previous left-rotated by s[i] */
  rotated: number;
}

export type Md5Step =
  | {
      kind: 'input';
      context: HashContext;
      text?: string;
      bytes: Uint8Array;
    }
  | {
      kind: 'padding';
      context: HashContext;
      originalLenBytes: number;
      paddingBytesAdded: number;
      paddedLenBytes: number;
      paddedBytes: Uint8Array;
    }
  | {
      kind: 'length-appended';
      context: HashContext;
      originalLenBits: number;
      finalBytes: Uint8Array;
    }
  | {
      kind: 'block-split';
      context: HashContext;
      blockCount: number;
      blocks: Uint32Array[];
    }
  | {
      kind: 'init';
      context: HashContext;
      state: BufferState;
    }
  | {
      kind: 'block-start';
      context: HashContext;
      blockIndex: number;
      blockCount: number;
      block: Uint32Array;
      stateBefore: BufferState;
    }
  | {
      kind: 'round-start';
      context: HashContext;
      blockIndex: number;
      roundIndex: 0 | 1 | 2 | 3;
      roundName: RoundFuncName;
    }
  | {
      kind: 'operation';
      context: HashContext;
      blockIndex: number;
      opIndex: number;
      roundIndex: 0 | 1 | 2 | 3;
      funcName: RoundFuncName;
      funcInputs: RoundFuncInputs;
      funcOutput: number;
      k: number;
      s: number;
      mIndex: number;
      m: number;
      before: BufferState;
      substates: OperationSubstates;
      after: BufferState;
    }
  | {
      kind: 'block-end';
      context: HashContext;
      blockIndex: number;
      stateBefore: BufferState;
      stateAfterOps: BufferState;
      stateAfter: BufferState;
    }
  | {
      kind: 'output';
      context: HashContext;
      finalState: BufferState;
      hashHex: string;
      hashBytes: Uint8Array;
    };

export type HmacOnlyStep =
  | {
      kind: 'hmac-input';
      text?: string;
      textBytes: Uint8Array;
      key?: string;
      keyBytes: Uint8Array;
    }
  | {
      kind: 'hmac-key-prep';
      blockSize: number;
      originalKey: Uint8Array;
      keyUsed: Uint8Array;
      action: 'padded' | 'hashed-and-padded' | 'unchanged';
    }
  | {
      kind: 'hmac-xor';
      pad: 'ipad' | 'opad';
      padValue: number;
      keyUsed: Uint8Array;
      xorResult: Uint8Array;
    }
  | {
      kind: 'hmac-inner-start';
      innerInput: Uint8Array;
    }
  | {
      kind: 'hmac-outer-start';
      innerDigest: Uint8Array;
      outerInput: Uint8Array;
    }
  | {
      kind: 'hmac-output';
      macHex: string;
      macBytes: Uint8Array;
    };

export type Step = Md5Step | HmacOnlyStep;

export type StepKind = Step['kind'];

/** Stage in the pipeline UI ribbon */
export type Stage =
  | 'hmac-prep'
  | 'preprocessing'
  | 'padding'
  | 'blocks'
  | 'init'
  | 'rounds'
  | 'output'
  | 'hmac-combine';

/** Map a step to its stage (for the ribbon highlighter) */
export function stepStage(step: Step): Stage {
  switch (step.kind) {
    case 'hmac-input':
    case 'hmac-key-prep':
    case 'hmac-xor':
      return 'hmac-prep';
    case 'input':
      return 'preprocessing';
    case 'padding':
    case 'length-appended':
      return 'padding';
    case 'block-split':
    case 'hmac-inner-start':
    case 'hmac-outer-start':
      return 'blocks';
    case 'init':
      return 'init';
    case 'block-start':
    case 'round-start':
    case 'operation':
    case 'block-end':
      return 'rounds';
    case 'output':
      return 'output';
    case 'hmac-output':
      return 'hmac-combine';
  }
}
