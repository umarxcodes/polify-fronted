import { apiClient } from "../../../lib/axios";

export const getAdminStats = async () => {
  const { data } = await apiClient.get("/admin/dashboard");
  return data;
};

export const getUsers = async (params = {}) => {
  const { data } = await apiClient.get("/admin/users", { params });
  return data;
};

export const getUser = async (id) => {
  const { data } = await apiClient.get(`/admin/users/${id}`);
  return data;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await apiClient.patch(`/admin/users/${userId}/role`, { role });
  return data;
};

export const suspendUser = async (id) => {
  const { data } = await apiClient.patch(`/admin/users/${id}/suspend`);
  return data;
};

export const unsuspendUser = async (id) => {
  const { data } = await apiClient.patch(`/admin/users/${id}/unsuspend`);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/admin/users/${id}`);
  return data;
};

export const getPolls = async (params = {}) => {
  const { data } = await apiClient.get("/admin/polls", { params });
  return data;
};

export const deletePoll = async (pollId) => {
  const { data } = await apiClient.delete(`/admin/polls/${pollId}`);
  return data;
};

export const restorePoll = async (pollId) => {
  const { data } = await apiClient.patch(`/admin/polls/${pollId}/restore`);
  return data;
};

export const featurePoll = async (pollId) => {
  const { data } = await apiClient.patch(`/admin/polls/${pollId}/feature`);
  return data;
};

export const closePoll = async (pollId) => {
  const { data } = await apiClient.patch(`/admin/polls/${pollId}/close`);
  return data;
};

export const getComments = async (params = {}) => {
  const { data } = await apiClient.get("/admin/comments", { params });
  return data;
};

export const deleteComment = async (id) => {
  const { data } = await apiClient.delete(`/admin/comments/${id}`);
  return data;
};

export const restoreComment = async (id) => {
  const { data } = await apiClient.patch(`/admin/comments/${id}/restore`);
  return data;
};

export const getReports = async (params = {}) => {
  const { data } = await apiClient.get("/admin/reports", { params });
  return data;
};

export const getReport = async (id) => {
  const { data } = await apiClient.get(`/admin/reports/${id}`);
  return data;
};

export const reviewReport = async (id, adminNotes = "") => {
  const { data } = await apiClient.patch(`/admin/reports/${id}/review`, { adminNotes });
  return data;
};

export const resolveReport = async (id, adminNotes = "") => {
  const { data } = await apiClient.patch(`/admin/reports/${id}/resolve`, { adminNotes });
  return data;
};

export const rejectReport = async (id, adminNotes = "") => {
  const { data } = await apiClient.patch(`/admin/reports/${id}/reject`, { adminNotes });
  return data;
};

export const getNotifications = async (params = {}) => {
  const { data } = await apiClient.get("/admin/notifications", { params });
  return data;
};

export const createNotification = async (payload) => {
  const { data } = await apiClient.post("/admin/notifications", payload);
  return data;
};

export const broadcastNotification = async (payload) => {
  const { data } = await apiClient.post("/admin/notifications/broadcast", payload);
  return data;
};

export const getCategories = async () => {
  const { data } = await apiClient.get("/admin/categories");
  return data;
};

export const createCategory = async (payload) => {
  const { data } = await apiClient.post("/admin/categories", payload);
  return data;
};

export const updateCategory = async (id, payload) => {
  const { data } = await apiClient.patch(`/admin/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await apiClient.delete(`/admin/categories/${id}`);
  return data;
};

export const restoreCategory = async (id) => {
  const { data } = await apiClient.patch(`/admin/categories/${id}/restore`);
  return data;
};

export const getAuditLogs = async (params = {}) => {
  const { data } = await apiClient.get("/admin/audit-logs", { params });
  return data;
};

export const exportAuditLogs = async (params = {}) => {
  const { data } = await apiClient.get("/admin/audit-logs/export", { params });
  return data;
};

export const getAnalytics = async () => {
  const { data } = await apiClient.get("/admin/analytics");
  return data;
};

export const getSystemHealth = async () => {
  const { data } = await apiClient.get("/admin/health");
  return data;
};

export const updateSettings = async (payload) => {
  const { data } = await apiClient.patch("/admin/settings", payload);
  return data;
};
