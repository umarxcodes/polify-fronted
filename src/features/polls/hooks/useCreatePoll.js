import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pollService } from "../services/pollService";

export function useCreatePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pollService.createPoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
    },
    onError: () => {
      // Error handling is done in the component via mutation callbacks
    },
  });
}