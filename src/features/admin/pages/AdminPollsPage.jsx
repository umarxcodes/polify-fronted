import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Input } from "../../../components/ui/Input";
import { toast } from "sonner";

const unwrap = (response) => response.data?.data || response.data;

export default function AdminPollsPage() {
  const queryClient = useQueryClient();
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
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full h-10 px-3 rounded-xl bg-surface-800 border border-surface-700 text-sm text-surface-100 outline-none focus:border-brand-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
              <option value="deleted">Deleted</option>
            </select>
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
          <div className="p-12 text-center">
            <p className="text-sm text-surface-400 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="secondary">Try again</Button>
          </div>
        ) : polls.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-3">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-semibold text-surface-200 mb-1">No polls found</h3>
            <p className="text-sm text-surface-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Poll</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Author</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Votes</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                  {polls.map((poll, index) => (
                    <motion.tr
                      key={poll._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-surface-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="min-w-0 max-w-[300px]">
                          <p className="text-sm font-medium text-white truncate">{poll.title}</p>
                          <p className="text-xs text-surface-500 truncate">{poll.category || "General"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-300">
                        {poll.createdBy?.name || poll.createdBy?.username || "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusVariant(poll.status)} size="sm">
                          {poll.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-300">
                        {poll.totalVotes?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Dropdown
                          align="right"
                          width={180}
                          trigger={
                            <button className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors">
                              <MoreHorizontal size={16} />
                            </button>
                          }
                          items={[
                            {
                              label: "View Poll",
                              icon: Eye,
                              onClick: () => window.open(`/polls/${poll._id}`, "_blank"),
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
