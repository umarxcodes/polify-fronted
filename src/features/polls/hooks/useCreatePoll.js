import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pollService } from "../services/pollService";
import { toast } from "sonner";

export function useCreatePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pollService.createPoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      toast.success("Poll created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create poll");
    },
  });
}