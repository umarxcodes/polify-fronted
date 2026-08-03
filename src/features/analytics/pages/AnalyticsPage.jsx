import { useState } from "react";
import { motion } from "framer-motion";
import {
  Vote,
  FileText,
  Eye,
  TrendingUp,
  MessageCircle,
  Bookmark,
  Heart,
  Download,
  RefreshCw,
  BarChart3,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Tabs } from "../../../components/ui/Tabs";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Badge } from "../../../components/ui/Badge";
import { KPICard, ProgressBar } from "../components/KPICard";
import { ChartCard, EmptyChart } from "../components/ChartCard";
import { DateFilter } from "../components/Filters";
import { AnalyticsBarChart, AnalyticsAreaChart, AnalyticsPieChart, AnalyticsDonutChart } from "../components/charts";
import {
  useAnalyticsOverview,
  useUserStats,
  useCategoryAnalytics,
  useTagAnalytics,
  useEngagementAnalytics,
  useVoteAnalytics,
  useTrendingPolls,
  useUserVoteHistory,
  useUserBookmarks,
} from "../hooks/useAnalytics";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "user", label: "My Activity" },
  { id: "engagement", label: "Engagement" },
  { id: "votes", label: "Votes" },
  { id: "categories", label: "Categories" },
  { id: "tags", label: "Tags" },
];

