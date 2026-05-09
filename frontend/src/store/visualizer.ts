import { create } from 'zustand';
import type {
  ExplanationLevel,
  HashMode,
  Md5Step,
  Step,
} from '@/lib/crypto/types';
import { filterStepsByLevel } from '@/lib/crypto/levels';
import { md5Text } from '@/lib/crypto/md5';
import { hmacMd5Text } from '@/lib/crypto/hmac-md5';

export type VisualizerStatus = 'idle' | 'ready' | 'error';

interface VisualizerState {
  // Inputs
  
  text: string;
  key: string;
  level: ExplanationLevel;

  // Computed
  mode: HashMode;
  rawSteps: Step[];
  visibleSteps: Step[];
  finalHex: string;

  // Playback
  index: number;
  isPlaying: boolean;
  speedMs: number;

  // Interactive progress
  unlockedIndex: number;
  completedSteps: number[];

  // Status
  status: VisualizerStatus;
  error: string | null;

  // Actions
  setText: (text: string) => void;
  setKey: (key: string) => void;
  setLevel: (level: ExplanationLevel) => void;
  compute: () => void;
  reset: () => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepForward: () => void;
  stepBack: () => void;
  stepTo: (index: number) => void;
  setSpeed: (ms: number) => void;
  completeCurrentStep: () => void;
}

const INPUT_LIMIT_BYTES = 10 * 1024;

function determineMode(key: string): HashMode {
  return key.length === 0 ? 'md5' : 'hmac-md5';
}

function computeSteps(text: string, key: string): {
  mode: HashMode;
  steps: Step[];
  finalHex: string;
} {
  if (key.length === 0) {
    const { steps, hex } = md5Text(text);
    return { mode: 'md5', steps: steps as Md5Step[], finalHex: hex };
  }
  const { steps, hex } = hmacMd5Text(text, key);
  return { mode: 'hmac-md5', steps, finalHex: hex };
}

export const useVisualizer = create<VisualizerState>((set, get) => ({
  text: '',
  key: '',
  level: 'medium',
  mode: 'md5',
  rawSteps: [],
  visibleSteps: [],
  finalHex: '',

  index: 0,
  isPlaying: false,
  speedMs: 800,

  unlockedIndex: 0,
  completedSteps: [],

  status: 'idle',
  error: null,

  setText: (text) => {
    set({ text });
  },

  setKey: (key) => {
    set({ key, mode: determineMode(key) });
  },

  setLevel: (level) => {
    const { rawSteps, unlockedIndex } = get();
    const visibleSteps = filterStepsByLevel(rawSteps, level);

    set({
      level,
      visibleSteps,
      index: Math.min(get().index, Math.max(0, visibleSteps.length - 1), unlockedIndex),
    });
  },

  compute: () => {
    const { text, key, level } = get();
    const byteLen = new TextEncoder().encode(text).length;

    if (byteLen > INPUT_LIMIT_BYTES) {
      set({
        status: 'error',
        error: `Input too long: ${byteLen} bytes > ${INPUT_LIMIT_BYTES}`,
      });
      return;
    }

    try {
      const { mode, steps, finalHex } = computeSteps(text, key);
      const visibleSteps = filterStepsByLevel(steps, level);

      set({
        status: 'ready',
        error: null,
        mode,
        rawSteps: steps,
        visibleSteps,
        finalHex,
        index: 0,
        isPlaying: false,
        unlockedIndex: 0,
        completedSteps: [],
      });
    } catch (err) {
      set({
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  reset: () => {
    set({
      status: 'idle',
      error: null,
      rawSteps: [],
      visibleSteps: [],
      finalHex: '',
      index: 0,
      isPlaying: false,
      unlockedIndex: 0,
      completedSteps: [],
    });
  },

  play: () => {
    set({ isPlaying: true });
  },

  pause: () => {
    set({ isPlaying: false });
  },

  toggle: () => {
    set({ isPlaying: !get().isPlaying });
  },

  stepForward: () => {
    const { index, visibleSteps, unlockedIndex } = get();

    if (index >= unlockedIndex) {
      set({ isPlaying: false });
      return;
    }

    if (index < visibleSteps.length - 1) {
      set({ index: index + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBack: () => {
    const { index } = get();

    if (index > 0) {
      set({ index: index - 1, isPlaying: false });
    }
  },

  stepTo: (target) => {
    const { visibleSteps, unlockedIndex } = get();

    const clamped = Math.max(
      0,
      Math.min(target, visibleSteps.length - 1, unlockedIndex),
    );

    set({ index: clamped, isPlaying: false });
  },

  setSpeed: (ms) => {
    set({ speedMs: ms });
  },

  completeCurrentStep: () => {
    const { index, completedSteps, visibleSteps, unlockedIndex } = get();

    const nextUnlocked = Math.min(index + 1, visibleSteps.length - 1);

    set({
      completedSteps: completedSteps.includes(index)
        ? completedSteps
        : [...completedSteps, index],
      unlockedIndex: Math.max(unlockedIndex, nextUnlocked),
      isPlaying: false,
    });
  },
}));