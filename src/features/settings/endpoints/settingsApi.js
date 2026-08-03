import { apiClient } from "../../../lib/axios";

export const getProfile = async () => {
  const { data } = await apiClient.get("/users/me");
  return data?.data?.user || data?.user || data;
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.patch("/users/profile", payload);
  return data?.data?.user || data?.user || data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const { data } = await apiClient.post("/users/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.data?.user || data?.user || data;
};

export const deleteAvatar = async () => {
  const { data } = await apiClient.delete("/users/profile-image");
  return data?.data?.user || data?.user || data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await apiClient.patch("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return data?.data || data;
};

export const getNotificationPreferences = async () => {
  const { data } = await apiClient.get("/notifications/preferences");
  return data?.data?.preferences || data?.preferences || data;
};

export const updateNotificationPreferences = async (preferences) => {
  const { data } = await apiClient.patch("/notifications/preferences", preferences);
  return data?.data?.preferences || data?.preferences || data;
};

export const deleteAccount = async (password) => {
  const { data } = await apiClient.delete("/users/", { data: { password } });
  return data?.data || data;
};

export const getUserStats = async () => {
  const { data } = await apiClient.get("/users/stats");
  return data?.data?.stats || data?.stats || data;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data?.data?.user || data?.user || data;
};
