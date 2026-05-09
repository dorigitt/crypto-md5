import { md5Text } from '@/lib/crypto/md5';
import { hmacMd5Text } from '@/lib/crypto/hmac-md5';
import type {
  LeaderboardEntry,
  SubmissionRequest,
  SubmissionResult,
  TaskCategory,
  TaskDetail,
  TaskSummary,
  UserMetrics,
} from './types';
import type { TaskFilters } from './education';

interface TaskRecord {
  summary: TaskSummary;
  detail: TaskDetail;
  expectedAnswer: string;
  compare?: (submitted: string) => boolean;
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '');
}

const RAW_TASKS: TaskRecord[] = [
  {
    summary: {
      id: 't-01-empty-md5',
      title: 'Хеш пустой строки',
      difficulty: 'EASY',
      category: 'FULL_HASH',
      points: 10,
      solved: false,
    },
    detail: {
      id: 't-01-empty-md5',
      title: 'Хеш пустой строки',
      difficulty: 'EASY',
      category: 'FULL_HASH',
      points: 10,
      solved: false,
      description:
        'Вычислите MD5 от пустой строки (длина 0 байт). Это классический RFC 1321 тест-вектор.',
      inputSpec: 'Пустая строка "".',
      expectedFormat: '32 hex-символа, нижний регистр, без пробелов.',
      hints: [
        { order: 1, cost: 1, text: 'Подсказка 1: открытая первая часть хеша — d41d…' },
        { order: 2, cost: 3, text: 'Подсказка 2: полный ответ — d41d8cd98f00b204e9800998ecf8427e.' },
      ],
    },
    expectedAnswer: md5Text('').hex,
  },
  {
    summary: {
      id: 't-02-abc-md5',
      title: 'MD5("abc")',
      difficulty: 'EASY',
      category: 'FULL_HASH',
      points: 10,
      solved: false,
    },
    detail: {
      id: 't-02-abc-md5',
      title: 'MD5("abc")',
      difficulty: 'EASY',
      category: 'FULL_HASH',
      points: 10,
      solved: false,
      description: 'Посчитайте MD5 строки "abc". Ответ длиной ровно 32 hex-символа.',
      inputSpec: 'Строка "abc" (3 байта).',
      expectedFormat: '32 hex-символа, нижний регистр.',
      hints: [{ order: 1, cost: 2, text: 'Начинается на 900150…' }],
    },
    expectedAnswer: md5Text('abc').hex,
  },
  {
    summary: {
      id: 't-03-padding-len',
      title: 'Сколько байт padding для "hello"?',
      difficulty: 'EASY',
      category: 'PADDING',
      points: 15,
      solved: false,
    },
    detail: {
      id: 't-03-padding-len',
      title: 'Сколько байт padding для "hello"?',
      difficulty: 'EASY',
      category: 'PADDING',
      points: 15,
      solved: false,
      description:
        'Сообщение "hello" = 5 байт. Сколько байт будет добавлено во время padding (включая байт 0x80, но НЕ включая 8 байт длины)?',
      inputSpec: '"hello" = 5 байт.',
      expectedFormat: 'Число.',
      hints: [{ order: 1, cost: 2, text: 'Длина после padding должна быть 56 mod 64. 56 − 5 = ?' }],
    },
    expectedAnswer: '51',
  },
  {
    summary: {
      id: 't-04-two-blocks',
      title: 'Когда нужен второй блок?',
      difficulty: 'EASY',
      category: 'PADDING',
      points: 15,
      solved: false,
    },
    detail: {
      id: 't-04-two-blocks',
      title: 'Когда нужен второй блок?',
      difficulty: 'EASY',
      category: 'PADDING',
      points: 15,
      solved: false,
      description:
        'Начиная с какой длины сообщения (в байтах) MD5 использует 2 блока вместо одного? Ответ — минимальная длина.',
      inputSpec: 'Ответ — целое число байт.',
      expectedFormat: 'Число.',
      hints: [
        { order: 1, cost: 3, text: 'Блок = 64 байта. Padding резервирует минимум 1 байт (0x80) + 8 байт длины.' },
      ],
    },
    expectedAnswer: '56',
  },
  {
    summary: {
      id: 't-05-F-function',
      title: 'F(B,C,D) при B=0, C=0xFF, D=0xAA',
      difficulty: 'MEDIUM',
      category: 'ROUND_FUNCTION',
      points: 25,
      solved: false,
    },
    detail: {
      id: 't-05-F-function',
      title: 'F(B,C,D) при B=0x00, C=0xFF, D=0xAA',
      difficulty: 'MEDIUM',
      category: 'ROUND_FUNCTION',
      points: 25,
      solved: false,
      description:
        'F(B,C,D) = (B ∧ C) ∨ (¬B ∧ D). Посчитайте для B = 0x00000000, C = 0x000000FF, D = 0x000000AA. Ответ в hex.',
      inputSpec: 'B=0x00, C=0xFF, D=0xAA (последний байт каждого).',
      expectedFormat: '8 hex-символов (u32).',
      hints: [{ order: 1, cost: 5, text: 'B = 0 значит выбираем D для каждого бита.' }],
    },
    expectedAnswer: '000000aa',
    compare: (a: string) => {
      const n = normalize(a).replace(/^0x/, '');
      return n === '000000aa' || n === 'aa';
    },
  },
  {
    summary: {
      id: 't-06-xor-h',
      title: 'H(B,C,D) — simple XOR',
      difficulty: 'MEDIUM',
      category: 'ROUND_FUNCTION',
      points: 25,
      solved: false,
    },
    detail: {
      id: 't-06-xor-h',
      title: 'H(B,C,D) — simple XOR',
      difficulty: 'MEDIUM',
      category: 'ROUND_FUNCTION',
      points: 25,
      solved: false,
      description: 'H(B,C,D) = B ⊕ C ⊕ D. Посчитайте для B=0xFF00FF00, C=0x0F0F0F0F, D=0xAAAAAAAA.',
      inputSpec: 'Три 32-битных значения.',
      expectedFormat: '8 hex-символов.',
      hints: [{ order: 1, cost: 5, text: 'XOR — побитовый. FF⊕0F=F0, 00⊕0F=0F.' }],
    },
    expectedAnswer: '5aa55aa5',
    compare: (a: string) => normalize(a).replace(/^0x/, '') === '5aa55aa5',
  },
  {
    summary: {
      id: 't-07-hmac',
      title: 'HMAC-MD5("Hi", "k")',
      difficulty: 'HARD',
      category: 'HMAC',
      points: 40,
      solved: false,
    },
    detail: {
      id: 't-07-hmac',
      title: 'HMAC-MD5("Hi", "k")',
      difficulty: 'HARD',
      category: 'HMAC',
      points: 40,
      solved: false,
      description:
        'Посчитайте HMAC-MD5 сообщения "Hi" с ключом "k". Для проверки используйте визуализатор или RFC 2104.',
      inputSpec: 'Текст="Hi", ключ="k".',
      expectedFormat: '32 hex-символа, нижний регистр.',
      hints: [
        { order: 1, cost: 5, text: 'Ключ короткий — дополните нулями до 64 байт.' },
        { order: 2, cost: 10, text: 'Первый символ результата — "1".' },
      ],
    },
    expectedAnswer: hmacMd5Text('Hi', 'k').hex,
  },
  {
    summary: {
      id: 't-08-collision-concept',
      title: 'Что такое коллизия хеш-функции?',
      difficulty: 'EASY',
      category: 'THEORY',
      points: 10,
      solved: false,
    },
    detail: {
      id: 't-08-collision-concept',
      title: 'Что такое коллизия хеш-функции?',
      difficulty: 'EASY',
      category: 'THEORY',
      points: 10,
      solved: false,
      description:
        'Коллизия хеш-функции — это ситуация, когда… Выберите один правильный ответ (введите букву).\n\n' +
        'A. Два разных входа дают одинаковый хеш.\n' +
        'B. Два одинаковых входа дают разные хеши.\n' +
        'C. Хеш-функция перестаёт выдавать выход.\n' +
        'D. Вход отличается от выхода более чем на 50%.',
      inputSpec: 'Одна буква: A, B, C или D.',
      expectedFormat: 'Одна буква.',
      hints: [{ order: 1, cost: 1, text: 'Подумайте о том, что «разные → одинаковые» страшнее.' }],
    },
    expectedAnswer: 'A',
    compare: (a: string) => normalize(a) === 'a',
  },
  {
    summary: {
      id: 't-09-full-hmac-hard',
      title: 'Длинный ключ в HMAC',
      difficulty: 'HARD',
      category: 'HMAC',
      points: 50,
      solved: false,
    },
    detail: {
      id: 't-09-full-hmac-hard',
      title: 'Длинный ключ в HMAC',
      difficulty: 'HARD',
      category: 'HMAC',
      points: 50,
      solved: false,
      description:
        'Что происходит в HMAC-MD5, если длина ключа превышает 64 байта?\n\n' +
        'A. Ключ обрезается до 64 байт.\n' +
        'B. Ключ хешируется MD5 и затем дополняется нулями до 64 байт.\n' +
        'C. Ключ берётся по модулю 64.\n' +
        'D. HMAC отказывается работать.',
      inputSpec: 'Одна буква.',
      expectedFormat: 'Одна буква.',
      hints: [{ order: 1, cost: 5, text: 'RFC 2104 определяет поведение для такого случая.' }],
    },
    expectedAnswer: 'B',
    compare: (a: string) => normalize(a) === 'b',
  },
  {
    summary: {
      id: 't-10-digest-size',
      title: 'Длина выхода MD5',
      difficulty: 'MEDIUM',
      category: 'THEORY',
      points: 20,
      solved: false,
    },
    detail: {
      id: 't-10-digest-size',
      title: 'Длина выхода MD5',
      difficulty: 'MEDIUM',
      category: 'THEORY',
      points: 20,
      solved: false,
      description: 'Сколько бит в выходе MD5? (Только число.)',
      inputSpec: 'Целое число.',
      expectedFormat: 'Число.',
      hints: [{ order: 1, cost: 2, text: 'Четыре 32-битных регистра — A, B, C, D.' }],
    },
    expectedAnswer: '128',
  },
];

