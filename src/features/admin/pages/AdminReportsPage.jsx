import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Flag,
  MessageSquare,
  FileText,
  User,
  ArrowUpRight,
  CheckSquare,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Table } from "../../../components/ui/Table";
import { Dialog } from "../../../components/ui/Dialog";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Pagination } from "../../../components/ui/Pagination";
import { Dropdown } from "../../../components/ui/Dropdown";
import { toast } from "sonner";
import ModerationActions from "../components/ModerationActions";
import AssignmentModal from "../components/AssignmentModal";
import BulkActionsModal from "../components/BulkActionsModal";

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

export default function AdminReportsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "reports", search, statusFilter, targetTypeFilter, page],
    queryFn: async () => {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (targetTypeFilter) params.targetType = targetTypeFilter;
      const response = await apiClient.get("/admin/reports", { params });
      return unwrap(response);
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, notes }) => unwrap(apiClient.patch(`/admin/reports/${id}/review`, { adminNotes: notes })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Report reviewed");
      setActionOpen(false);
    },
    onError: () => toast.error("Failed to review report"),
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, action, notes }) => unwrap(apiClient.patch(`/admin/reports/${id}/resolve`, { action, adminNotes: notes })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Report resolved");
      setActionOpen(false);
    },
    onError: () => toast.error("Failed to resolve report"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }) => unwrap(apiClient.patch(`/admin/reports/${id}/reject`, { adminNotes: notes })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Report dismissed");
      setActionOpen(false);
    },
    onError: () => toast.error("Failed to dismiss report"),
  });

  const escalateMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.patch(`/admin/reports/${id}/escalate`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      toast.success("Report escalated");
    },
    onError: () => toast.error("Failed to escalate report"),
  });

  const bulkMutation = useMutation({
    mutationFn: ({ reportIds, updates }) => unwrap(apiClient.patch("/admin/reports/bulk", { reportIds, updates })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Bulk action completed");
      setBulkOpen(false);
      setSelectedReports([]);
    },
    onError: () => toast.error("Failed to perform bulk action"),
  });

  const reports = data?.reports || [];
  const pagination = data?.pagination || {};
  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 20));

  const handleAction = (report) => {
    setSelectedReport(report);
    setActionOpen(true);
  };

  const handleModerationAction = ({ action, notes }) => {
    if (!selectedReport) return;
    if (selectedReport.status === "pending") {
      if (action === "no_action") {
        resolveMutation.mutate({ id: selectedReport._id, action: "no_action", notes });
      } else {
        resolveMutation.mutate({ id: selectedReport._id, action, notes });
      }
    } else {
      reviewMutation.mutate({ id: selectedReport._id, notes });
    }
  };

  const handleBulkAction = ({ reportIds, updates }) => {
    bulkMutation.mutate({ reportIds, updates });
  };

  const toggleSelect = (id) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const getTargetIcon = (type) => {
    switch (type) {
      case "poll": return FileText;
      case "comment": return MessageSquare;
      case "user": return User;
      default: return Flag;
    }
  };

  const columns = [
    {
      key: "select",
      label: "",
      render: (_, report) => (
        <input
          type="checkbox"
          checked={selectedReports.includes(report._id)}
          onChange={() => toggleSelect(report._id)}
          className="w-4 h-4 rounded border-surface-600 bg-surface-700 text-primary-500 focus:ring-primary-500"
        />
      ),
    },
    {
      key: "targetType",
      label: "Type",
      render: (type) => {
        const Icon = getTargetIcon(type);
        return (
          <div className="flex items-center gap-2">
            <Icon size={14} className="text-surface-400" />
            <span className="text-sm text-surface-300 capitalize">{type}</span>
          </div>
        );
      },
    },
    {
      key: "reason",
      label: "Reason",
      render: (reason) => <span className="text-sm text-surface-300">{reasonLabels[reason] || reason}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (status) => {
        const config = statusConfig[status] || statusConfig.pending;
        return <Badge variant={config.variant} size="sm" dot>{config.label}</Badge>;
      },
    },
    {
      key: "reporter",
      label: "Reporter",
      render: (_, report) => (
        <span className="text-sm text-surface-300">
          {report.reporterId?.name || report.reporterId?.username || "Unknown"}
        </span>
      ),
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
          width={180}
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
            ...(report.status === "pending"
              ? [
                  { label: "Review", icon: Eye, onClick: () => handleAction(report) },
                  { label: "Resolve", icon: CheckCircle2, onClick: () => handleAction(report) },
                  { label: "Dismiss", icon: XCircle, onClick: () => handleAction(report), danger: true },
                ]
              : []),
            { label: "Escalate", icon: ArrowUpRight, onClick: () => escalateMutation.mutate(report._id) },
            { label: "Assign", icon: User, onClick: () => { setSelectedReport(report); setAssignOpen(true); } },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reports</h1>
          <p className="text-surface-400 mt-1">Manage and moderate reported content</p>
        </div>
        {selectedReports.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-surface-400">{selectedReports.length} selected</span>
            <Button variant="secondary" size="sm" onClick={() => setBulkOpen(true)} icon={<CheckSquare size={16} />}>
              Bulk Actions
            </Button>
          </div>
        )}
      </div>

      <Card dark className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search size={16} />}
              dark
            />
          </div>
          <div className="w-full md:w-40">
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} dark>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
          <div className="w-full md:w-40">
            <Select value={targetTypeFilter} onChange={(e) => { setTargetTypeFilter(e.target.value); setPage(1); }} dark>
              <option value="">All Types</option>
              <option value="poll">Poll</option>
              <option value="comment">Comment</option>
              <option value="user">User</option>
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
          <EmptyState icon={Flag} title="No reports found" description="All reports will appear here for moderation." dark />
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
              <Badge variant={statusConfig[selectedReport.status]?.variant || "secondary"} size="sm">
                {statusConfig[selectedReport.status]?.label || selectedReport.status}
              </Badge>
              {selectedReport.escalated && <Badge variant="danger" size="sm">Escalated</Badge>}
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
              <p className="text-xs text-surface-400 mb-1">Reporter</p>
              <p className="text-sm text-white">{selectedReport.reporterId?.name || "Unknown"}</p>
            </div>
            {selectedReport.adminNotes && (
              <div>
                <p className="text-xs text-surface-400 mb-1">Admin Notes</p>
                <p className="text-sm text-white">{selectedReport.adminNotes}</p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDetailOpen(false)}>Close</Button>
              {selectedReport.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => handleAction(selectedReport)}>Review</Button>
                  <Button variant="success" size="sm" onClick={() => handleAction(selectedReport)}>Resolve</Button>
                  <Button variant="danger" size="sm" onClick={() => handleAction(selectedReport)}>Dismiss</Button>
                </>
              )}
            </div>
          </div>
        )}
      </Dialog>

      <ModerationActions
        isOpen={actionOpen}
        onClose={() => setActionOpen(false)}
        report={selectedReport}
        onAction={handleModerationAction}
        loading={reviewMutation.isPending || resolveMutation.isPending || rejectMutation.isPending}
      />

      <AssignmentModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        reportId={selectedReport?._id}
        onAssigned={() => queryClient.invalidateQueries({ queryKey: ["admin", "reports"] })}
      />

      <BulkActionsModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        selectedIds={selectedReports}
        onBulkAction={handleBulkAction}
        loading={bulkMutation.isPending}
      />
    </div>
  );
}
