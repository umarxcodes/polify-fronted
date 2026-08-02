import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "../services/reportService";

export function useMyReports(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: ["reports", "my", page, limit, filters],
    queryFn: async () => {
      const params = { page, limit, ...filters };
      const data = await reportService.getMyReports(params);
      return data?.data?.reports || data?.reports || [];
    },
    staleTime: 30_000,
  });
}

export function useReportById(id) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: async () => {
      const data = await reportService.getReportById(id);
      return data?.data?.report || data?.report || data;
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useAdminReports(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: ["admin", "reports", page, limit, filters],
    queryFn: async () => {
      const params = { page, limit, ...filters };
      const data = await reportService.getAdminReports(params);
      return data?.data || data;
    },
    staleTime: 30_000,
  });
}

export function useAdminReport(id) {
  return useQuery({
    queryKey: ["admin", "reports", id],
    queryFn: async () => {
      const data = await reportService.getAdminReport(id);
      return data?.data?.report || data?.report || data;
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const data = await reportService.createReport(payload);
      return data?.data?.report || data?.report || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}

export function useReviewReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, adminNotes }) => {
      const data = await reportService.reviewReport(id, adminNotes);
      return data?.data?.report || data?.report || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action, adminNotes }) => {
      const data = await reportService.resolveReport(id, action, adminNotes);
      return data?.data?.report || data?.report || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useRejectReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, adminNotes }) => {
      const data = await reportService.rejectReport(id, adminNotes);
      return data?.data?.report || data?.report || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useAssignReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, moderatorId }) => {
      const data = await reportService.assignReport(id, moderatorId);
      return data?.data?.report || data?.report || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}

export function useEscalateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const data = await reportService.escalateReport(id);
      return data?.data?.report || data?.report || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
    },
  });
}

export function useBulkUpdateReports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportIds, updates }) => {
      const data = await reportService.bulkUpdateReports(reportIds, updates);
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useReportAnalytics() {
  return useQuery({
    queryKey: ["reports", "analytics"],
    queryFn: async () => {
      const data = await reportService.getReportAnalytics();
      return data?.data || data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useModerationStats() {
  return useQuery({
    queryKey: ["admin", "reports", "moderation-stats"],
    queryFn: async () => {
      const data = await reportService.getModerationStats();
      return data?.data || data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
