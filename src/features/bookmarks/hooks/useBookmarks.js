import { useState } from "react";
import { bookmarkService } from "../services/bookmarkService";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookmarkService.getBookmarks();
      setBookmarks(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { bookmarks, fetchBookmarks, loading, error };
};
