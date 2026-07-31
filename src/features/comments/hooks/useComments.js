import { useState } from "react";
import { commentService } from "../services/commentService";

export const useComments = (pollId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.getComments(pollId);
      setComments(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { comments, fetchComments, loading, error };
};
