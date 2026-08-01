import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Users,
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

const formatDate = (value) => {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString();
};

const unwrap = (response) => response.data?.data || response.data;

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "users", search, roleFilter, page],
    queryFn: async () => {
      const params = { page, limit: 20, sort: "newest" };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const response = await apiClient.get("/admin/users", { params });
      return unwrap(response);
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.patch(`/admin/users/${id}/suspend`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("User suspended");
    },
    onError: () => toast.error("Failed to suspend user"),
  });

  const unsuspendMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.patch(`/admin/users/${id}/unsuspend`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("User unsuspended");
    },
    onError: () => toast.error("Failed to unsuspend user"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.delete(`/admin/users/${id}`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const users = data?.users || [];
  const pagination = data?.pagination || {};
  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 20));

  const getRoleVariant = (role) => {
    switch (role) {
      case "super_admin": return "danger";
      case "admin": return "warning";
      case "moderator": return "info";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-surface-400 mt-1">Manage platform users</p>
        </div>
      </div>

      {/* Filters */}
      <Card dark className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search size={16} />}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="w-full h-10 px-3 rounded-xl bg-surface-800 border border-surface-700 text-sm text-surface-100 outline-none focus:border-brand-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users table */}
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
          <div className="p-12 text-center">
            <p className="text-sm text-surface-400 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="secondary">Try again</Button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-3">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-semibold text-surface-200 mb-1">No users found</h3>
            <p className="text-sm text-surface-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-surface-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.profileImage}
                            fallback={user.name?.split(" ").map(n => n[0]).join("") || "U"}
                            size="sm"
                            color="brand"
                          />
                          <div>
                            <p className="text-sm font-medium text-white truncate max-w-[200px]">{user.name}</p>
                            <p className="text-xs text-surface-500 truncate max-w-[200px]">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getRoleVariant(user.role)} size="sm">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {user.isSuspended ? (
                            <Badge variant="danger" size="sm" dot>Suspended</Badge>
                          ) : user.isVerified ? (
                            <Badge variant="success" size="sm" dot>Verified</Badge>
                          ) : (
                            <Badge variant="warning" size="sm" dot>Unverified</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-surface-400">
                        {formatDate(user.createdAt)}
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
                              label: "View Profile",
                              icon: Eye,
                              onClick: () => window.open(`/profile/${user.username}`, "_blank"),
                            },
                            ...(user.role !== "super_admin"
                              ? [
                                  user.isSuspended
                                    ? { label: "Unsuspend", icon: UserCheck, onClick: () => unsuspendMutation.mutate(user._id) }
                                    : { label: "Suspend", icon: UserX, onClick: () => suspendMutation.mutate(user._id), danger: user.isSuspended ? false : true },
                                  { label: "Delete", icon: Trash2, onClick: () => deleteMutation.mutate(user._id), danger: true },
                                ]
                              : []),
                          ]}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-surface-800">
                <p className="text-sm text-surface-400">
                  Page {pagination.page || 1} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
