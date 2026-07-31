/**
 * Shared API transport. Access tokens stay in memory while the backend owns the
 * HttpOnly refresh cookie; this keeps a page refresh from exposing a token.
 */
import axios from "axios";
import { API_BASE_URL } from "../constants/api";

let accessToken = null;
let refreshPromise = null;

export function setAuthToken(token) {
  accessToken = token || null;
}

function csrfToken() {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrf-token="))
    ?.split("=")[1];
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

  if (!['get', 'head', 'options'].includes(config.method?.toLowerCase())) {
    const csrf = csrfToken();
    if (csrf) config.headers["x-csrf-token"] = csrf;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url === "/auth/refresh-token";

    if (error.response?.status !== 401 || originalRequest?._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= apiClient
        .post("/auth/refresh-token")
        .then((response) => response.data?.data?.accessToken)
        .finally(() => { refreshPromise = null; });

      const token = await refreshPromise;
      if (!token) throw new Error("Session expired");

      setAuthToken(token);
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      setAuthToken(null);
      return Promise.reject(refreshError);
    }
  },
);
