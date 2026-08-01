import { apiClient } from "../../../lib/axios";

export const getAnalyticsOverview = async () => {
  const { data } = await apiClient.get("/analytics/dashboard");
  return data;
};

export const getPollAnalytics = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}`);
  return data;
};

export const getChartData = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}/chart`);
  return data;
};

export const getTrendingPolls = async () => {
  const { data } = await apiClient.get("/analytics/trending");
  return data;
};

export const exportAnalytics = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}/export`);
  return data;
};
