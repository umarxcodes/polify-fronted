import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "../../../lib/axios";

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

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const response = await apiClient.get("/bookmarks");
      return response.data?.data || response.data;
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await apiClient.get("/notifications");
      return response.data?.data || response.data;
    },
  });
}

export function useSearch(query) {
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

export function useToggleBookmark(pollId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/bookmarks/${pollId}`);
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previous = queryClient.getQueryData(["bookmarks"]);
      queryClient.setQueryData(["bookmarks"], (old) => {
        const list = old?.bookmarks || old || [];
        const exists = list.some(b => b.pollId === pollId);
        if (exists) {
          return { ...old, bookmarks: list.filter(b => b.pollId !== pollId) };
        }
        return { ...old, bookmarks: [...list, { pollId, savedAt: new Date() }] };
      });
      return { previous };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["bookmarks"], context.previous);
      toast.error("Failed to update bookmark", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}
