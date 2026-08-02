import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  Flag,
  Vote,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Activity,
  Settings,
  ScrollText,
  BarChart3,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";

const formatNumber = (value) => Number(value || 0).toLocaleString();

function StatCard({ icon: Icon, label, value, change, color = "brand", delay = 0 }) {
  const isPositive = change?.startsWith("+");
  const colorClasses = {
    brand: "from-brand-500/20 to-brand-600/10 text-brand-400",
    success: "from-success-500/20 to-success-600/10 text-success-400",
    danger: "from-danger-500/20 to-danger-600/10 text-danger-400",
    warning: "from-warning-500/20 to-warning-600/10 text-warning-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card hover dark className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
              <Icon size={20} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-400">{label}</p>
              <p className="text-xl font-bold text-white mt-0.5 line-clamp-2">{value}</p>
            </div>
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
                isPositive
                  ? "bg-success-500/15 text-success-400"
                  : "bg-danger-500/15 text-danger-400"
              }`}
            >
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {change}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function RecentActivityItem({ activity, index = 0 }) {
  const iconMap = {
    user: Users,
    poll: FileText,
    report: Flag,
    comment: MessageSquare,
    vote: Vote,
  };
  const Icon = iconMap[activity.type] || Activity;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-800/50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400 flex-shrink-0">
          <Icon size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-surface-200 truncate">{activity.title}</p>
          <p className="text-xs text-surface-500">{activity.timeAgo}</p>
        </div>
      </div>
      <Badge variant={activity.status === "active" ? "success" : activity.status === "pending" ? "warning" : "secondary"} size="sm">
        {activity.status}
      </Badge>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/dashboard");
      return response.data?.data || response.data;
    },
  });

  const stats = data?.stats || {};
  const recentActivity = data?.recentActivity || [];

  if (error) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-surface-400 mt-1">Platform overview and management</p>
        </motion.div>
        <ErrorState
          error={error.message}
          onRetry={refetch}
          title="Failed to load dashboard"
          dark
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-danger-500 via-danger-600 to-violet-600 p-6 md:p-8 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-white/80 mt-1">Platform overview and management</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/analytics">
              <Button variant="outline" size="sm" icon={<BarChart3 size={16} />} className="border-white/30 text-white hover:bg-white/10">
                View Analytics
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline" size="sm" icon={<Settings size={16} />} className="border-white/30 text-white hover:bg-white/10">
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} dark className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton dark className="w-11 h-11 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton dark className="h-3 w-20" />
                    <Skeleton dark className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              icon={Users}
              label="Total Users"
              value={formatNumber(stats.totalUsers)}
              change={`${stats.verifiedUsers || 0} verified`}
              delay={0}
            />
            <StatCard
              icon={FileText}
              label="Total Polls"
              value={formatNumber(stats.totalPolls)}
              change={`${stats.activePolls || 0} active`}
              delay={0.05}
              color="success"
            />
            <StatCard
              icon={Flag}
              label="Pending Reports"
              value={formatNumber(stats.pendingReports)}
              change={stats.pendingReports > 0 ? "Needs attention" : "All clear"}
              color={stats.pendingReports > 0 ? "warning" : "success"}
              delay={0.1}
            />
            <StatCard
              icon={Vote}
              label="Total Votes"
              value={formatNumber(stats.totalVotes)}
              change={`${stats.totalComments || 0} comments`}
              delay={0.15}
              color="brand"
            />
          </>
        )}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="space-y-4">
          <Card dark className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/admin/users">
                <Button variant="secondary" className="w-full justify-start" icon={<Users size={18} />}>
                  Manage Users
                </Button>
              </Link>
              <Link to="/admin/polls">
                <Button variant="secondary" className="w-full justify-start" icon={<FileText size={18} />}>
                  Review Polls
                </Button>
              </Link>
              <Link to="/admin/comments">
                <Button variant="secondary" className="w-full justify-start" icon={<MessageSquare size={18} />}>
                  Moderate Comments
                </Button>
              </Link>
              <Link to="/admin/audit-logs">
                <Button variant="secondary" className="w-full justify-start" icon={<ScrollText size={18} />}>
                  Audit Logs
                </Button>
              </Link>
            </div>
          </Card>

          {/* System health */}
          <Card dark className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">System Health</h3>
            <div className="space-y-3">
              {[
                { label: "API Status", status: "Operational", color: "success" },
                { label: "Database", status: "Connected", color: "success" },
                { label: "Cache", status: "Active", color: "success" },
                { label: "Queue", status: "Processing", color: "warning" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">{item.label}</span>
                  <Badge variant={item.color} size="sm" dot>{item.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <Card dark className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Recent Activity</h3>
                <p className="text-sm text-surface-400 mt-0.5">Latest admin actions</p>
              </div>
              <Link to="/admin/audit-logs">
                <Button variant="ghost" size="sm" icon={<ExternalLink size={14} />}>
                  View all
                </Button>
              </Link>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <Skeleton dark className="w-8 h-8 rounded-lg flex-shrink-0" />
                      <div className="space-y-2">
                        <Skeleton dark className="h-4 w-48" />
                        <Skeleton dark className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton dark className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="divide-y divide-surface-800">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <RecentActivityItem key={activity._id || index} activity={activity} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Activity}
                title="No recent activity"
                description="Admin actions will appear here."
                dark
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
