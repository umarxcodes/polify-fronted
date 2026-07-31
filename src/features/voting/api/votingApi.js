import { apiClient } from "../../../lib/axios";

export const castVote = async (pollId, optionId) => {
  const { data } = await apiClient.post(`/voting/polls/${pollId}/vote`, { optionId });
  return data;
};

export const getPollResults = async (pollId) => {
  const { data } = await apiClient.get(`/voting/polls/${pollId}/results`);
  return data;
};

export const getUserVotes = async () => {
  const { data } = await apiClient.get("/voting/user/votes");
  return data;
};
