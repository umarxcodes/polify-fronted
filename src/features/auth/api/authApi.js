/** Only endpoints documented by the Pollify backend are declared here. */
import { apiClient } from "../../../lib/axios";

export const authApi = {
  getCsrfToken: () => apiClient.get("/csrf-token"),
  login: (payload) => apiClient.post("/auth/login", payload),
  register: (payload) => apiClient.post("/auth/register", payload, {
    headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  }),
  logout: () => apiClient.post("/auth/logout"),
  refreshToken: () => apiClient.post("/auth/refresh-token"),
  forgotPassword: (payload) => apiClient.post("/auth/forgot-password", payload),
  resetPassword: (payload) => apiClient.post("/auth/reset-password", payload),
  verifyEmail: (payload) => apiClient.post("/auth/verify-email", payload),
  resendOtp: (payload) => apiClient.post("/auth/resend-verification", payload),
  getMe: () => apiClient.get("/auth/me"),
};
