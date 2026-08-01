import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookmarkService } from "../services/bookmarkService";
import { toast } from "sonner";

export const useBookmarks = (params = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookmarks", params],
    queryFn: () => bookmarkService.getBookmarks(params),
    staleTime: 30_000,
  });

  const bookmarks = data?.bookmarks || [];
  const pagination = data?.pagination || {};

  const addMutation = useMutation({
    mutationFn: (pollId) => bookmarkService.addBookmark(pollId),
    onMutate: async (pollId) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previousBookmarks = queryClient.getQueryData(["bookmarks", params]);

      queryClient.setQueryData(["bookmarks", params], (old) => {
        if (!old) return old;
        return {
          ...old,
          bookmarks: [
            {
              id: `temp-${Date.now()}`,
              poll: {
                _id: pollId,
                title: "Loading...",
                category: "",
                totalVotes: 0,
                createdAt: new Date().toISOString(),
                createdBy: { name: "", username: "" },
              },
              savedAt: new Date().toISOString(),
            },
            ...old.bookmarks,
          ],
        };
      });

      return { previousBookmarks };
    },
    onError: (err, _pollId, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(["bookmarks", params], context.previousBookmarks);
      }
      toast.error(err.response?.data?.message || "Failed to save bookmark");
    },
    onSuccess: () => {
      toast.success("Poll saved to bookmarks");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (pollId) => bookmarkService.removeBookmark(pollId),
    onMutate: async (pollId) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previousBookmarks = queryClient.getQueryData(["bookmarks", params]);

      queryClient.setQueryData(["bookmarks", params], (old) => {
        if (!old) return old;
        return {
          ...old,
          bookmarks: old.bookmarks.filter((b) => {
            const poll = b.poll || b.pollId || b;
            return poll._id !== pollId;
          }),
        };
      });

      return { previousBookmarks };
    },
    onError: (err, _pollId, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(["bookmarks", params], context.previousBookmarks);
      }
      toast.error(err.response?.data?.message || "Failed to remove bookmark");
    },
    onSuccess: () => {
      toast.success("Bookmark removed");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const addBookmark = (pollId) => addMutation.mutateAsync(pollId);
  const removeBookmark = (pollId) => removeMutation.mutateAsync(pollId);

  return {
    bookmarks,
    pagination,
    isLoading,
    error,
    refetch,
    addBookmark,
    removeBookmark,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};

export const useBookmarkStatus = (pollId) => {
  return useQuery({
    queryKey: ["bookmarks", "status", pollId],
    queryFn: () => bookmarkService.checkBookmarkStatus(pollId),
    enabled: !!pollId,
    staleTime: 60_000,
  });
};

export const useBookmarkStats = () => {
  return useQuery({
    queryKey: ["bookmarks", "stats"],
    queryFn: () => bookmarkService.getBookmarkStats(),
    staleTime: 60_000,
  });
};
