import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { votingService } from "../services/votingService";
import { toast } from "sonner";

export const useVoting = (pollId) => {
  const queryClient = useQueryClient();

  const {
    data: myVote,
    isLoading: myVoteLoading,
    error: myVoteError,
    refetch: refetchMyVote,
  } = useQuery({
    queryKey: ["votes", "my-vote", pollId],
    queryFn: () => votingService.getMyVote(pollId),
    enabled: !!pollId,
    retry: false,
  });

  const {
    data: results,
    isLoading: resultsLoading,
    refetch: refetchResults,
  } = useQuery({
    queryKey: ["votes", "results", pollId],
    queryFn: () => votingService.getPollResults(pollId),
    enabled: !!pollId,
    staleTime: 30_000,
  });

  const {
    data: stats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["votes", "stats", pollId],
    queryFn: () => votingService.getPollStats(pollId),
    enabled: !!pollId,
    staleTime: 30_000,
  });

  const voteMutation = useMutation({
    mutationFn: ({ optionIds, isAnonymous = false }) =>
      votingService.castVote(pollId, optionIds, isAnonymous),
    onMutate: async ({ optionIds }) => {
      await queryClient.cancelQueries({ queryKey: ["votes", "results", pollId] });
      await queryClient.cancelQueries({ queryKey: ["votes", "my-vote", pollId] });
      await queryClient.cancelQueries({ queryKey: ["poll", pollId] });

      const previousResults = queryClient.getQueryData(["votes", "results", pollId]);
      const previousMyVote = queryClient.getQueryData(["votes", "my-vote", pollId]);
      const previousPoll = queryClient.getQueryData(["poll", pollId]);

      if (previousResults) {
        const updatedResults = { ...previousResults };
        updatedResults.options = updatedResults.options.map((opt) => ({
          ...opt,
          votes: optionIds.includes(opt.optionId) ? opt.votes + 1 : opt.votes,
        }));
        updatedResults.totalVotes = (updatedResults.totalVotes || 0) + 1;
        queryClient.setQueryData(["votes", "results", pollId], updatedResults);
      }

      if (previousPoll) {
        const updatedPoll = { ...previousPoll };
        updatedPoll.totalVotes = (updatedPoll.totalVotes || 0) + 1;
        updatedPoll.options = updatedPoll.options.map((opt) =>
          optionIds.includes(opt._id) ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
        );
        queryClient.setQueryData(["poll", pollId], updatedPoll);
      }

      queryClient.setQueryData(["votes", "my-vote", pollId], {
        vote: { selectedOptions: optionIds },
      });

      return { previousResults, previousMyVote, previousPoll };
    },
    onError: (err, _vars, context) => {
      if (context?.previousResults) {
        queryClient.setQueryData(["votes", "results", pollId], context.previousResults);
      }
      if (context?.previousMyVote) {
        queryClient.setQueryData(["votes", "my-vote", pollId], context.previousMyVote);
      }
      if (context?.previousPoll) {
        queryClient.setQueryData(["poll", pollId], context.previousPoll);
      }
      toast.error(err.response?.data?.message || "Failed to cast vote");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", "results", pollId] });
      queryClient.invalidateQueries({ queryKey: ["votes", "my-vote", pollId] });
      queryClient.invalidateQueries({ queryKey: ["poll", pollId] });
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
  });

  const changeVoteMutation = useMutation({
    mutationFn: ({ optionIds }) => votingService.changeVote(pollId, optionIds),
    onMutate: async ({ optionIds }) => {
      await queryClient.cancelQueries({ queryKey: ["votes", "results", pollId] });
      await queryClient.cancelQueries({ queryKey: ["votes", "my-vote", pollId] });
      await queryClient.cancelQueries({ queryKey: ["poll", pollId] });

      const previousResults = queryClient.getQueryData(["votes", "results", pollId]);
      const previousMyVote = queryClient.getQueryData(["votes", "my-vote", pollId]);
      const previousPoll = queryClient.getQueryData(["poll", pollId]);

      if (previousResults && previousMyVote?.vote?.selectedOptions) {
        const oldOptions = previousMyVote.vote.selectedOptions;
        const updatedResults = { ...previousResults };
        updatedResults.options = updatedResults.options.map((opt) => {
          const wasSelected = oldOptions.includes(opt.optionId);
          const isSelected = optionIds.includes(opt.optionId);
          if (wasSelected && !isSelected) return { ...opt, votes: opt.votes - 1 };
          if (!wasSelected && isSelected) return { ...opt, votes: opt.votes + 1 };
          return opt;
        });
        queryClient.setQueryData(["votes", "results", pollId], updatedResults);
      }

      if (previousPoll && previousMyVote?.vote?.selectedOptions) {
        const oldOptions = previousMyVote.vote.selectedOptions;
        const updatedPoll = { ...previousPoll };
        updatedPoll.options = updatedPoll.options.map((opt) => {
          const wasSelected = oldOptions.includes(opt._id);
          const isSelected = optionIds.includes(opt._id);
          if (wasSelected && !isSelected) return { ...opt, votes: Math.max(0, (opt.votes || 0) - 1) };
          if (!wasSelected && isSelected) return { ...opt, votes: (opt.votes || 0) + 1 };
          return opt;
        });
        queryClient.setQueryData(["poll", pollId], updatedPoll);
      }

      queryClient.setQueryData(["votes", "my-vote", pollId], {
        vote: { selectedOptions: optionIds },
      });

      return { previousResults, previousMyVote, previousPoll };
    },
    onError: (err, _vars, context) => {
      if (context?.previousResults) {
        queryClient.setQueryData(["votes", "results", pollId], context.previousResults);
      }
      if (context?.previousMyVote) {
        queryClient.setQueryData(["votes", "my-vote", pollId], context.previousMyVote);
      }
      if (context?.previousPoll) {
        queryClient.setQueryData(["poll", pollId], context.previousPoll);
      }
      toast.error(err.response?.data?.message || "Failed to change vote");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", "results", pollId] });
      queryClient.invalidateQueries({ queryKey: ["votes", "my-vote", pollId] });
      queryClient.invalidateQueries({ queryKey: ["poll", pollId] });
    },
  });

  const removeVoteMutation = useMutation({
    mutationFn: () => votingService.removeVote(pollId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["votes", "results", pollId] });
      await queryClient.cancelQueries({ queryKey: ["votes", "my-vote", pollId] });
      await queryClient.cancelQueries({ queryKey: ["poll", pollId] });

      const previousResults = queryClient.getQueryData(["votes", "results", pollId]);
      const previousMyVote = queryClient.getQueryData(["votes", "my-vote", pollId]);
      const previousPoll = queryClient.getQueryData(["poll", pollId]);

      if (previousResults && previousMyVote?.vote?.selectedOptions) {
        const oldOptions = previousMyVote.vote.selectedOptions;
        const updatedResults = { ...previousResults };
        updatedResults.options = updatedResults.options.map((opt) => {
          if (oldOptions.includes(opt.optionId)) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });
        updatedResults.totalVotes = Math.max(0, (updatedResults.totalVotes || 0) - 1);
        queryClient.setQueryData(["votes", "results", pollId], updatedResults);
      }

      if (previousPoll && previousMyVote?.vote?.selectedOptions) {
        const oldOptions = previousMyVote.vote.selectedOptions;
        const updatedPoll = { ...previousPoll };
        updatedPoll.totalVotes = Math.max(0, (updatedPoll.totalVotes || 0) - 1);
        updatedPoll.options = updatedPoll.options.map((opt) =>
          oldOptions.includes(opt._id) ? { ...opt, votes: Math.max(0, (opt.votes || 0) - 1) } : opt
        );
        queryClient.setQueryData(["poll", pollId], updatedPoll);
      }

      queryClient.setQueryData(["votes", "my-vote", pollId], null);

      return { previousResults, previousMyVote, previousPoll };
    },
    onError: (err, _vars, context) => {
      if (context?.previousResults) {
        queryClient.setQueryData(["votes", "results", pollId], context.previousResults);
      }
      if (context?.previousMyVote) {
        queryClient.setQueryData(["votes", "my-vote", pollId], context.previousMyVote);
      }
      if (context?.previousPoll) {
        queryClient.setQueryData(["poll", pollId], context.previousPoll);
      }
      toast.error(err.response?.data?.message || "Failed to remove vote");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", "results", pollId] });
      queryClient.invalidateQueries({ queryKey: ["votes", "my-vote", pollId] });
      queryClient.invalidateQueries({ queryKey: ["poll", pollId] });
    },
  });

  const castVote = (optionIds, isAnonymous = false) => {
    return voteMutation.mutateAsync({ optionIds, isAnonymous });
  };

  const changeVote = (optionIds) => {
    return changeVoteMutation.mutateAsync({ optionIds });
  };

  const removeVote = () => {
    return removeVoteMutation.mutateAsync();
  };

  return {
    myVote: myVote?.vote || null,
    results: results || null,
    stats: stats || null,
    myVoteLoading,
    myVoteError,
    resultsLoading,
    castVote,
    changeVote,
    removeVote,
    refetchMyVote,
    refetchResults,
    refetchStats,
    isVoting: voteMutation.isPending || changeVoteMutation.isPending || removeVoteMutation.isPending,
  };
};
