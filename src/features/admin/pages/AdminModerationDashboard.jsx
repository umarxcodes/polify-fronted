import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Flag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Users,
  FileText,
  MessageSquare,
  Eye,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { apiClient } from "../../../lib/axios";

const unwrap = (response) => response.data?.data || response.data;

const reasonConfig = {
  spam: { label: "Spam", icon: MessageSquare, color: "text-warning-400" },
  harassment: { label: "Harassment", icon: AlertTriangle, color: "text-danger-400" },
  hate_speech: { label: "Hate Speech", icon: AlertTriangle, color: "text-danger-400" },
  misinformation: { label: "Misinformation", icon: FileText, color: "text-warning-400" },
  inappropriate_content: { label: "Inappropriate Content", icon: AlertTriangle, color: "text-danger-400" },
  copyright: { label: "Copyright", icon: FileText, color: "text-brand-400" },
  fake_account: { label: "Fake Account", icon: Users, color: "text-warning-400" },
  scam: { label: "Scam", icon: AlertTriangle, color: "text-danger-400" },
  other: { label: "Other", icon: Flag, color: "text-surface-400" },
};

export default function AdminModerationDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "reports", "moderation-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/reports/moderation-stats");
      return unwrap(response);
    },
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Moderation Dashboard</h1>
          <p className="text-surface-400 mt-1">Report management overview</p>
        </div>
        <ErrorState error={error.message} onRetry={refetch} dark />
      </motion.div>
    );
  }

  const stats = data || {};

  const statCards = [
    { label: "Total Reports", value: stats.totalReports?.toLocaleString() || "0", icon: Flag, color: "brand", change: "+12%", up: true },
    { label: "Pending Review", value: stats.pendingReports?.toLocaleString() || "0", icon: Clock, color: "warning", change: "+5%", up: true },
    { label: "Resolved", value: stats.resolvedReports?.toLocaleString() || "0", icon: CheckCircle2, color: "success", change: "+18%", up: true },
    { label: "Rejected", value: stats.rejectedReports?.toLocaleString() || "0", icon: XCircle, color: "secondary", change: "-3%", up: false },
    { label: "Under Review", value: stats.underReviewReports?.toLocaleString() || "0", icon: Eye, color: "info", change: "+2%", up: true },
    { label: "High Priority", value: stats.highPriorityReports?.toLocaleString() || "0", icon: AlertTriangle, color: "danger", change: "+8%", up: true },
    { label: "Escalated", value: stats.escalatedReports?.toLocaleString() || "0", icon: ArrowUpRight, color: "danger", change: "+1", up: true },
    { label: "Avg Resolution", value: stats.avgResolutionTime ? `${stats.avgResolutionTime}h` : "0h", icon: TrendingUp, color: "brand", change: "-2h", up: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Moderation Dashboard</h1>
        <p className="text-surface-400 mt-1">Real-time overview of report management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
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
          statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Card hover dark className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400`}>
                      <stat.icon size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-400">{stat.label}</p>
                      <p className="text-xl font-bold text-white mt-0.5">{stat.value}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${stat.up ? "text-success-400" : "text-danger-400"}`}>
                    {stat.change}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card dark className="p-6">
          <h3 className="text-base font-semibold text-white mb-4">Reports by Reason</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} dark className="h-8 w-full" />
              ))}
            </div>
          ) : stats.reportsByReason?.length > 0 ? (
            <div className="space-y-3">
              {stats.reportsByReason.map((item, index) => {
                const config = reasonConfig[item._id] || reasonConfig.other;
                const Icon = config.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={config.color} />
                      <span className="text-sm text-surface-300 capitalize">{config.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{item.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Flag} title="No data available" description="Report analytics will appear here." dark />
          )}
        </Card>

        <Card dark className="p-6">
          <h3 className="text-base font-semibold text-white mb-4">Recent Activity</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} dark className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity?.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/50">
                    <div className={`w-2 h-2 rounded-full ${activity.type === "resolved" ? "bg-success-500" : activity.type === "rejected" ? "bg-surface-500" : "bg-warning-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-200 truncate">{activity.action}</p>
                      <p className="text-xs text-surface-500">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState icon={Clock} title="No recent activity" description="Actions will appear here." dark />
              )}
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
