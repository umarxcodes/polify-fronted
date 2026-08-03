import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Flag,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";

const unwrap = (response) => response.data?.data || response.data;

export default function ModerationDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "reports", "moderation-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/reports/moderation-stats");
      return unwrap(response);
    },
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
            <StatCard icon={Flag} label="Total Reports" value={stats.totalReports?.toLocaleString() || "0"} color="brand" delay={0} />
            <StatCard icon={Clock} label="Pending" value={stats.pendingReports?.toLocaleString() || "0"} color="warning" delay={0.05} />
            <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolvedReports?.toLocaleString() || "0"} color="success" delay={0.1} />
            <StatCard icon={XCircle} label="Rejected" value={stats.rejectedReports?.toLocaleString() || "0"} color="secondary" delay={0.15} />
          </>
        )}
      </div>

      {isLoading ? (
        <Card dark className="p-6">
          <Skeleton dark className="h-5 w-40 mb-4" />
          <Skeleton dark className="h-64 w-full" />
        </Card>
      ) : (
        <Card dark className="p-6">
          <h3 className="text-base font-semibold text-white mb-4">Reports by Reason</h3>
          {stats.reportsByReason?.length > 0 ? (
            <div className="space-y-3">
              {stats.reportsByReason.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-surface-300 capitalize">{item._id?.replace(/_/g, " ") || item.reason}</span>
                  <span className="text-sm font-semibold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Flag} title="No data available" description="Report analytics will appear here." dark />
          )}
        </Card>
      )}
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color = "brand", delay = 0 }) {
  const colorClasses = {
    brand: "from-brand-500/20 to-brand-600/10 text-brand-400",
    success: "from-success-500/20 to-success-600/10 text-success-400",
    warning: "from-warning-500/20 to-warning-600/10 text-warning-400",
    danger: "from-danger-500/20 to-danger-600/10 text-danger-400",
    secondary: "from-surface-500/20 to-surface-600/10 text-surface-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card hover dark className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center ${colorClasses[color]}`}>
              <Icon size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-400">{label}</p>
              <p className="text-xl font-bold text-white mt-0.5">{value}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
