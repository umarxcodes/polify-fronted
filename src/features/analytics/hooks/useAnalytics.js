import { useState } from "react";
import { analyticsService } from "../services/analyticsService";

export const useAnalytics = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getAnalyticsOverview();
      setOverview(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { overview, fetchOverview, loading, error };
};
