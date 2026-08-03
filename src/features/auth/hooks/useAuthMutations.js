import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { authService } from "../services/authService";
import { apiClient } from "../../../lib/axios";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";

export function useLogin() {
  const { establishSession } = useAuth();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      const session = res?.data?.data || res?.data;
      if (session?.accessToken) {
        establishSession(session);
      }
      toast.success("Welcome back!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => toast.success("Account created! Please verify your email."),
    onError: (error) => toast.error(error.response?.data?.message || "Registration failed"),
  });
}

export function useLogout() {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await authApi.getMe();
      return res?.data?.data?.user || res?.data?.user || res?.data;
    },
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => apiClient.put("/users/profile", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload) => apiClient.put("/settings/password", payload),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => toast.success("Reset link sent to your email"),
    onError: (error) => toast.error(error.response?.data?.message || "Request failed"),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload) => authApi.resetPassword(payload),
    onSuccess: () => toast.success("Password reset successful"),
    onError: (error) => toast.error(error.response?.data?.message || "Reset failed"),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => toast.success("Email verified successfully"),
    onError: (error) => toast.error(error.response?.data?.message || "Verification failed"),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: authApi.resendOtp,
    onSuccess: () => toast.success("Verification email resent"),
    onError: (error) => toast.error(error.response?.data?.message || "Resend failed"),
  });
}
