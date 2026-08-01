import { apiClient } from "../../../lib/axios";

export const getComments = async (pollId) => {
  const { data } = await apiClient.get(`/comments/polls/${pollId}/comments`);
  return data;
};

export const createComment = async (pollId, comment) => {
  const { data } = await apiClient.post(`/comments/polls/${pollId}/comments`, comment);
  return data;
};

export const updateComment = async (commentId, payload) => {
  const { data } = await apiClient.patch(`/comments/${commentId}`, payload);
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await apiClient.delete(`/comments/${commentId}`);
  return data;
};

export const replyToComment = async (commentId, reply) => {
  const { data } = await apiClient.post(`/comments/${commentId}/replies`, reply);
  return data;
};

export const likeComment = async (commentId) => {
  const { data } = await apiClient.post(`/comments/${commentId}/like`);
  return data;
};

export const unlikeComment = async (commentId) => {
  const { data } = await apiClient.delete(`/comments/${commentId}/like`);
  return data;
};

export const pinComment = async (commentId) => {
  const { data } = await apiClient.patch(`/comments/${commentId}/pin`);
  return data;
};

export const unpinComment = async (commentId) => {
  const { data } = await apiClient.delete(`/comments/${commentId}/pin`);
  return data;
};

export const reportComment = async (commentId, reason) => {
  const { data } = await apiClient.post(`/comments/${commentId}/report`, { reason });
  return data;
};
