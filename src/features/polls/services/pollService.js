import { pollApi } from "../api/pollApi";

export const pollService = {
  getAllPolls: (params) => pollApi.getPolls(params),
  getPollById: (id) => pollApi.getPollById(id),
  createPoll: (data) => pollApi.createPoll(data),
  updatePoll: (id, data) => pollApi.updatePoll(id, data),
  deletePoll: (id) => pollApi.deletePoll(id),
  vote: (pollId, optionId) => pollApi.vote(pollId, optionId),
  getVotes: (pollId) => pollApi.getVotes(pollId),
};