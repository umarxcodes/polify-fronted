import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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

const formatDate = (value) => {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString();
};

const unwrap = (response) => response.data?.data || response.data;

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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

  const columns = [
    {
      key: "user",
      label: "User",
      render: (_, user) => (
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
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (role) => <Badge variant={getRoleVariant(role)} size="sm">{role}</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (_, user) => {
        if (user.isSuspended) return <Badge variant="danger" size="sm" dot>Suspended</Badge>;
        if (user.isVerified) return <Badge variant="success" size="sm" dot>Verified</Badge>;
        return <Badge variant="warning" size="sm" dot>Unverified</Badge>;
      },
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (value) => <span className="text-sm text-surface-400">{formatDate(value)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, user) => (
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
              label: "View Profile",
              icon: Eye,
              onClick: () => navigate(`/profile/${user.username}`),
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
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Users</h1>
          <p className="text-surface-400 mt-1">Manage platform users</p>
        </div>
      </div>

      <Card dark className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search size={16} />}
              dark
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              dark
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="super_admin">Super Admin</option>
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
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Try adjusting your search or filters."
            dark
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={users}
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
