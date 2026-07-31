import { apiClient } from "../../../lib/axios";

export const getAdminStats = async () => {
  const { data } = await apiClient.get("/admin/stats");
  return data;
};

export const getUsers = async () => {
  const { data } = await apiClient.get("/admin/users");
  return data;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await apiClient.put(`/admin/users/${userId}/role`, { role });
  return data;
};

export const getSystemHealth = async () => {
  const { data } = await apiClient.get("/admin/health");
  return data;
};
