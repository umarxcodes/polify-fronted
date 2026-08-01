import { apiClient } from "../../../lib/axios";

export const pollApi = {
  getPolls: (params) => apiClient.get("/polls", { params }),
  getPollById: (id) => apiClient.get(`/polls/${id}`),
  createPoll: (data) => apiClient.post("/polls", data),
  updatePoll: (id, data) => apiClient.patch(`/polls/${id}`, data),
  deletePoll: (id) => apiClient.delete(`/polls/${id}`),
  vote: (pollId, optionId) =>
    apiClient.post(`/votes/polls/${pollId}/vote`, { options: [optionId] }),
  getVotes: (pollId) => apiClient.get(`/polls/${pollId}/results`),
  getPollResults: (pollId) => apiClient.get(`/polls/${pollId}/results`),
};
