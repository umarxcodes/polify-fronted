import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentService } from "../services/commentService";
import { toast } from "sonner";

export const useComments = (pollId) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["comments", pollId],
    queryFn: () =>
      commentService.getComments(pollId, { page: 1, limit: 20, sort: "newest" }),
    enabled: !!pollId,
    staleTime: 30_000,
  });

  const comments = data?.comments || [];
  const pagination = data?.pagination || {};

  const addCommentMutation = useMutation({
    mutationFn: (content) => commentService.createComment(pollId, content),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["comments", pollId] });
      const previousComments = queryClient.getQueryData(["comments", pollId]);

      const tempComment = {
        _id: `temp-${Date.now()}`,
        pollId,
        userId: { _id: "current-user", name: "You", username: "you" },
        content,
        likesCount: 0,
        repliesCount: 0,
        isEdited: false,
        isPinned: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasLiked: false,
        replies: [],
      };

      queryClient.setQueryData(["comments", pollId], (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: [tempComment, ...old.comments],
        };
      });

      return { previousComments };
    },
    onError: (err, _content, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", pollId], context.previousComments);
      }
      toast.error(err.response?.data?.message || "Failed to add comment");
    },
    onSuccess: () => {
      toast.success("Comment added");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pollId] });
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, content }) =>
      commentService.updateComment(commentId, content),
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", pollId] });
      const previousComments = queryClient.getQueryData(["comments", pollId]);

      queryClient.setQueryData(["comments", pollId], (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments.map((c) =>
            c._id === commentId
              ? { ...c, content, isEdited: true, updatedAt: new Date().toISOString() }
              : c
          ),
        };
      });

      return { previousComments };
    },
    onError: (err, _vars, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", pollId], context.previousComments);
      }
      toast.error(err.response?.data?.message || "Failed to edit comment");
    },
    onSuccess: () => {
      toast.success("Comment updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pollId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => commentService.deleteComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments", pollId] });
      const previousComments = queryClient.getQueryData(["comments", pollId]);

      queryClient.setQueryData(["comments", pollId], (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments.map((c) =>
            c._id === commentId
              ? { ...c, isDeleted: true, content: "This comment has been deleted." }
              : c
          ),
        };
      });

      return { previousComments };
    },
    onError: (err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", pollId], context.previousComments);
      }
      toast.error(err.response?.data?.message || "Failed to delete comment");
    },
    onSuccess: () => {
      toast.success("Comment deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pollId] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ commentId, content }) =>
      commentService.replyToComment(commentId, content),
    onSuccess: () => {
      toast.success("Reply added");
    },
    onError: () => {
      toast.error("Failed to add reply");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pollId] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (commentId) => commentService.likeComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments", pollId] });
      const previousComments = queryClient.getQueryData(["comments", pollId]);

      queryClient.setQueryData(["comments", pollId], (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments.map((c) => {
            if (c._id === commentId) {
              const hasLiked = !c.hasLiked;
              return {
                ...c,
                hasLiked,
                likesCount: hasLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
              };
            }
            if (c.replies) {
              return {
                ...c,
                replies: c.replies.map((r) => {
                  if (r._id === commentId) {
                    const hasLiked = !r.hasLiked;
                    return {
                      ...r,
                      hasLiked,
                      likesCount: hasLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
                    };
                  }
                  return r;
                }),
              };
            }
            return c;
          }),
        };
      });

      return { previousComments };
    },
    onError: (err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", pollId], context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pollId] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: (commentId) => commentService.unlikeComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments", pollId] });
      const previousComments = queryClient.getQueryData(["comments", pollId]);

      queryClient.setQueryData(["comments", pollId], (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments.map((c) => {
            if (c._id === commentId) {
              return {
                ...c,
                hasLiked: false,
                likesCount: Math.max(0, c.likesCount - 1),
              };
            }
            if (c.replies) {
              return {
                ...c,
                replies: c.replies.map((r) => {
                  if (r._id === commentId) {
                    return {
                      ...r,
                      hasLiked: false,
                      likesCount: Math.max(0, r.likesCount - 1),
                    };
                  }
                  return r;
                }),
              };
            }
            return c;
          }),
        };
      });

      return { previousComments };
    },
    onError: (err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", pollId], context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pollId] });
    },
  });

  const pinMutation = useMutation({
    mutationFn: (commentId) => commentService.pinComment(commentId),
    onSuccess: () => {
      toast.success("Comment pinned");
    },
    onError: () => {
      toast.error("Failed to pin comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pollId] });
    },
  });

  const unpinMutation = useMutation({
    mutationFn: (commentId) => commentService.unpinComment(commentId),
    onSuccess: () => {
      toast.success("Comment unpinned");
    },
    onError: () => {
      toast.error("Failed to unpin comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pollId] });
    },
  });

  const reportMutation = useMutation({
    mutationFn: ({ commentId, reason }) =>
      commentService.reportComment(commentId, reason),
    onSuccess: () => {
      toast.success("Comment reported. Our team will review it.");
    },
    onError: () => {
      toast.error("Failed to report comment");
    },
  });

  const addComment = (content) => addCommentMutation.mutateAsync(content);
  const editComment = ({ commentId, content }) =>
    editCommentMutation.mutateAsync({ commentId, content });
  const deleteComment = (commentId) => deleteCommentMutation.mutateAsync(commentId);
  const replyTo = ({ commentId, content }) =>
    replyMutation.mutateAsync({ commentId, content });
  const like = (commentId) => likeMutation.mutateAsync(commentId);
  const unlike = (commentId) => unlikeMutation.mutateAsync(commentId);
  const pin = (commentId) => pinMutation.mutateAsync(commentId);
  const unpin = (commentId) => unpinMutation.mutateAsync(commentId);
  const report = ({ commentId, reason }) =>
    reportMutation.mutateAsync({ commentId, reason });

  return {
    comments,
    pagination,
    isLoading,
    error,
    refetch,
    addComment,
    editComment,
    deleteComment,
    replyTo,
    like,
    unlike,
    pin,
    unpin,
    report,
    isAdding: addCommentMutation.isPending,
    isEditing: editCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending,
    isReplying: replyMutation.isPending,
    isLiking: likeMutation.isPending || unlikeMutation.isPending,
    isPinning: pinMutation.isPending || unpinMutation.isPending,
    isReporting: reportMutation.isPending,
  };
};
