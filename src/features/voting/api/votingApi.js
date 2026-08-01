import { apiClient } from "../../../lib/axios";

export const castVote = async (pollId, optionId) => {
  const { data } = await apiClient.post(`/votes/polls/${pollId}/vote`, { optionId });
  return data;
};

export const changeVote = async (pollId, optionId) => {
  const { data } = await apiClient.patch(`/votes/polls/${pollId}/vote`, { optionId });
  return data;
};

export const removeVote = async (pollId) => {
  const { data } = await apiClient.delete(`/votes/polls/${pollId}/vote`);
  return data;
};

export const getPollResults = async (pollId) => {
  const { data } = await apiClient.get(`/votes/polls/${pollId}/results`);
  return data;
};

export const getMyVote = async (pollId) => {
  const { data } = await apiClient.get(`/votes/polls/${pollId}/my-vote`);
  return data;
};

export const getUserVotes = async () => {
  const { data } = await apiClient.get("/votes/me/votes");
  return data;
};
