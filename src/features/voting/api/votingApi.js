import { apiClient } from "../../../lib/axios";

export const castVote = async (pollId, optionIds, isAnonymous = false) => {
  const { data } = await apiClient.post(`/votes/polls/${pollId}/vote`, {
    options: optionIds,
    isAnonymous,
  });
  return data?.data || data;
};

export const changeVote = async (pollId, optionIds) => {
  const { data } = await apiClient.patch(`/votes/polls/${pollId}/vote`, {
    options: optionIds,
  });
  return data?.data || data;
};

export const removeVote = async (pollId) => {
  const { data } = await apiClient.delete(`/votes/polls/${pollId}/vote`);
  return data?.data || data;
};

export const getPollResults = async (pollId) => {
  const { data } = await apiClient.get(`/votes/polls/${pollId}/results`);
  return data?.data || data;
};

export const getMyVote = async (pollId) => {
  const { data } = await apiClient.get(`/votes/polls/${pollId}/my-vote`);
  return data?.data || data;
};

export const getUserVoteHistory = async (params = {}) => {
  const { data } = await apiClient.get("/votes/me/votes", { params });
  return data?.data || data;
};

export const getPollStats = async (pollId) => {
  const { data } = await apiClient.get(`/votes/polls/${pollId}/stats`);
  return data?.data || data;
};
