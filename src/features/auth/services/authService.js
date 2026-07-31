/** Normalizes the API envelope so components do not depend on transport details. */
import { authApi } from "../api/authApi";
const unwrap = (response) => response.data?.data;

export const authService = {
  getCsrfToken: async () => unwrap(await authApi.getCsrfToken())?.csrfToken,
  login: async (payload) => unwrap(await authApi.login(payload)),
  register: async (payload) => {
    const { profileImage, ...fields } = payload;
    if (!profileImage) return unwrap(await authApi.register(fields));
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, String(value)));
    formData.append("profileImage", profileImage);
    return unwrap(await authApi.register(formData));
  },
  logout: () => authApi.logout(),
  refreshToken: async () => unwrap(await authApi.refreshToken()),
  getMe: async () => unwrap(await authApi.getMe())?.user,
  forgotPassword: async (payload) => unwrap(await authApi.forgotPassword(payload)),
  resetPassword: async (payload) => unwrap(await authApi.resetPassword(payload)),
  verifyEmail: async (payload) => unwrap(await authApi.verifyEmail(payload)),
  resendOtp: async (payload) => unwrap(await authApi.resendOtp(payload)),
};
