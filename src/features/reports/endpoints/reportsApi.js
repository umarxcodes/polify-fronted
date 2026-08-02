import { apiClient } from "../../../lib/axios";

export const getMyReports = async (params = {}) => {
  const { data } = await apiClient.get("/reports/my", { params });
  return data;
};

export const createReport = async (payload) => {
  const { data } = await apiClient.post("/reports", payload);
  return data;
};

export const getReportById = async (id) => {
  const { data } = await apiClient.get(`/reports/${id}`);
  return data;
};

export const getAdminReports = async (params = {}) => {
  const { data } = await apiClient.get("/admin/reports", { params });
  return data;
};

export const getAdminReport = async (id) => {
  const { data } = await apiClient.get(`/admin/reports/${id}`);
  return data;
};

export const reviewReport = async (id, adminNotes = "") => {
  const { data } = await apiClient.patch(`/admin/reports/${id}/review`, { adminNotes });
  return data;
};

export const resolveReport = async (id, action, adminNotes = "") => {
  const { data } = await apiClient.patch(`/admin/reports/${id}/resolve`, { action, adminNotes });
  return data;
};

export const rejectReport = async (id, adminNotes = "") => {
  const { data } = await apiClient.patch(`/admin/reports/${id}/reject`, { adminNotes });
  return data;
};

export const assignReport = async (id, moderatorId) => {
  const { data } = await apiClient.patch(`/admin/reports/${id}/assign`, { moderatorId });
  return data;
};

export const escalateReport = async (id) => {
  const { data } = await apiClient.patch(`/admin/reports/${id}/escalate`);
  return data;
};

export const bulkUpdateReports = async (reportIds, updates) => {
  const { data } = await apiClient.patch("/admin/reports/bulk", { reportIds, updates });
  return data;
};

export const getReportAnalytics = async () => {
  const { data } = await apiClient.get("/reports/analytics");
  return data;
};

export const getModerationStats = async () => {
  const { data } = await apiClient.get("/admin/reports/moderation-stats");
  return data;
};
