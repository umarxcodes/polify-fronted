import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { getUserStats, getCategories } from "../api/dashboardApi";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/analytics/dashboard");
      return response.data?.data || response.data;
    },
  });
}

export function usePollFeed() {
  return useQuery({
    queryKey: ["polls", "feed"],
    queryFn: async () => {
      const response = await apiClient.get("/search/latest");
      const data = response.data?.data || response.data;
      return data?.polls || data || [];
    },
  });
}

export function useCreatePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pollData) => {
      const response = await apiClient.post("/polls", pollData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useVote(pollId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (optionId) => {
      const response = await apiClient.post(`/votes/polls/${pollId}/vote`, { optionId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });
}

export function usePollDetail(pollId) {
  return useQuery({
    queryKey: ["polls", pollId],
    queryFn: async () => {
      const response = await apiClient.get(`/polls/${pollId}`);
      return response.data?.data || response.data;
    },
    enabled: !!pollId,
  });
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await apiClient.get("/notifications");
      return response.data?.data || response.data;
    },
  });
}

export function useSearchQuery(query) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const [pollsRes, usersRes] = await Promise.all([
        apiClient.get("/search/polls", { params: { q: query } }),
        apiClient.get("/search/users", { params: { q: query } }),
      ]);
      return {
        polls: pollsRes.data?.data || pollsRes.data || [],
        users: usersRes.data?.data || usersRes.data || [],
      };
    },
    enabled: query.length >= 2,
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/dashboard");
      return response.data?.data || response.data;
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["dashboard", "userStats"],
    queryFn: getUserStats,
    staleTime: 60_000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["dashboard", "categories"],
    queryFn: getCategories,
    staleTime: 5 * 60_000,
  });
}