const STATE_KEY = 'cryptolab:progress';
interface ProgressState {
  solved: Record<string, { solvedAt: string; attempts: number; hintsUsed: number }>;
  attempts: Record<string, number>;
}

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return { solved: {}, attempts: {} };
    return JSON.parse(raw);
  } catch {
    return { solved: {}, attempts: {} };
  }
}

function saveState(state: ProgressState) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function decorateWithSolved<T extends { id: string; solved: boolean }>(t: T): T {
  const state = loadState();
  return { ...t, solved: Boolean(state.solved[t.id]) };
}

export function mockTasks(filters?: TaskFilters): TaskSummary[] {
  return RAW_TASKS.map((r) => decorateWithSolved(r.summary)).filter((t) => {
    if (filters?.difficulty && t.difficulty !== filters.difficulty) return false;
    if (filters?.category && t.category !== filters.category) return false;
    return true;
  });
}

export function mockTaskDetail(id: string): TaskDetail {
  const record = RAW_TASKS.find((r) => r.summary.id === id);
  if (!record) {
    throw {
      status: 404,
      code: 'TASK_NOT_FOUND',
      message: `Task ${id} not found`,
    };
  }
  return decorateWithSolved(record.detail);
}

export function mockSubmit(id: string, payload: SubmissionRequest): SubmissionResult {
  const record = RAW_TASKS.find((r) => r.summary.id === id);
  if (!record) {
    throw { status: 404, code: 'TASK_NOT_FOUND', message: `Task ${id} not found` };
  }
  const state = loadState();
  const prevAttempts = state.attempts[id] ?? 0;
  const attempts = prevAttempts + 1;
  state.attempts[id] = attempts;

  const isCorrect = record.compare
    ? record.compare(payload.answer)
    : normalize(payload.answer) === normalize(record.expectedAnswer);

  if (isCorrect && !state.solved[id]) {
    state.solved[id] = {
      solvedAt: new Date().toISOString(),
      attempts,
      hintsUsed: 0,
    };
  }
  saveState(state);

  const pointsAwarded = isCorrect && !Object.prototype.hasOwnProperty.call(state.solved, id + ':prev')
    ? Math.max(1, record.summary.points - Math.min(record.summary.points - 1, (attempts - 1) * 2))
    : isCorrect
      ? record.summary.points
      : 0;

  return {
    correct: isCorrect,
    pointsAwarded,
    feedback: isCorrect
      ? 'Всё верно — хорошая работа!'
      : 'Пока не совпадает. Посмотрите подсказки или перепроверьте формат ответа.',
    expectedAnswer: isCorrect ? record.expectedAnswer : undefined,
    metrics: {
      timeMs: 0,
      attempts,
      hintsUsed: 0,
    },
  };
}

