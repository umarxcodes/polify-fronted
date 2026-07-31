import { apiClient } from "../../../lib/axios";

export const getAnalyticsOverview = async () => {
  const { data } = await apiClient.get("/analytics/overview");
  return data;
};

export const getPollAnalytics = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}`);
  return data;
};

export const exportAnalytics = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}/export`);
  return data;
};
