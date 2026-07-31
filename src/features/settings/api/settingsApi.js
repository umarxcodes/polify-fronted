import { apiClient } from "../../../lib/axios";

export const getSettings = async () => {
  const { data } = await apiClient.get("/settings");
  return data;
};

export const updateSettings = async (payload) => {
  const { data } = await apiClient.put("/settings", payload);
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await apiClient.put("/settings/password", payload);
  return data;
};
