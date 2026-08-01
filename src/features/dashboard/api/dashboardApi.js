import { apiClient } from "../../../lib/axios";

export const getDashboardStats = async () => {
  const { data } = await apiClient.get("/analytics/dashboard");
  return data;
};

export const getRecentActivity = async () => {
  const { data } = await apiClient.get("/search/latest");
  return data;
};

export const getTrendingPolls = async () => {
  const { data } = await apiClient.get("/search/trending");
  return data;
};

export const getPollAnalytics = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}`);
  return data;
};
