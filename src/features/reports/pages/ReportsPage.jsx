import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Flag, MoreHorizontal, Eye } from "lucide-react";
import { reportService } from "../services/reportService";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Table } from "../../../components/ui/Table";
import { Dialog } from "../../../components/ui/Dialog";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Pagination } from "../../../components/ui/Pagination";

const unwrap = (response) => response.data?.data || response.data;

const statusConfig = {
  pending: { label: "Pending", variant: "warning" },
  under_review: { label: "Under Review", variant: "info" },
  resolved: { label: "Resolved", variant: "success" },
  rejected: { label: "Rejected", variant: "secondary" },
};

const reasonLabels = {
  spam: "Spam",
  harassment: "Harassment",
  hate_speech: "Hate Speech",
  misinformation: "Misinformation",
  inappropriate_content: "Inappropriate Content",
  copyright: "Copyright Violation",
  fake_account: "Fake Account",
  scam: "Scam or Fraud",
  other: "Other",
};

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["reports", "my", search, statusFilter, page],
    queryFn: async () => {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const response = await reportService.getMyReports(params);
      return unwrap(response);
    },
  });

  const reports = data?.reports || [];
  const pagination = data?.pagination || {};
  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 20));

  const getStatusVariant = (status) => {
    return statusConfig[status]?.variant || "secondary";
  };

  const columns = [
    {
      key: "targetType",
      label: "Type",
      render: (type) => <span className="text-sm text-surface-300 capitalize">{type}</span>,
    },
    {
      key: "reason",
      label: "Reason",
      render: (reason) => <span className="text-sm text-surface-300">{reasonLabels[reason] || reason}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (status) => <Badge variant={getStatusVariant(status)} size="sm">{statusConfig[status]?.label || status}</Badge>,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) => <span className="text-sm text-surface-400">{new Date(value).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, report) => (
        <Dropdown
          align="right"
          width={150}
          dark
          trigger={
            <button className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          }
          items={[
            {
              label: "View Details",
              icon: Eye,
              onClick: () => { setSelectedReport(report); setDetailOpen(true); },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">My Reports</h1>
        <p className="text-surface-400 mt-1">Track the status of your reported content.</p>
      </div>

      <Card dark className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search your reports..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Flag size={16} />}
              dark
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} dark>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card dark className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton dark className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton dark className="h-4 w-48" />
                  <Skeleton dark className="h-3 w-32" />
                </div>
                <Skeleton dark className="h-8 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState error={error.message} onRetry={refetch} dark />
        ) : reports.length === 0 ? (
          <EmptyState icon={Flag} title="No reports found" description="You haven't submitted any reports yet." dark />
        ) : (
          <>
            <Table
              columns={columns}
              data={reports}
              dark
              empty={null}
            />
            <div className="p-4 border-t border-surface-800">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                dark
              />
            </div>
          </>
        )}
      </Card>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} title="Report Details" dark>
        {selectedReport && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-400">Status</span>
              <Badge variant={getStatusVariant(selectedReport.status)} size="sm">
                {statusConfig[selectedReport.status]?.label || selectedReport.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-surface-400 mb-1">Reason</p>
              <p className="text-sm text-white">{reasonLabels[selectedReport.reason] || selectedReport.reason}</p>
            </div>
            {selectedReport.description && (
              <div>
                <p className="text-xs text-surface-400 mb-1">Description</p>
                <p className="text-sm text-white">{selectedReport.description}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-surface-400 mb-1">Target Type</p>
              <p className="text-sm text-white capitalize">{selectedReport.targetType}</p>
            </div>
            <div>
              <p className="text-xs text-surface-400 mb-1">Submitted</p>
              <p className="text-sm text-white">{new Date(selectedReport.createdAt).toLocaleString()}</p>
            </div>
            {selectedReport.adminNotes && (
              <div>
                <p className="text-xs text-surface-400 mb-1">Admin Notes</p>
                <p className="text-sm text-white">{selectedReport.adminNotes}</p>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </motion.div>
  );
}
