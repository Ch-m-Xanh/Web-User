import axios, { AxiosError } from 'axios';
import { emitGlobalPopup } from '../context/GlobalPopupContext';
import type { ApiError } from '../types';

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export const TOKEN_STORAGE_KEY = 'chamxanh_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function extractErrorMessage(error: AxiosError<ApiError>): string {
  const data = error.response?.data;
  if (data && typeof data === 'object' && 'error' in data && data.error?.message) {
    return data.error.message;
  }
  if (error.response) {
    return `Lỗi máy chủ (${error.response.status}). Vui lòng thử lại sau.`;
  }
  if (error.request) {
    return 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.';
  }
  return error.message || 'Đã xảy ra lỗi không xác định.';
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const message = extractErrorMessage(error);
    emitGlobalPopup('error', message);
    return Promise.reject(error);
  },
);
