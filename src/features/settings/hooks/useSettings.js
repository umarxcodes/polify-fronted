import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../services/settingsService";

export function useProfile() {
  return useQuery({
    queryKey: ["settings", "profile"],
    queryFn: async () => {
      const data = await settingsService.getProfile();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const data = await settingsService.updateProfile(payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "profile"] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file) => {
      const data = await settingsService.uploadAvatar(file);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "profile"] });
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const data = await settingsService.deleteAvatar();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "profile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const data = await settingsService.changePassword(currentPassword, newPassword);
      return data;
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ["settings", "notifications", "preferences"],
    queryFn: async () => {
      const data = await settingsService.getNotificationPreferences();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences) => {
      const data = await settingsService.updateNotificationPreferences(preferences);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["settings", "notifications", "preferences"], data);
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password) => {
      const data = await settingsService.deleteAccount(password);
      return data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["settings", "user", "stats"],
    queryFn: async () => {
      const data = await settingsService.getUserStats();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["settings", "currentUser"],
    queryFn: async () => {
      const data = await settingsService.getCurrentUser();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
