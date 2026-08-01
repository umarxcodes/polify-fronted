import { apiClient } from "../../../lib/axios";

export const getComments = async (pollId, params = {}) => {
  const { data } = await apiClient.get(`/comments/polls/${pollId}/comments`, { params });
  return data?.data || data;
};

export const createComment = async (pollId, content) => {
  const { data } = await apiClient.post(`/comments/polls/${pollId}/comments`, { content });
  return data?.data || data;
};

export const updateComment = async (commentId, content) => {
  const { data } = await apiClient.patch(`/comments/${commentId}`, { content });
  return data?.data || data;
};

export const deleteComment = async (commentId) => {
  const { data } = await apiClient.delete(`/comments/${commentId}`);
  return data?.data || data;
};

export const replyToComment = async (commentId, content) => {
  const { data } = await apiClient.post(`/comments/${commentId}/replies`, { content });
  return data?.data || data;
};

export const likeComment = async (commentId) => {
  const { data } = await apiClient.post(`/comments/${commentId}/like`);
  return data?.data || data;
};

export const unlikeComment = async (commentId) => {
  const { data } = await apiClient.delete(`/comments/${commentId}/like`);
  return data?.data || data;
};

export const pinComment = async (commentId) => {
  const { data } = await apiClient.patch(`/comments/${commentId}/pin`);
  return data?.data || data;
};

export const unpinComment = async (commentId) => {
  const { data } = await apiClient.delete(`/comments/${commentId}/pin`);
  return data?.data || data;
};

export const reportComment = async (commentId, reason) => {
  const { data } = await apiClient.post(`/comments/${commentId}/report`, { reason });
  return data?.data || data;
};

export const getCommentAnalytics = async (pollId) => {
  const { data } = await apiClient.get(`/comments/polls/${pollId}/analytics`);
  return data?.data || data;
};
