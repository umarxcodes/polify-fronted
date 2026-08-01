import { apiClient } from "../../../lib/axios";

export const searchPolls = async (query, params = {}) => {
  const { data } = await apiClient.get("/search/polls", { params: { q: query, ...params } });
  return data;
};

export const searchUsers = async (query, params = {}) => {
  const { data } = await apiClient.get("/search/users", { params: { q: query, ...params } });
  return data;
};

export const getSuggestions = async (query) => {
  const { data } = await apiClient.get("/search/suggestions", { params: { q: query } });
  return data;
};

export const getTrendingPolls = async (params = {}) => {
  const { data } = await apiClient.get("/search/trending", { params });
  return data;
};

export const getLatestPolls = async (params = {}) => {
  const { data } = await apiClient.get("/search/latest", { params });
  return data;
};

export const getPopularPolls = async (params = {}) => {
  const { data } = await apiClient.get("/search/popular", { params });
  return data;
};

export const getCategories = async () => {
  const { data } = await apiClient.get("/search/categories");
  return data;
};

export const getEndingSoonPolls = async (params = {}) => {
  const { data } = await apiClient.get("/search/ending-soon", { params });
  return data;
};

export const getRecommendedPolls = async (params = {}) => {
  const { data } = await apiClient.get("/search/recommended", { params });
  return data;
};

export const getSearchHistory = async () => {
  const { data } = await apiClient.get("/search/history");
  return data;
};

export const deleteSearchHistory = async () => {
  const { data } = await apiClient.delete("/search/history");
  return data;
};

export const deleteSearchHistoryItem = async (historyId) => {
  const { data } = await apiClient.delete(`/search/history/${historyId}`);
  return data;
};
