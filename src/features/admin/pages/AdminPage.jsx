import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  Flag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Activity,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";

function StatCard({ icon: Icon, label, value, change, color = "brand", delay = 0 }) {
  const isPositive = change?.startsWith("+");
  const colorClasses = {
    brand: "from-brand-500/10 to-brand-600/10 text-brand-600",
    success: "from-success-500/10 to-success-600/10 text-success-600",
    danger: "from-danger-500/10 to-danger-600/10 text-danger-600",
    warning: "from-warning-500/10 to-warning-600/10 text-warning-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center ${colorClasses[color]}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">{label}</p>
              <p className="text-2xl font-bold text-surface-900 mt-0.5">{value}</p>
            </div>
          </div>
          {change && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
              isPositive ? "bg-success-50 text-success-700" : "bg-danger-50 text-danger-700"
            }`}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {change}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function RecentActivity({ activities }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-surface-900">Recent Activity</h3>
        <Button variant="ghost" size="sm">View all</Button>
      </div>
      <div className="space-y-3">
        {activities?.slice(0, 5).map((activity, index) => (
          <motion.div
            key={activity._id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activity.type === "user" ? "bg-brand-50 text-brand-600" :
                activity.type === "poll" ? "bg-cyan-50 text-cyan-600" :
                activity.type === "report" ? "bg-warning-50 text-warning-600" :
                "bg-surface-100 text-surface-600"
              }`}>
                {activity.type === "user" ? <Users size={14} /> :
                 activity.type === "poll" ? <FileText size={14} /> :
                 activity.type === "report" ? <Flag size={14} /> :
                 <Activity size={14} />}
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900">{activity.title}</p>
                <p className="text-xs text-surface-500">{activity.timeAgo}</p>
              </div>
            </div>
            <Badge variant={activity.status === "active" ? "success" : activity.status === "pending" ? "warning" : "secondary"} size="sm">
              {activity.status}
            </Badge>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/dashboard");
      return response.data?.data || response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-500 mx-auto mb-4">
          <Shield size={28} />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-1">Failed to load admin dashboard</h3>
        <p className="text-sm text-surface-500 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  const stats = data?.stats || {};
  const activities = data?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-surface-500 mt-1">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers?.toLocaleString() || "0"} change="+12%" delay={0} />
        <StatCard icon={FileText} label="Active Polls" value={stats.totalPolls?.toLocaleString() || "0"} change="+8%" delay={0.05} />
        <StatCard icon={Flag} label="Reports" value={stats.pendingReports?.toLocaleString() || "0"} change={stats.pendingReports > 0 ? "Needs attention" : "All clear"} color={stats.pendingReports > 0 ? "warning" : "success"} delay={0.1} />
        <StatCard icon={TrendingUp} label="Engagement" value={`${stats.engagementRate || 0}%`} change="+5%" delay={0.15} />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-surface-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/admin/users">
                <Button variant="secondary" className="w-full justify-start">
                  <Users size={18} />
                  Manage Users
                </Button>
              </Link>
              <Link to="/admin/polls">
                <Button variant="secondary" className="w-full justify-start">
                  <FileText size={18} />
                  Review Polls
                </Button>
              </Link>
              <Link to="/admin/reports">
                <Button variant="secondary" className="w-full justify-start">
                  <Flag size={18} />
                  Handle Reports
                </Button>
              </Link>
            </div>
          </Card>

          {/* System health */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-surface-900 mb-4">System Health</h3>
            <div className="space-y-3">
              {[
                { label: "API Status", status: "Operational", color: "success" },
                { label: "Database", status: "Connected", color: "success" },
                { label: "Cache", status: "Active", color: "success" },
                { label: "Queue", status: "Processing", color: "warning" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">{item.label}</span>
                  <Badge variant={item.color} size="sm" dot>{item.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
