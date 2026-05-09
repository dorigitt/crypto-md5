import type { ExplanationLevel, Step } from './types';

/**
 * Explanation levels are purely a presentation filter. The core emits every step;
 * here we decide which to pass through for each level.
 *
 * - easy: the big picture — input, padding summary, block count, init, block-end
 *         per block, final output. Plus a tiny sample of operations: first 2 and
 *         last 2 of the 64 operations in each block.
 * - medium: + round starts, + block starts, + hmac xor/start markers. Still no
 *           full per-operation sequence.
 * - hard: everything — every operation, every intermediate substate.
 */
export function filterStepsByLevel(
  steps: Step[],
  level: ExplanationLevel,
): Step[] {
  if (level === 'hard') return steps;

  return steps.filter((step) => {
    switch (step.kind) {
      case 'input':
      case 'padding':
      case 'length-appended':
      case 'block-split':
      case 'init':
      case 'output':
      case 'hmac-input':
      case 'hmac-key-prep':
      case 'hmac-inner-start':
      case 'hmac-outer-start':
      case 'hmac-output':
        return true;

      case 'block-start':
      case 'block-end':
      case 'hmac-xor':
        return level === 'medium';

      case 'round-start':
        return level === 'medium';

      case 'operation':
        if (level === 'medium') return false;
        return step.opIndex < 2 || step.opIndex >= 62;

      default:
        return true;
    }
  });
}

/** Total count of operations across all blocks (useful for UI metrics). */
export function countOperations(steps: Step[]): number {
  let n = 0;
  for (const s of steps) if (s.kind === 'operation') n++;
  return n;
}

/** Count MD5 block invocations (including those inside HMAC). */
export function countBlocks(steps: Step[]): number {
  let n = 0;
  for (const s of steps) if (s.kind === 'block-start') n++;
  return n;
}

export const LEVEL_LABELS_RU: Record<ExplanationLevel, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Глубокий',
};

export const LEVEL_DESCRIPTIONS_RU: Record<ExplanationLevel, string> = {
  easy: 'Общие шаги без погружения в биты и раунды. Для первого знакомства.',
  medium: 'Шаги + раунды + блоки. Без отдельных 64 операций каждого блока.',
  hard: 'Всё — каждая из 64 операций внутри блока, битовые представления, промежуточные суммы.',
};
