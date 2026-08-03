import { apiClient } from "../../../lib/axios";

export const getDashboardStats = async () => {
  const { data } = await apiClient.get("/analytics/dashboard");
  return data?.data || data;
};

export const getLatestPolls = async () => {
  const { data } = await apiClient.get("/search/latest");
  return data?.data || data;
};

export const getTrendingPolls = async () => {
  const { data } = await apiClient.get("/search/trending");
  return data?.data || data;
};

export const getRecommendedPolls = async () => {
  const { data } = await apiClient.get("/search/recommended");
  return data?.data || data;
};

export const getNotifications = async (limit = 5) => {
  const { data } = await apiClient.get("/notifications/", {
    params: { limit, sort: "newest" },
  });
  return data?.data || data;
};

export const getUnreadCount = async () => {
  const { data } = await apiClient.get("/notifications/unread-count");
  return data?.data?.count || data?.count || 0;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/users/me");
  return data?.data?.user || data?.user || data?.data || data;
};

export const getUserStats = async () => {
  const { data } = await apiClient.get("/users/stats");
  return data?.data?.stats || data?.stats || data?.data || data;
};

export const getCategories = async () => {
  const { data } = await apiClient.get("/search/categories");
  return data?.data || data;
};

export const getSearchSuggestions = async (query) => {
  const { data } = await apiClient.get("/search/suggestions", {
    params: { q: query },
  });
  return data?.data || data || [];
};
