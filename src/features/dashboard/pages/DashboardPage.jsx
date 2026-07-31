import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Vote,
  Users,
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
  Flame,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";

function StatCard({ icon: Icon, label, value, change, delay = 0 }) {
  const isPositive = change?.startsWith("+");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card hover className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/10 flex items-center justify-center text-brand-600">
              <Icon size={22} strokeWidth={2} />
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

function ChartCard({ title, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-surface-900">{title}</h3>
            <p className="text-sm text-surface-500 mt-0.5">Live data</p>
          </div>
          <Badge variant="primary" dot>Live</Badge>
        </div>
        {children}
      </Card>
    </motion.div>
  );
}

function ActivityItem({ poll, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/10 to-brand-600/10 flex items-center justify-center text-brand-600 flex-shrink-0">
        <Vote size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-900 truncate">{poll.title}</p>
        <p className="text-xs text-surface-500 mt-0.5">{poll.votes} votes · {poll.timeAgo}</p>
      </div>
      <Badge variant="secondary" size="sm">{poll.category}</Badge>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [statsRes, pollsRes] = await Promise.all([
        apiClient.get("/analytics/dashboard"),
        apiClient.get("/search/latest"),
      ]);
      return {
        stats: statsRes.data?.data || statsRes.data,
        polls: pollsRes.data?.data?.polls || pollsRes.data?.polls || [],
      };
    },
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-500 mb-4">
          <Activity size={28} />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-1">Failed to load dashboard</h3>
        <p className="text-sm text-surface-500 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  const stats = data?.stats || {};
  const polls = data?.polls || [];

  const quickActions = [
    { icon: Plus, label: "Create Poll", href: "/polls/create", variant: "primary" },
    { icon: Search, label: "Explore", href: "/search", variant: "secondary" },
    { icon: BarChart3, label: "Analytics", href: "/analytics", variant: "secondary" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Dashboard</h1>
          <p className="text-surface-500 mt-1">Welcome back! Here's what's happening in your community.</p>
        </div>
        <div className="flex items-center gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.href}>
              <Button variant={action.variant} icon={action.icon} size="sm">
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <>
            <StatCard icon={Vote} label="Total Votes" value={stats.totalVotes?.toLocaleString() || "0"} change="+12%" delay={0} />
            <StatCard icon={FileText} label="Active Polls" value={stats.activePolls?.toLocaleString() || "0"} change="+8%" delay={0.05} />
            <StatCard icon={Users} label="Participants" value={stats.totalUsers?.toLocaleString() || "0"} change="+24%" delay={0.1} />
            <StatCard icon={TrendingUp} label="Engagement" value={`${stats.engagementRate || 0}%`} change="+5%" delay={0.15} />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent polls */}
        <div className="lg:col-span-2 space-y-4">
          <ChartCard title="Recent Polls" className="!p-0">
            {isLoading ? (
              <div className="p-4 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : polls.length > 0 ? (
              <div className="divide-y divide-surface-100">
                {polls.slice(0, 5).map((poll, index) => (
                  <ActivityItem key={poll._id || index} poll={{
                    title: poll.title,
                    votes: poll.totalVotes?.toLocaleString() || "0",
                    timeAgo: "Recently",
                    category: poll.category || "General",
                  }} delay={index * 0.05} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 mx-auto mb-3">
                  <FileText size={24} />
                </div>
                <p className="text-sm text-surface-500">No polls yet. Create your first poll to get started!</p>
                <Link to="/polls/create">
                  <Button variant="primary" size="sm" className="mt-4" icon={Plus}>
                    Create Poll
                  </Button>
                </Link>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Quick stats & trending */}
        <div className="space-y-6">
          {/* Trending topics */}
          <ChartCard title="Trending Topics" delay={0.2}>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { topic: "Remote Work", count: "2.4k", trend: "+12%" },
                  { topic: "AI Tools", count: "1.8k", trend: "+8%" },
                  { topic: "Design Systems", count: "1.2k", trend: "+5%" },
                  { topic: "Leadership", count: "956", trend: "+3%" },
                ].map((item, index) => (
                  <motion.div
                    key={item.topic}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                        <Flame size={14} />
                      </div>
                      <span className="text-sm font-medium text-surface-900">{item.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-surface-900">{item.count}</span>
                      <span className="text-xs font-medium text-success-600">{item.trend}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ChartCard>

          {/* Quick actions */}
          <ChartCard title="Quick Actions" delay={0.3}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Plus, label: "New Poll", href: "/polls/create" },
                { icon: Vote, label: "Vote", href: "/dashboard" },
                { icon: Users, label: "Invite", href: "/dashboard" },
                { icon: BarChart3, label: "Analytics", href: "/analytics" },
              ].map((action, index) => (
                <Link key={action.label} to={action.href}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl border border-surface-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/10 flex items-center justify-center text-brand-600 mx-auto mb-2">
                      <action.icon size={18} />
                    </div>
                    <span className="text-xs font-medium text-surface-700">{action.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
