import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { pollService } from "../services/pollService";

export function usePollDetail() {
  const { id } = useParams();

  return useQuery({
    queryKey: ["poll", id],
    queryFn: () => pollService.getPollById(id),
    enabled: Boolean(id),
  });
}