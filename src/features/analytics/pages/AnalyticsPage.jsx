import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Vote, Users, Eye, BarChart3 } from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#00c4a7", "#8b6fff", "#5bc9f2", "#ff8c4a", "#ef4444", "#22c55e"];

function StatCard({ icon: Icon, label, value, change, delay = 0 }) {
  const isPositive = change?.startsWith("+");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card dark className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center text-primary-400">
              <Icon size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-400">{label}</p>
              <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
            </div>
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                isPositive
                  ? "bg-success-500/15 text-success-400"
                  : "bg-danger-500/15 text-danger-400"
              }`}
            >
              {isPositive ? "↑" : "↓"} {change}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function OverviewCharts({ data }) {
  if (!data) return null;

  const voteData = data.topPolls?.map((poll, index) => ({
    name: poll.title?.slice(0, 20) || `Poll ${index + 1}`,
    votes: poll.totalVotes || 0,
  })) || [];

  const categoryData = data.categoryBreakdown?.map((item) => ({
    name: item.category || "Other",
    value: item.count || 0,
  })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {voteData.length > 0 && (
        <Card dark className="p-6">
          <h3 className="text-base font-semibold text-white mb-4">Top Polls by Votes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={voteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243047" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #243047", backgroundColor: "#111827" }}
                />
                <Bar dataKey="votes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {categoryData.length > 0 && (
        <Card dark className="p-6">
          <h3 className="text-base font-semibold text-white mb-4">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #243047", backgroundColor: "#111827" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const response = await apiClient.get("/analytics/dashboard");
      return response.data?.data || response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} dark className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton dark className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton dark className="h-3 w-20" />
                  <Skeleton dark className="h-6 w-16" />
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
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-danger-500/15 flex items-center justify-center text-danger-400 mb-4">
          <BarChart3 size={28} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Failed to load analytics</h3>
        <p className="text-sm text-surface-400 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  const stats = data?.stats || {};
  const overview = data?.overview || data || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-surface-400 mt-2">Track your poll performance and engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Vote}
          label="Total Votes"
          value={overview.totalVotes?.toLocaleString() || stats.totalVotes?.toLocaleString() || "0"}
          change="+12%"
          delay={0}
        />
        <StatCard
          icon={Users}
          label="Total Polls"
          value={overview.totalPolls?.toLocaleString() || stats.totalPolls?.toLocaleString() || "0"}
          change="+8%"
          delay={0.05}
        />
        <StatCard
          icon={Eye}
          label="Total Views"
          value={overview.totalViews?.toLocaleString() || stats.totalViews?.toLocaleString() || "0"}
          change="+15%"
          delay={0.1}
        />
        <StatCard
          icon={TrendingUp}
          label="Engagement"
          value={`${overview.engagementRate || stats.engagementRate || 0}%`}
          change="+5%"
          delay={0.15}
        />
      </div>

      <OverviewCharts data={overview} />

      <Card dark className="p-6">
        <h3 className="text-base font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {(overview.recentActivity || []).slice(0, 5).map((activity, index) => (
            <motion.div
              key={activity._id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-800/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-white">{activity.title || activity.description}</p>
                <p className="text-xs text-surface-500">{activity.timeAgo || "Recently"}</p>
              </div>
              <Badge variant="secondary" size="sm" dark>{activity.type || "activity"}</Badge>
            </motion.div>
          ))}
          {(!overview.recentActivity || overview.recentActivity.length === 0) && (
            <p className="text-sm text-surface-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  );
}
