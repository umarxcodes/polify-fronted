import { apiClient } from "../../../lib/axios";

export const getBookmarks = async () => {
  const { data } = await apiClient.get("/bookmarks");
  return data;
};

export const addBookmark = async (pollId) => {
  const { data } = await apiClient.post(`/bookmarks/${pollId}`);
  return data;
};

export const removeBookmark = async (pollId) => {
  const { data } = await apiClient.delete(`/bookmarks/${pollId}`);
  return data;
};
