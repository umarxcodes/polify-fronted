import { apiClient } from "../../../lib/axios";

export const getBookmarks = async (params = {}) => {
  const { data } = await apiClient.get("/bookmarks", { params });
  return data?.data || data;
};

export const addBookmark = async (pollId) => {
  const { data } = await apiClient.post(`/bookmarks/${pollId}`);
  return data?.data || data;
};

export const removeBookmark = async (pollId) => {
  const { data } = await apiClient.delete(`/bookmarks/${pollId}`);
  return data?.data || data;
};

export const checkBookmarkStatus = async (pollId) => {
  const { data } = await apiClient.get(`/bookmarks/${pollId}/status`);
  return data?.data || data;
};

export const getBookmarkStats = async () => {
  const { data } = await apiClient.get("/bookmarks/stats");
  return data?.data || data;
};
