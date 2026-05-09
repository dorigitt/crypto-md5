import { apiClient, USE_MOCKS } from './client';
import type {
  LeaderboardEntry,
  SubmissionRequest,
  SubmissionResult,
  TaskDetail,
  TaskSummary,
  UserMetrics,
} from './types';
import {
  mockLeaderboard,
  mockMetrics,
  mockSubmit,
  mockTaskDetail,
  mockTasks,
} from './mocks';

export interface TaskFilters {
  difficulty?: string;
  category?: string;
}

const SIMULATED_LATENCY_MS = 400;

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), ms));
}

export async function fetchTasks(filters?: TaskFilters): Promise<TaskSummary[]> {
  if (USE_MOCKS) return delay(mockTasks(filters));
  const { data } = await apiClient.get<TaskSummary[]>('/tasks', { params: filters });
  return data;
}

export async function fetchTaskDetail(id: string): Promise<TaskDetail> {
  if (USE_MOCKS) return delay(mockTaskDetail(id));
  const { data } = await apiClient.get<TaskDetail>(`/tasks/${id}`);
  return data;
}

export async function submitAnswer(
  id: string,
  payload: SubmissionRequest,
): Promise<SubmissionResult> {
  if (USE_MOCKS) return delay(mockSubmit(id, payload));
  const { data } = await apiClient.post<SubmissionResult>(`/tasks/${id}/submit`, payload);
  return data;
}

export async function fetchUserMetrics(): Promise<UserMetrics> {
  if (USE_MOCKS) return delay(mockMetrics());
  const { data } = await apiClient.get<UserMetrics>('/metrics/me');
  return data;
}

export async function fetchLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  if (USE_MOCKS) return delay(mockLeaderboard(limit));
  const { data } = await apiClient.get<LeaderboardEntry[]>('/leaderboard', { params: { limit } });
  return data;
}