const COLORS = ["#00c4a7", "#8b6fff", "#5bc9f2", "#ff8c4a", "#ef4444", "#22c55e"];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateFilter, setDateFilter] = useState({ preset: "30d" });

  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useAnalyticsOverview();

  const {
    data: userStats,
    isLoading: userStatsLoading,
  } = useUserStats();

  const {
    data: engagement,
    isLoading: engagementLoading,
  } = useEngagementAnalytics();

  const {
    data: voteAnalytics,
    isLoading: voteLoading,
  } = useVoteAnalytics();

  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useCategoryAnalytics();

  const {
    data: tags,
    isLoading: tagsLoading,
  } = useTagAnalytics();

  const {
    data: voteHistory,
    isLoading: voteHistoryLoading,
  } = useUserVoteHistory(1, 50);

  const {
    data: bookmarks,
    isLoading: bookmarksLoading,
  } = useUserBookmarks();

  const {
    data: trending,
    isLoading: trendingLoading,
  } = useTrendingPolls();

  const isLoading = overviewLoading || userStatsLoading;
  const error = overviewError;

  const handleExport = () => {
    alert("Export functionality requires backend support. Currently unavailable.");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton dark className="h-8 w-48 mb-2" />
          <Skeleton dark className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} dark className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton dark className="w-12 h-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton dark className="h-3 w-20" />
                  <Skeleton dark className="h-6 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card dark className="p-6">
            <Skeleton dark className="h-5 w-40 mb-4" />
            <Skeleton dark className="h-64 w-full" />
          </Card>
          <Card dark className="p-6">
            <Skeleton dark className="h-5 w-40 mb-4" />
            <Skeleton dark className="h-64 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load analytics"
        message={error.message}
        onRetry={() => refetchOverview()}
        dark
      />
    );
  }

  const stats = overview?.stats || {};
  const overviewData = overview?.overview || overview || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-surface-400 mt-2">
            Track your poll performance and engagement.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateFilter value={dateFilter} onChange={setDateFilter} dark />
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="!p-2"
          >
            <Download size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchOverview()}
            className="!p-2"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              icon={Vote}
              label="Total Votes"
              value={overviewData.totalVotes || stats.totalVotes || 0}
              change="+12%"
              delay={0}
            />
            <KPICard
              icon={FileText}
              label="Total Polls"
              value={overviewData.totalPolls || stats.totalPolls || 0}
              change="+8%"
              delay={0.05}
            />
            <KPICard
              icon={Eye}
              label="Total Views"
              value={overviewData.totalViews || stats.totalViews || 0}
              change="+15%"
              delay={0.1}
            />
            <KPICard
              icon={TrendingUp}
              label="Engagement"
              value={`${overviewData.engagementRate || stats.engagementRate || 0}%`}
              change="+5%"
              delay={0.15}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Top Polls by Votes" loading={overviewLoading}>
              {overviewData.topPolls?.length > 0 ? (
                <AnalyticsBarChart
                  data={overviewData.topPolls.map((poll) => ({
                    name: poll.title?.slice(0, 20) || `Poll ${poll._id?.slice(-4)}`,
                    votes: poll.totalVotes || 0,
                  }))}
                  height={300}
                />
              ) : (
                <EmptyChart message="No poll data available" />
              )}
            </ChartCard>

            <ChartCard title="Category Distribution" loading={overviewLoading}>
              {overviewData.categoryBreakdown?.length > 0 ? (
                <AnalyticsPieChart
                  data={overviewData.categoryBreakdown.map((item) => ({
                    name: item.category || "Other",
                    value: item.count || 0,
                  }))}
                  height={300}
                />
              ) : (
                <EmptyChart message="No category data available" />
              )}
            </ChartCard>
          </div>

          {trending?.length > 0 && (
            <ChartCard title="Trending Polls" loading={trendingLoading}>
              <div className="space-y-3">
                {trending.slice(0, 5).map((poll, index) => (
                  <div
                    key={poll._id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-surface-500 w-6">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {poll.title}
                        </p>
                        <p className="text-xs text-surface-400">
                          {poll.totalVotes} votes
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-primary-400 font-medium">
                      {poll.trendingScore?.toFixed(1) || "0.0"} score
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}
        </motion.div>
      )}

      {activeTab === "engagement" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {engagementLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} dark className="p-6">
                  <Skeleton dark className="h-3 w-20 mb-2" />
                  <Skeleton dark className="h-8 w-16" />
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard icon={Eye} label="Total Views" value={engagement?.views || 0} delay={0} />
                <KPICard icon={MessageCircle} label="Comments" value={engagement?.totalComments || 0} delay={0.05} />
                <KPICard icon={Bookmark} label="Bookmarks" value={engagement?.totalBookmarks || 0} delay={0.1} />
                <KPICard icon={Heart} label="Likes" value={engagement?.totalLikes || 0} delay={0.15} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Engagement Overview" loading={engagementLoading}>
                  {engagement ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-surface-400">Engagement Rate</span>
                          <span className="text-sm font-semibold text-white">
                            {engagement.avgEngagement || 0}%
                          </span>
                        </div>
                        <ProgressBar value={engagement.avgEngagement || 0} max={100} dark />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-surface-400">Followers</span>
                          <span className="text-sm font-semibold text-white">
                            {engagement.followers || 0}
                          </span>
                        </div>
                        <ProgressBar value={engagement.followers || 0} max={100} dark />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-surface-400">Following</span>
                          <span className="text-sm font-semibold text-white">
                            {engagement.following || 0}
                          </span>
                        </div>
                        <ProgressBar value={engagement.following || 0} max={100} dark />
                      </div>
                    </div>
                  ) : (
                    <EmptyChart message="No engagement data available" />
                  )}
                </ChartCard>

                <ChartCard title="Vote Distribution" loading={voteLoading}>
                  {voteAnalytics?.votesByPoll?.length > 0 ? (
                    <AnalyticsPieChart
                      data={voteAnalytics.votesByPoll.slice(0, 5).map((p) => ({
                        name: p.title?.slice(0, 15) || "Poll",
                        value: p.votes,
                      }))}
                      height={300}
                    />
                  ) : (
                    <EmptyChart message="No vote data available" />
                  )}
                </ChartCard>
              </div>
            </>
          )}
        </motion.div>
      )}

      {activeTab === "votes" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {voteLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card dark className="p-6">
                <Skeleton dark className="h-5 w-40 mb-4" />
                <Skeleton dark className="h-64 w-full" />
              </Card>
              <Card dark className="p-6">
                <Skeleton dark className="h-5 w-40 mb-4" />
                <Skeleton dark className="h-64 w-full" />
              </Card>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KPICard icon={Vote} label="Total Votes" value={voteAnalytics?.totalVotes || 0} delay={0} />
                <KPICard icon={TrendingUp} label="Avg Votes/Day" value={voteAnalytics?.votesByDay?.length || 0} delay={0.05} />
                <KPICard icon={BarChart3} label="Active Polls" value={voteAnalytics?.votesByPoll?.length || 0} delay={0.1} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Votes Per Day (Last 30 Days)" loading={voteLoading}>
                  {voteAnalytics?.votesByDay?.length > 0 ? (
                    <AnalyticsAreaChart
                      data={voteAnalytics.votesByDay.map((d) => ({
                        name: d.date?.slice(5) || d.date,
                        value: d.count,
                      }))}
                      height={300}
                    />
                  ) : (
                    <EmptyChart message="No daily vote data available" />
                  )}
                </ChartCard>

                <ChartCard title="Votes Per Week" loading={voteLoading}>
                  {voteAnalytics?.votesByWeek?.length > 0 ? (
                    <AnalyticsBarChart
                      data={voteAnalytics.votesByWeek.map((w) => ({
                        name: w.week,
                        value: w.count,
                      }))}
                      height={300}
                    />
                  ) : (
                    <EmptyChart message="No weekly vote data available" />
                  )}
                </ChartCard>
              </div>

              {voteAnalytics?.mostActivePolls?.length > 0 && (
                <ChartCard title="Most Active Polls" loading={voteLoading}>
                  <AnalyticsBarChart
                    data={voteAnalytics.mostActivePolls.map((p) => ({
                      name: p.title?.slice(0, 20) || "Poll",
                      value: p.votes,
                    }))}
                    height={300}
                  />
                </ChartCard>
              )}
            </>
          )}
        </motion.div>
      )}

      {activeTab === "categories" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {categoriesLoading ? (
            <Card dark className="p-6">
              <Skeleton dark className="h-5 w-40 mb-4" />
              <Skeleton dark className="h-64 w-full" />
            </Card>
          ) : categories?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Categories by Votes" loading={categoriesLoading}>
                  <AnalyticsBarChart
                    data={categories.slice(0, 10).map((c) => ({
                      name: c.category,
                      value: c.totalVotes,
                    }))}
                    height={300}
                  />
                </ChartCard>
                <ChartCard title="Category Distribution" loading={categoriesLoading}>
                  <AnalyticsDonutChart
                    data={categories.slice(0, 10).map((c) => ({
                      name: c.category,
                      value: c.count,
                    }))}
                    height={300}
                  />
                </ChartCard>
              </div>

              <ChartCard title="Category Performance" loading={categoriesLoading}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-700">
                        <th className="text-left py-3 px-4 text-surface-400 font-medium">Category</th>
                        <th className="text-right py-3 px-4 text-surface-400 font-medium">Polls</th>
                        <th className="text-right py-3 px-4 text-surface-400 font-medium">Votes</th>
                        <th className="text-right py-3 px-4 text-surface-400 font-medium">Comments</th>
                        <th className="text-right py-3 px-4 text-surface-400 font-medium">Bookmarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat, index) => (
                        <tr
                          key={cat.category}
                          className="border-b border-surface-800 hover:bg-surface-700/20 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-white font-medium">{cat.category}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-surface-300">
                            {cat.count}
                          </td>
                          <td className="text-right py-3 px-4 text-surface-300">
                            {cat.totalVotes.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4 text-surface-300">
                            {cat.totalComments}
                          </td>
                          <td className="text-right py-3 px-4 text-surface-300">
                            {cat.totalBookmarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            </>
          ) : (
            <EmptyChart message="No category data available" />
          )}
        </motion.div>
      )}

      {activeTab === "tags" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {tagsLoading ? (
            <Card dark className="p-6">
              <Skeleton dark className="h-5 w-40 mb-4" />
              <Skeleton dark className="h-64 w-full" />
            </Card>
          ) : tags?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Trending Tags by Votes" loading={tagsLoading}>
                  <AnalyticsBarChart
                    data={tags.slice(0, 10).map((t) => ({
                      name: t.tag,
                      value: t.totalVotes,
                    }))}
                    height={300}
                  />
                </ChartCard>
                <ChartCard title="Tags by Usage" loading={tagsLoading}>
                  <AnalyticsPieChart
                    data={tags.slice(0, 10).map((t) => ({
                      name: t.tag,
                      value: t.count,
                    }))}
                    height={300}
                  />
                </ChartCard>
              </div>

              <ChartCard title="Tag Performance" loading={tagsLoading}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-700">
                        <th className="text-left py-3 px-4 text-surface-400 font-medium">Tag</th>
                        <th className="text-right py-3 px-4 text-surface-400 font-medium">Usage</th>
                        <th className="text-right py-3 px-4 text-surface-400 font-medium">Votes</th>
                        <th className="text-right py-3 px-4 text-surface-400 font-medium">Bookmarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tags.map((tag, index) => (
                        <tr
                          key={tag.tag}
                          className="border-b border-surface-800 hover:bg-surface-700/20 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-white font-medium">#{tag.tag}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-surface-300">
                            {tag.count}
                          </td>
                          <td className="text-right py-3 px-4 text-surface-300">
                            {tag.totalVotes.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4 text-surface-300">
                            {tag.totalBookmarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            </>
          ) : (
            <EmptyChart message="No tag data available" />
          )}
        </motion.div>
      )}

      {activeTab === "user" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {userStatsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} dark className="p-6">
                  <Skeleton dark className="h-3 w-20 mb-2" />
                  <Skeleton dark className="h-8 w-16" />
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard icon={FileText} label="Polls Created" value={userStats?.totalPollsCreated || 0} delay={0} />
                <KPICard icon={Vote} label="Votes Cast" value={userStats?.totalVotesCast || 0} delay={0.05} />
                <KPICard icon={MessageCircle} label="Comments" value={userStats?.totalComments || 0} delay={0.1} />
                <KPICard icon={Bookmark} label="Bookmarks" value={userStats?.totalSavedPolls || 0} delay={0.15} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard icon={Heart} label="Likes Received" value={userStats?.totalLikesReceived || 0} delay={0} color="danger" />
                <KPICard icon={Users} label="Followers" value={userStats?.followersCount || 0} delay={0.05} color="success" />
                <KPICard icon={Users} label="Following" value={userStats?.followingCount || 0} delay={0.1} color="info" />
                <KPICard icon={Activity} label="Profile Completion" value={`${userStats?.profileCompletionPercentage || 0}%`} delay={0.15} color="warning" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Recent Votes" loading={voteHistoryLoading}>
                  {voteHistory?.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {voteHistory.slice(0, 10).map((vote, index) => (
                        <div
                          key={vote._id || index}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-700/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400">
                              <Vote size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {vote.pollId?.title || "Unknown Poll"}
                              </p>
                              <p className="text-xs text-surface-400">
                                {new Date(vote.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" size="sm" dark>
                            {vote.pollId?.type || "Poll"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyChart message="No votes cast yet" />
                  )}
                </ChartCard>

                <ChartCard title="Saved Polls" loading={bookmarksLoading}>
                  {bookmarks?.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {bookmarks.slice(0, 10).map((bookmark, index) => (
                        <div
                          key={bookmark._id || index}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-700/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-warning-500/15 flex items-center justify-center text-warning-400">
                              <Bookmark size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {bookmark.pollId?.title || "Unknown Poll"}
                              </p>
                              <p className="text-xs text-surface-400">
                                {new Date(bookmark.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" size="sm" dark>
                            {bookmark.pollId?.status || "Saved"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyChart message="No bookmarks yet" />
                  )}
                </ChartCard>
              </div>

              <ChartCard title="Account Info" loading={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-surface-400 mb-3">Account Created</h4>
                    <p className="text-white font-medium">
                      {userStats?.accountCreatedAt ? new Date(userStats.accountCreatedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-surface-400 mb-3">Profile Completion</h4>
                    <ProgressBar
                      value={userStats?.profileCompletionPercentage || 0}
                      max={100}
                      dark
                    />
                  </div>
                </div>
              </ChartCard>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
