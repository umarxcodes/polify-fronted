import { apiClient } from "../../../lib/axios";

export const getReports = async () => {
  const { data } = await apiClient.get("/reports");
  return data;
};

export const createReport = async (payload) => {
  const { data } = await apiClient.post("/reports", payload);
  return data;
};

export const updateReportStatus = async (id, status) => {
  const { data } = await apiClient.put(`/reports/${id}/status`, { status });
  return data;
};
