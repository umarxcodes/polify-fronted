import { getReports, createReport, getReportById, reviewReport, resolveReport, rejectReport } from "../api/reportsApi";

export const reportService = {
  getReports,
  createReport,
  getReportById,
  reviewReport,
  resolveReport,
  rejectReport,
};
