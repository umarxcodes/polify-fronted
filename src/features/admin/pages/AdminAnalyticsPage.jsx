import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  FileText,
  Vote,
  MessageSquare,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { ErrorState } from "../../../components/ui/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState";

const unwrap = (response) => response.data?.data || response.data;

export default function AdminAnalyticsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/analytics");
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-surface-400 mt-1">Platform insights</p>
        </div>
        <ErrorState
          error={error.message}
          onRetry={refetch}
          title="Failed to load analytics"
          dark
        />
      </motion.div>
    );
  }

  const analytics = data || {};
  const topCategories = analytics.topCategories || [];
  const mostActiveUsers = analytics.mostActiveUsers || [];
  const mostPopularPolls = analytics.mostPopularPolls || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-surface-400 mt-1">Platform insights and trends</p>
      </div>

      {/* Stats */}
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
            <Card hover dark className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-400">New Users (7d)</p>
                  <p className="text-xl font-bold text-white">{analytics.dailyRegistrations || 0}</p>
                </div>
              </div>
            </Card>
            <Card hover dark className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-success-500/20 to-success-600/10 flex items-center justify-center text-success-400">
                  <Vote size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-400">New Votes (7d)</p>
                  <p className="text-xl font-bold text-white">{analytics.dailyVotes || 0}</p>
                </div>
              </div>
            </Card>
            <Card hover dark className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-warning-500/20 to-warning-600/10 flex items-center justify-center text-warning-400">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-400">New Comments (7d)</p>
                  <p className="text-xl font-bold text-white">{analytics.dailyComments || 0}</p>
                </div>
              </div>
            </Card>
            <Card hover dark className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center text-violet-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-400">Monthly Growth</p>
                  <p className="text-xl font-bold text-white">{analytics.monthlyGrowth || 0}</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Active Users */}
        <Card dark className="p-6">
          <h3 className="text-base font-semibold text-white mb-4">Most Active Users</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton dark className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton dark className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : mostActiveUsers.length > 0 ? (
            <div className="space-y-3">
              {mostActiveUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-semibold text-surface-500 w-4">{index + 1}</span>
                  <Avatar
                    src={user.profileImage}
                    fallback={user.name?.split(" ").map(n => n[0]).join("") || "U"}
                    size="sm"
                    color="brand"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-surface-500">@{user.username}</p>
                  </div>
                  <Badge variant="secondary" size="sm">Active</Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No data available"
              description="Analytics data will appear here once available."
              dark
            />
          )}
        </Card>

        {/* Most Popular Polls */}
        <Card dark className="p-6">
          <h3 className="text-base font-semibold text-white mb-4">Most Popular Polls</h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton dark className="w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton dark className="h-4 w-32" />
                    <Skeleton dark className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : mostPopularPolls.length > 0 ? (
            <div className="space-y-3">
              {mostPopularPolls.map((poll, index) => (
                <motion.div
                  key={poll._id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400 flex-shrink-0">
                      <FileText size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-200 truncate">{poll.title}</p>
                      <p className="text-xs text-surface-500">{poll.totalVotes?.toLocaleString() || 0} votes</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No data available"
              description="Analytics data will appear here once available."
              dark
            />
          )}
        </Card>
      </div>

      {/* Top Categories */}
      <Card dark className="p-6">
        <h3 className="text-base font-semibold text-white mb-4">Top Categories</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton dark className="h-4 w-32" />
                <Skeleton dark className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : topCategories.length > 0 ? (
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <motion.div
                key={category._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-surface-200">{category._id}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-surface-400">{category.count} polls</span>
                  <span className="text-sm font-semibold text-white">{category.totalVotes?.toLocaleString() || 0} votes</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No data available"
            description="Category analytics will appear here once available."
            dark
          />
        )}
      </Card>
    </motion.div>
  );
}
