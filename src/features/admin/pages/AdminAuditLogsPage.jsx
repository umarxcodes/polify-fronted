import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Download,
  ScrollText,
  Shield,
  User,
  FileText,
  MessageSquare,
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
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Pagination } from "../../../components/ui/Pagination";
import { toast } from "sonner";

const unwrap = (response) => response.data?.data || response.data;

const actionLabels = {
  update_user_role: "Updated user role",
  suspend_user: "Suspended user",
  unsuspend_user: "Unsuspended user",
  delete_user: "Deleted user",
  delete_poll: "Deleted poll",
  restore_poll: "Restored poll",
  feature_poll: "Featured poll",
  close_poll: "Closed poll",
  delete_comment: "Deleted comment",
  restore_comment: "Restored comment",
  create_category: "Created category",
  update_category: "Updated category",
  delete_category: "Deleted category",
  restore_category: "Restored category",
  create_notification: "Created notification",
  broadcast_notification: "Broadcast notification",
  update_system_settings: "Updated system settings",
};

const actionIcons = {
  user: User,
  poll: FileText,
  comment: MessageSquare,
  category: Shield,
  notification: Shield,
  system: Shield,
};

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "audit-logs", search, actionFilter, page],
    queryFn: async () => {
      const params = { page, limit: 20 };
      if (search) params.action = search;
      if (actionFilter) params.targetType = actionFilter;
      const response = await apiClient.get("/admin/audit-logs", { params });
      return unwrap(response);
    },
  });

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("action", search);
      if (actionFilter) params.set("targetType", actionFilter);

      const response = await apiClient.get(`/admin/audit-logs/export?${params.toString()}`);
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Audit logs exported");
    } catch {
      toast.error("Failed to export audit logs");
    }
  };

  const logs = data?.logs || [];
  const pagination = data?.pagination || {};
  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 20));

  const getTargetTypeIcon = (targetType) => {
    const Icon = actionIcons[targetType] || Shield;
    return <Icon size={14} />;
  };

  const columns = [
    {
      key: "action",
      label: "Action",
      render: (action, log) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400 flex-shrink-0">
            {getTargetTypeIcon(log.targetType)}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{actionLabels[log.action] || log.action}</p>
            {log.details && (
              <p className="text-xs text-surface-500 truncate max-w-[300px]">
                {JSON.stringify(log.details)}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "targetType",
      label: "Type",
      render: (type) => <Badge variant="secondary" size="sm">{type}</Badge>,
    },
    {
      key: "admin",
      label: "Admin",
      render: (_, log) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={log.adminId?.profileImage}
            fallback={log.adminId?.name?.split(" ").map(n => n[0]).join("") || "A"}
            size="sm"
            color="brand"
          />
          <span className="text-sm text-surface-300 truncate max-w-[150px]">
            {log.adminId?.name || log.adminId?.username || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Time",
      render: (value) => <span className="text-sm text-surface-400 whitespace-nowrap">{new Date(value).toLocaleString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Audit Logs</h1>
          <p className="text-surface-400 mt-1">Track all admin actions</p>
        </div>
        <Button onClick={handleExport} variant="secondary" icon={<Download size={16} />}>
          Export CSV
        </Button>
      </div>

      <Card dark className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search actions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search size={16} />}
              dark
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              dark
            >
              <option value="">All Types</option>
              <option value="user">Users</option>
              <option value="poll">Polls</option>
              <option value="comment">Comments</option>
              <option value="category">Categories</option>
              <option value="notification">Notifications</option>
              <option value="system">System</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card dark className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-3">
                <Skeleton dark className="w-8 h-8 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton dark className="h-4 w-48" />
                  <Skeleton dark className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState error={error.message} onRetry={refetch} dark />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={ScrollText}
            title="No audit logs found"
            description="Admin actions will appear here."
            dark
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={logs}
              dark
            />
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-surface-800">
                <Pagination
                  currentPage={pagination.page || 1}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  dark
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
