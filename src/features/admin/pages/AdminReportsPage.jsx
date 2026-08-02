import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Flag,
  MessageSquare,
  FileText,
  User,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Table } from "../../../components/ui/Table";
import { Dialog } from "../../../components/ui/Dialog";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Pagination } from "../../../components/ui/Pagination";
import { Textarea } from "../../../components/ui/Textarea";
import { Dropdown } from "../../../components/ui/Dropdown";
import { toast } from "sonner";

const unwrap = (response) => response.data?.data || response.data;

const statusConfig = {
  pending: { label: "Pending", variant: "warning", icon: Clock },
  reviewed: { label: "Reviewed", variant: "info", icon: Eye },
  resolved: { label: "Resolved", variant: "success", icon: CheckCircle2 },
  dismissed: { label: "Dismissed", variant: "secondary", icon: XCircle },
};

const reasonLabels = {
  spam: "Spam",
  harassment: "Harassment",
  inappropriate: "Inappropriate Content",
  misinformation: "Misinformation",
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
  const [actionType, setActionType] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

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
      setAdminNotes("");
    },
    onError: () => toast.error("Failed to review report"),
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, notes }) => unwrap(apiClient.patch(`/admin/reports/${id}/resolve`, { adminNotes: notes })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Report resolved");
      setActionOpen(false);
      setAdminNotes("");
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
      setAdminNotes("");
    },
    onError: () => toast.error("Failed to dismiss report"),
  });

  const reports = data?.reports || [];
  const pagination = data?.pagination || {};
  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 20));

  const handleAction = (report, type) => {
    setSelectedReport(report);
    setActionType(type);
    setActionOpen(true);
  };

  const handleSubmitAction = () => {
    if (!selectedReport) return;
    if (actionType === "review") reviewMutation.mutate({ id: selectedReport._id, notes: adminNotes });
    else if (actionType === "resolve") resolveMutation.mutate({ id: selectedReport._id, notes: adminNotes });
    else if (actionType === "reject") rejectMutation.mutate({ id: selectedReport._id, notes: adminNotes });
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
      key: "reporter",
      label: "Reporter",
      render: (_, report) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={report.reporterId?.profileImage}
            fallback={report.reporterId?.name?.split(" ").map(n => n[0]).join("") || "U"}
            size="sm"
            color="brand"
          />
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[150px]">{report.reporterId?.name || "Unknown"}</p>
            <p className="text-xs text-surface-500 truncate max-w-[150px]">@{report.reporterId?.username || "unknown"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "targetType",
      label: "Target",
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
                  { label: "Review", icon: Eye, onClick: () => handleAction(report, "review") },
                  { label: "Resolve", icon: CheckCircle2, onClick: () => handleAction(report, "resolve"), danger: false },
                  { label: "Dismiss", icon: XCircle, onClick: () => handleAction(report, "reject"), danger: true },
                ]
              : []),
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
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
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
            <div className="flex items-center gap-3">
              <Avatar
                src={selectedReport.reporterId?.profileImage}
                fallback={selectedReport.reporterId?.name?.split(" ").map(n => n[0]).join("") || "U"}
                size="sm"
                color="brand"
              />
              <div>
                <p className="text-sm font-medium text-white">{selectedReport.reporterId?.name || "Unknown"}</p>
                <p className="text-xs text-surface-400">@{selectedReport.reporterId?.username || "unknown"}</p>
              </div>
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
              <p className="text-xs text-surface-400 mb-1">Status</p>
              <Badge variant={statusConfig[selectedReport.status]?.variant || "secondary"} size="sm">
                {statusConfig[selectedReport.status]?.label || selectedReport.status}
              </Badge>
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

      <Dialog open={actionOpen} onClose={() => setActionOpen(false)} title={
        actionType === "review" ? "Review Report" : actionType === "resolve" ? "Resolve Report" : "Dismiss Report"
      } dark>
        <div className="space-y-4">
          <p className="text-sm text-surface-300">
            {actionType === "review" ? "Mark this report as reviewed." : actionType === "resolve" ? "Resolve this report with action taken." : "Dismiss this report as invalid."}
          </p>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Admin Notes</label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes..."
              rows={3}
              dark
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setActionOpen(false)}>Cancel</Button>
            <Button
              variant={actionType === "reject" ? "danger" : "primary"}
              loading={reviewMutation.isPending || resolveMutation.isPending || rejectMutation.isPending}
              onClick={handleSubmitAction}
            >
              {actionType === "review" ? "Review" : actionType === "resolve" ? "Resolve" : "Dismiss"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
