/**
 * DTOs that the Java backend will expose over HTTP.
 * These match Spring/Jackson-friendly shapes — lowerCamelCase field names,
 * ISO-8601 dates as strings, enum values as UPPER_SNAKE_CASE strings.
 *
 * Keeping this file the single source of truth means renaming a field =
 * changing one place, and TypeScript will flag every consumer.
 */

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type TaskCategory =
  | 'PADDING'
  | 'ROUND_FUNCTION'
  | 'FULL_HASH'
  | 'HMAC'
  | 'COLLISION'
  | 'THEORY';

export interface TaskSummary {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: TaskCategory;
  points: number;
  solved: boolean;
}

export interface Hint {
  order: number;
  cost: number;
  text: string;
}

export interface TaskDetail extends TaskSummary {
  description: string;
  inputSpec: string;
  expectedFormat: string;
  hints: Hint[];
}

export interface SubmissionRequest {
  answer: string;
}

export interface SubmissionResult {
  correct: boolean;
  pointsAwarded: number;
  feedback: string;
  expectedAnswer?: string;
  metrics: {
    timeMs: number;
    attempts: number;
    hintsUsed: number;
  };
}

export interface UserMetrics {
  totalPoints: number;
  solvedCount: number;
  attemptCount: number;
  byDifficulty: Record<Difficulty, { solved: number; total: number }>;
  byCategory: Record<TaskCategory, number>;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  totalPoints: number;
  solvedCount: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
}
