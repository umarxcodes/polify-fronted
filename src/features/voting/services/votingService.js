import { castVote, changeVote, removeVote, getPollResults, getMyVote, getUserVotes } from "../api/votingApi";

export const votingService = {
  castVote,
  changeVote,
  removeVote,
  getPollResults,
  getMyVote,
  getUserVotes,
};
