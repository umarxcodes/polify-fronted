import { apiClient } from "../../../lib/axios";

export const getProfile = async () => {
  const { data } = await apiClient.get("/users/me");
  return data?.data || data;
};

export const getPublicProfile = async (username) => {
  const { data } = await apiClient.get(`/users/${username}`);
  return data?.data || data;
};

export const getUserStats = async () => {
  const { data } = await apiClient.get("/users/stats");
  return data?.data || data;
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.patch("/users/profile", payload);
  return data?.data || data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const { data } = await apiClient.post("/users/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.data || data;
};

export const deleteProfileImage = async () => {
  const { data } = await apiClient.delete("/users/profile-image");
  return data?.data || data;
};

export const deleteAccount = async (payload) => {
  const { data } = await apiClient.delete("/users", { data: payload });
  return data?.data || data;
};

export const followUser = async (userId) => {
  const { data } = await apiClient.post(`/follow/${userId}/follow`);
  return data?.data || data;
};

export const unfollowUser = async (userId) => {
  const { data } = await apiClient.delete(`/follow/${userId}/follow`);
  return data?.data || data;
};

export const getFollowers = async (userId, params = {}) => {
  const { data } = await apiClient.get(`/follow/${userId}/followers`, { params });
  return data?.data || data;
};

export const getFollowing = async (userId, params = {}) => {
  const { data } = await apiClient.get(`/follow/${userId}/following`, { params });
  return data?.data || data;
};

export const checkFollowStatus = async (userId) => {
  const { data } = await apiClient.get(`/follow/${userId}/follow-status`);
  return data?.data || data;
};

export const getBookmarks = async (params = {}) => {
  const { data } = await apiClient.get("/bookmarks", { params });
  return data?.data || data;
};

export const searchUsers = async (query, params = {}) => {
  const { data } = await apiClient.get("/search/users", { params: { q: query, ...params } });
  return data?.data || data;
};
