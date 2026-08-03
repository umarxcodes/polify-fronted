import { apiClient } from "../../../lib/axios";

export const getAnalyticsOverview = async () => {
  const { data } = await apiClient.get("/analytics/dashboard");
  return data?.data || data;
};

export const getPollAnalytics = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}`);
  return data?.data || data;
};

export const getPollResults = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}/results`);
  return data?.data || data;
};

export const getPollChartData = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}/chart`);
  return data?.data || data;
};

export const getTrendingPolls = async () => {
  const { data } = await apiClient.get("/analytics/trending");
  return data?.data || data;
};

export const getUserStats = async () => {
  const { data } = await apiClient.get("/users/stats");
  return data?.data || data;
};

export const getUserVoteHistory = async (page = 1, limit = 50) => {
  const { data } = await apiClient.get("/votes/me/votes", { params: { page, limit } });
  return data?.data || data;
};

export const getPollStats = async (pollId) => {
  const { data } = await apiClient.get(`/votes/polls/${pollId}/stats`);
  return data?.data || data;
};

export const getPolls = async (params = {}) => {
  const { data } = await apiClient.get("/poll", { params });
  return data?.data || data;
};

export const getPollComments = async (pollId, page = 1, limit = 50) => {
  const { data } = await apiClient.get(`/comments/polls/${pollId}`, { params: { page, limit } });
  return data?.data || data;
};

export const getUserBookmarks = async () => {
  const { data } = await apiClient.get("/bookmark");
  return data?.data || data;
};

export const getUserFollowers = async (userId) => {
  const { data } = await apiClient.get(`/follow/${userId}/followers`);
  return data?.data || data;
};

export const getUserFollowing = async (userId) => {
  const { data } = await apiClient.get(`/follow/${userId}/following`);
  return data?.data || data;
};

export const getUserProfile = async () => {
  const { data } = await apiClient.get("/users/me");
  return data?.data || data;
};

export const exportPollAnalytics = async (pollId) => {
  const { data } = await apiClient.get(`/analytics/polls/${pollId}/export`, {
    responseType: "blob",
  });
  return data;
};
