import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Send,
  Bell,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Table } from "../../../components/ui/Table";
import { Dialog } from "../../../components/ui/Dialog";
import { Textarea } from "../../../components/ui/Textarea";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Pagination } from "../../../components/ui/Pagination";
import { toast } from "sonner";

const unwrap = (response) => response.data?.data || response.data;

const notificationTypes = [
  "WELCOME",
  "EMAIL_VERIFIED",
  "PASSWORD_CHANGED",
  "PASSWORD_RESET",
  "POLL_CREATED",
  "POLL_UPDATED",
  "POLL_DELETED",
  "POLL_EXPIRING",
  "POLL_CLOSED",
  "NEW_VOTE",
  "NEW_COMMENT",
  "COMMENT_REPLY",
  "COMMENT_LIKED",
  "COMMENT_PINNED",
  "BOOKMARK",
  "REPORT_UPDATED",
  "SYSTEM",
];

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [form, setForm] = useState({ recipientId: "", title: "", message: "", type: "SYSTEM", entityType: "system", entityId: "" });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "notifications", search, typeFilter, page],
    queryFn: async () => {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      const response = await apiClient.get("/admin/notifications", { params });
      return unwrap(response);
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => unwrap(apiClient.post("/admin/notifications", payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      toast.success("Notification sent");
      setCreateOpen(false);
      setForm({ recipientId: "", title: "", message: "", type: "SYSTEM", entityType: "system", entityId: "" });
    },
    onError: () => toast.error("Failed to send notification"),
  });

  const broadcastMutation = useMutation({
    mutationFn: (payload) => unwrap(apiClient.post("/admin/notifications/broadcast", payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      toast.success("Broadcast sent to all users");
      setBroadcastOpen(false);
      setForm({ recipientId: "", title: "", message: "", type: "SYSTEM", entityType: "system", entityId: "" });
    },
    onError: () => toast.error("Failed to broadcast notification"),
  });

  const notifications = data?.notifications || [];
  const pagination = data?.pagination || {};
  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 20));

  const columns = [
    {
      key: "recipient",
      label: "Recipient",
      render: (_, notification) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={notification.recipientId?.profileImage}
            fallback={notification.recipientId?.name?.split(" ").map(n => n[0]).join("") || "U"}
            size="sm"
            color="brand"
          />
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[150px]">{notification.recipientId?.name || "All Users"}</p>
            <p className="text-xs text-surface-500 truncate max-w-[150px]">@{notification.recipientId?.username || "broadcast"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (title) => <span className="text-sm text-white truncate max-w-[200px] block">{title}</span>,
    },
    {
      key: "type",
      label: "Type",
      render: (type) => <Badge variant="secondary" size="sm">{type}</Badge>,
    },
    {
      key: "read",
      label: "Status",
      render: (read) => <Badge variant={read ? "success" : "warning"} size="sm" dot>{read ? "Read" : "Unread"}</Badge>,
    },
    {
      key: "createdAt",
      label: "Sent At",
      render: (value) => <span className="text-sm text-surface-400">{new Date(value).toLocaleDateString()}</span>,
    },
  ];

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    broadcastMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-surface-400 mt-1">Send and manage platform notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setCreateOpen(true)} icon={<Send size={16} />}>
            Send Notification
          </Button>
          <Button variant="primary" onClick={() => setBroadcastOpen(true)} icon={<Bell size={16} />}>
            Broadcast
          </Button>
        </div>
      </div>

      <Card dark className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search size={16} />}
              dark
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} dark>
              <option value="">All Types</option>
              {notificationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
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
        ) : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications found" description="Notifications will appear here." dark />
        ) : (
          <>
            <Table
              columns={columns}
              data={notifications}
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

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="Send Notification" dark>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Recipient ID</label>
            <Input
              value={form.recipientId}
              onChange={(e) => setForm({ ...form, recipientId: e.target.value })}
              placeholder="User ID"
              dark
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Notification title"
              dark
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Message</label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Notification message"
              rows={3}
              dark
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Type</label>
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} dark>
              {notificationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Send</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={broadcastOpen} onClose={() => setBroadcastOpen(false)} title="Broadcast Notification" dark>
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Broadcast title"
              dark
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Message</label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Broadcast message"
              rows={3}
              dark
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Type</label>
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} dark>
              {notificationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setBroadcastOpen(false)}>Cancel</Button>
            <Button type="submit" loading={broadcastMutation.isPending} variant="danger">Broadcast</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
