import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pollService } from "../services/pollService";
import { toast } from "sonner";

export function useUpdatePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => pollService.updatePoll(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      queryClient.invalidateQueries({ queryKey: ["poll", variables.id] });
      toast.success("Poll updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update poll");
    },
  });
}