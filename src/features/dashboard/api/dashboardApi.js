import { apiClient } from "../../../lib/axios";

export const getDashboardStats = async () => {
  const { data } = await apiClient.get("/dashboard/stats");
  return data;
};

export const getRecentActivity = async () => {
  const { data } = await apiClient.get("/dashboard/activity");
  return data;
};

export const getPollAnalytics = async (pollId) => {
  const { data } = await apiClient.get(`/dashboard/polls/${pollId}/analytics`);
  return data;
};
