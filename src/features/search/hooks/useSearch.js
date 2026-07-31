import { useState } from "react";
import { searchService } from "../services/searchService";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchService.searchPolls(searchQuery);
      setResults(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { query, setQuery, results, performSearch, loading, error };
};
