import { apiClient } from "../../../lib/axios";

export const getComments = async (pollId) => {
  const { data } = await apiClient.get(`/comments/polls/${pollId}/comments`);
  return data;
};

export const createComment = async (payload) => {
  const { pollId, ...comment } = payload;
  const { data } = await apiClient.post(`/comments/polls/${pollId}/comments`, comment);
  return data;
};

export const updateComment = async (id, payload) => {
  const { data } = await apiClient.patch(`/comments/${id}`, payload);
  return data;
};

export const deleteComment = async (id) => {
  const { data } = await apiClient.delete(`/comments/${id}`);
  return data;
};
