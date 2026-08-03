import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Table } from "../../../components/ui/Table";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Pagination } from "../../../components/ui/Pagination";
import { toast } from "sonner";

const unwrap = (response) => response.data?.data || response.data;

export default function AdminCommentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "comments", search, sort, page],
    queryFn: async () => {
      const params = { page, limit: 20, sort };
      if (search) params.search = search;
      const response = await apiClient.get("/admin/comments", { params });
      return unwrap(response);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.delete(`/admin/comments/${id}`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "comments"] });
      toast.success("Comment deleted");
    },
    onError: () => toast.error("Failed to delete comment"),
  });

  const restoreMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.patch(`/admin/comments/${id}/restore`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "comments"] });
      toast.success("Comment restored");
    },
    onError: () => toast.error("Failed to restore comment"),
  });

  const comments = data?.comments || [];
  const pagination = data?.pagination || {};
  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 20));

  const columns = [
    {
      key: "author",
      label: "Author",
      render: (_, comment) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={comment.userId?.profileImage}
            fallback={comment.userId?.name?.split(" ").map(n => n[0]).join("") || "U"}
            size="sm"
            color="brand"
          />
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[150px]">{comment.userId?.name || "Unknown"}</p>
            <p className="text-xs text-surface-500 truncate max-w-[150px]">@{comment.userId?.username || "unknown"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      label: "Comment",
      render: (content) => (
        <p className="text-sm text-surface-300 line-clamp-2 max-w-[300px]">{content}</p>
      ),
    },
    {
      key: "poll",
      label: "Poll",
      render: (_, comment) => (
        <p className="text-sm text-surface-400 truncate max-w-[200px]">{comment.pollId?.title || "Unknown Poll"}</p>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, comment) => (
        <Badge variant={comment.isDeleted ? "danger" : "success"} size="sm">
          {comment.isDeleted ? "Deleted" : "Active"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, comment) => (
        <Dropdown
          align="right"
          width={160}
          dark
          trigger={
            <button className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          }
          items={
            comment.isDeleted
              ? [
                  { label: "Restore", icon: RotateCcw, onClick: () => restoreMutation.mutate(comment._id) },
                ]
              : [
                  { label: "Delete", icon: Trash2, onClick: () => deleteMutation.mutate(comment._id), danger: true },
                ]
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Comments</h1>
          <p className="text-surface-400 mt-1">Moderate platform comments</p>
        </div>
      </div>

      <Card dark className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search comments..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search size={16} />}
              dark
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              dark
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most_liked">Most Liked</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card dark className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-3">
                <Skeleton dark className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton dark className="h-4 w-48" />
                  <Skeleton dark className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState error={error.message} onRetry={refetch} dark />
        ) : comments.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No comments found"
            description="Try adjusting your search or filters."
            dark
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={comments}
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
