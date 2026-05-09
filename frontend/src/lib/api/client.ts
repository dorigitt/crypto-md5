import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ApiError } from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (r) => r,
  (error: AxiosError<ApiError>) => {
    const payload = error.response?.data;
    const normalized: ApiError = {
      status: error.response?.status ?? 0,
      code: payload?.code ?? 'UNKNOWN',
      message: payload?.message ?? error.message,
    };
    return Promise.reject(normalized);
  },
);

export const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true';
