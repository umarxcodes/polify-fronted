import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Input } from "../../../components/ui/Input";
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
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="w-full h-10 px-3 rounded-xl bg-surface-800 border border-surface-700 text-sm text-surface-100 outline-none focus:border-brand-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most_liked">Most Liked</option>
            </select>
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
          <div className="p-12 text-center">
            <p className="text-sm text-surface-400 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="secondary">Try again</Button>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-3">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-semibold text-surface-200 mb-1">No comments found</h3>
            <p className="text-sm text-surface-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Author</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Comment</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Poll</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                  {comments.map((comment, index) => (
                    <motion.tr
                      key={comment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-surface-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-surface-300 line-clamp-2 max-w-[300px]">{comment.content}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-surface-400 truncate max-w-[200px]">{comment.pollId?.title || "Unknown Poll"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={comment.isDeleted ? "danger" : "success"} size="sm">
                          {comment.isDeleted ? "Deleted" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Dropdown
                          align="right"
                          width={160}
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
