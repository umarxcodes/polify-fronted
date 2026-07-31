import { useState } from "react";
import { votingService } from "../services/votingService";

export const useVoting = () => {
  const [userVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const castVote = async (pollId, optionId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await votingService.castVote(pollId, optionId);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { userVotes, castVote, loading, error };
};
