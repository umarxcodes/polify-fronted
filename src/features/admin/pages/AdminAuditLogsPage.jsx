import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={actionFilter}
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full h-10 px-3 rounded-xl bg-surface-800 border border-surface-700 text-sm text-surface-100 outline-none focus:border-brand-500"
            >
              <option value="">All Types</option>
              <option value="user">Users</option>
              <option value="poll">Polls</option>
              <option value="comment">Comments</option>
              <option value="category">Categories</option>
              <option value="notification">Notifications</option>
              <option value="system">System</option>
            </select>
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
          <div className="p-12 text-center">
            <p className="text-sm text-surface-400 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="secondary">Try again</Button>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-3">
              <ScrollText size={24} />
            </div>
            <h3 className="text-lg font-semibold text-surface-200 mb-1">No audit logs found</h3>
            <p className="text-sm text-surface-400">Admin actions will appear here.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Admin</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                  {logs.map((log, index) => (
                    <motion.tr
                      key={log._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-surface-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" size="sm">
                          {log.targetType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-surface-800">
                <p className="text-sm text-surface-400">
                  Page {pagination.page || 1} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                  <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