export function mockMetrics(): UserMetrics {
  const state = loadState();
  const tasks = RAW_TASKS;
  const solvedIds = Object.keys(state.solved);
  const totalPoints = solvedIds.reduce((sum, id) => {
    const r = tasks.find((t) => t.summary.id === id);
    return sum + (r?.summary.points ?? 0);
  }, 0);

  const byDifficulty: UserMetrics['byDifficulty'] = {
    EASY: { solved: 0, total: 0 },
    MEDIUM: { solved: 0, total: 0 },
    HARD: { solved: 0, total: 0 },
  };
  const byCategory: Record<TaskCategory, number> = {
    PADDING: 0,
    ROUND_FUNCTION: 0,
    FULL_HASH: 0,
    HMAC: 0,
    COLLISION: 0,
    THEORY: 0,
  };

  for (const r of tasks) {
    byDifficulty[r.summary.difficulty].total += 1;
    if (state.solved[r.summary.id]) {
      byDifficulty[r.summary.difficulty].solved += 1;
      byCategory[r.summary.category] += 1;
    }
  }

  const attemptCount = Object.values(state.attempts).reduce((a, b) => a + b, 0);

  return {
    totalPoints,
    solvedCount: solvedIds.length,
    attemptCount,
    byDifficulty,
    byCategory,
  };
}

export function mockLeaderboard(limit: number): LeaderboardEntry[] {
  const sample: LeaderboardEntry[] = [
    { rank: 1, displayName: 'alice.md5', totalPoints: 230, solvedCount: 10 },
    { rank: 2, displayName: 'bob.hashes', totalPoints: 175, solvedCount: 8 },
    { rank: 3, displayName: 'carol.crypto', totalPoints: 160, solvedCount: 7 },
    { rank: 4, displayName: 'dan.rivest', totalPoints: 120, solvedCount: 6 },
    { rank: 5, displayName: 'eve.the.lurker', totalPoints: 95, solvedCount: 5 },
  ];
  return sample.slice(0, limit);
}
