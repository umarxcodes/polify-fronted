import { apiClient } from "../../../lib/axios";

export const getReports = async () => {
  const { data } = await apiClient.get("/reports/my");
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

export const reviewReport = async (id, status) => {
  const { data } = await apiClient.patch(`/reports/${id}/review`, { status });
  return data;
};

export const resolveReport = async (id) => {
  const { data } = await apiClient.patch(`/reports/${id}/resolve`);
  return data;
};

export const rejectReport = async (id) => {
  const { data } = await apiClient.patch(`/reports/${id}/reject`);
  return data;
};
