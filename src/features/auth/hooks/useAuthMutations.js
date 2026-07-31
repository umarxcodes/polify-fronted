import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuth } from "../../../../contexts/AuthContext";
import { toast } from "sonner";

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      login(res.data.data.user);
      toast.success("Welcome back!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => toast.success("Account created! Please verify your email."),
    onError: (error) => toast.error(error.response?.data?.message || "Registration failed"),
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
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
    mutationFn: ({ token, data }) => authApi.resetPassword(token, data),
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
    mutationFn: authApi.resendVerification,
    onSuccess: () => toast.success("Verification email resent"),
    onError: (error) => toast.error(error.response?.data?.message || "Resend failed"),
  });
}
