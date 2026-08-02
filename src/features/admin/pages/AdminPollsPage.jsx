import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  Star,
  XCircle,
  Eye,
  FileText,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Table } from "../../../components/ui/Table";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Pagination } from "../../../components/ui/Pagination";
import { toast } from "sonner";

const unwrap = (response) => response.data?.data || response.data;

export default function AdminPollsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "polls", search, statusFilter, page],
    queryFn: async () => {
      const params = { page, limit: 20, sort: "newest" };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const response = await apiClient.get("/admin/polls", { params });
      return unwrap(response);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.delete(`/admin/polls/${id}`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "polls"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Poll deleted");
    },
    onError: () => toast.error("Failed to delete poll"),
  });

  const restoreMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.patch(`/admin/polls/${id}/restore`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "polls"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Poll restored");
    },
    onError: () => toast.error("Failed to restore poll"),
  });

  const featureMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.patch(`/admin/polls/${id}/feature`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "polls"] });
      toast.success("Poll featured");
    },
    onError: () => toast.error("Failed to feature poll"),
  });

  const closeMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.patch(`/admin/polls/${id}/close`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "polls"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Poll closed");
    },
    onError: () => toast.error("Failed to close poll"),
  });

  const polls = data?.polls || [];
  const pagination = data?.pagination || {};
  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 20));

  const getStatusVariant = (status) => {
    switch (status) {
      case "active": return "success";
      case "expired": return "secondary";
      case "draft": return "warning";
      case "deleted": return "danger";
      default: return "secondary";
    }
  };

  const columns = [
    {
      key: "title",
      label: "Poll",
      render: (title, poll) => (
        <div className="min-w-0 max-w-[300px]">
          <p className="text-sm font-medium text-white truncate">{poll.title || title}</p>
          <p className="text-xs text-surface-500 truncate">{poll.category || "General"}</p>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      render: (_, poll) => (
        <span className="text-sm text-surface-300">
          {poll.createdBy?.name || poll.createdBy?.username || "Unknown"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => <Badge variant={getStatusVariant(status)} size="sm">{status}</Badge>,
    },
    {
      key: "votes",
      label: "Votes",
      render: (_, poll) => <span className="text-sm text-surface-300">{poll.totalVotes?.toLocaleString() || 0}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, poll) => (
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
              label: "View Poll",
              icon: Eye,
              onClick: () => navigate(`/polls/${poll._id}`),
            },
            ...(poll.status !== "deleted"
              ? [
                  { label: "Close Poll", icon: XCircle, onClick: () => closeMutation.mutate(poll._id) },
                  { label: "Feature Poll", icon: Star, onClick: () => featureMutation.mutate(poll._id) },
                  { label: "Delete Poll", icon: Trash2, onClick: () => deleteMutation.mutate(poll._id), danger: true },
                ]
              : [
                  { label: "Restore Poll", icon: RotateCcw, onClick: () => restoreMutation.mutate(poll._id) },
                ]),
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Polls</h1>
          <p className="text-surface-400 mt-1">Manage platform polls</p>
        </div>
      </div>

      <Card dark className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search polls..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search size={16} />}
              dark
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              dark
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
              <option value="deleted">Deleted</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card dark className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton dark className="w-10 h-10 rounded-lg flex-shrink-0" />
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
        ) : polls.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No polls found"
            description="Try adjusting your search or filters."
            dark
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={polls}
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
