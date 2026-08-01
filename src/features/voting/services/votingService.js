import { castVote, changeVote, removeVote, getPollResults, getMyVote, getUserVoteHistory } from "../api/votingApi";

export const votingService = {
  castVote,
  changeVote,
  removeVote,
  getPollResults,
  getMyVote,
  getUserVoteHistory,
};
