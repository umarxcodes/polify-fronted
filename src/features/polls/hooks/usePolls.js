import { useQuery } from "@tanstack/react-query";
import { pollService } from "../services/pollService";

export function usePolls(params) {
  return useQuery({
    queryKey: ["polls", params],
    queryFn: () => pollService.getAllPolls(params),
  });
}