import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const data = await analyticsService.getAnalyticsOverview();
      return data?.data || data;
    },
  });
}

export function usePollAnalytics(pollId) {
  return useQuery({
    queryKey: ["analytics", "poll", pollId],
    queryFn: async () => {
      const data = await analyticsService.getPollAnalytics(pollId);
      return data?.data || data;
    },
    enabled: Boolean(pollId),
  });
}

export function useChartData(pollId) {
  return useQuery({
    queryKey: ["analytics", "chart", pollId],
    queryFn: async () => {
      const data = await analyticsService.getChartData(pollId);
      return data?.data || data;
    },
    enabled: Boolean(pollId),
  });
}

export function useTrendingPolls() {
  return useQuery({
    queryKey: ["analytics", "trending"],
    queryFn: async () => {
      const data = await analyticsService.getTrendingPolls();
      return data?.data || data;
    },
  });
}
