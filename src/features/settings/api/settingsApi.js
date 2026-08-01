import { apiClient } from "../../../lib/axios";

export const getSettings = async () => {
  const { data } = await apiClient.get("/users/me");
  return data;
};

export const updateSettings = async (payload) => {
  const { data } = await apiClient.patch("/users/profile", payload);
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await apiClient.patch("/auth/change-password", payload);
  return data;
};
