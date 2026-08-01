import { apiClient } from "../../../lib/axios";

export const getProfile = async () => {
  const { data } = await apiClient.get("/users/me");
  return data;
};

export const getUserStats = async () => {
  const { data } = await apiClient.get("/users/stats");
  return data;
};

export const getPublicProfile = async (username) => {
  const { data } = await apiClient.get(`/users/${username}`);
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.patch("/users/profile", payload);
  return data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const { data } = await apiClient.post("/users/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteProfileImage = async () => {
  const { data } = await apiClient.delete("/users/profile-image");
  return data;
};

export const deleteAccount = async (payload) => {
  const { data } = await apiClient.delete("/users", { data: payload });
  return data;
};
