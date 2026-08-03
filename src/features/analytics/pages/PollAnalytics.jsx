import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Vote,
  Users,
  Eye,
  TrendingUp,
  BarChart3,
  Download,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Tabs } from "../../../components/ui/Tabs";
import { Badge } from "../../../components/ui/Badge";
import { KPICard } from "../components/KPICard";
import {
  usePollAnalytics,
  usePollChartData,
  usePollResults,
} from "../hooks/useAnalytics";
import { ChartCard, EmptyChart } from "../components/ChartCard";
import { AnalyticsBarChart, AnalyticsPieChart, AnalyticsDonutChart, AnalyticsAreaChart } from "../components/charts";
import { DateFilter } from "../components/Filters";
import { exportPollAnalytics } from "../endpoints/analyticsApi";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results" },
  { id: "trends", label: "Trends" },
  { id: "voters", label: "Voters" },
];

export default function PollAnalytics() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateFilter, setDateFilter] = useState({ preset: "30d" });

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = usePollAnalytics(pollId);

  const {
    data: chartData,
    isLoading: chartLoading,
  } = usePollChartData(pollId);

  const {
    data: results,
    isLoading: resultsLoading,
  } = usePollResults(pollId);

  const handleExport = async () => {
    try {
      const blob = await exportPollAnalytics(pollId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `poll-analytics-${pollId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    }
  };

  if (analyticsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton dark className="w-10 h-10 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton dark className="h-6 w-64" />
            <Skeleton dark className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} dark className="p-6">
              <Skeleton dark className="h-3 w-20 mb-2" />
              <Skeleton dark className="h-8 w-16" />
            </Card>
          ))}
        </div>
        <Card dark className="p-6">
          <Skeleton dark className="h-5 w-40 mb-4" />
          <Skeleton dark className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <ErrorState
        title="Failed to load poll analytics"
        message={analyticsError.message}
        onRetry={() => refetchAnalytics()}
        dark
      />
    );
  }

  if (!analytics) {
    return (
      <ErrorState
        title="Poll not found"
        message="The poll you're looking for doesn't exist or you don't have permission to view its analytics."
        dark
      />
    );
  }

  const overview = analytics.overview || {};
  const status = analytics.status || {};
  const trends = analytics.trends || {};
  const timeline = analytics.timeline || {};
  const voters = analytics.voters || {};
  const resultsData = results?.options || [];

  const getStatusBadge = () => {
    if (status.isExpired) return <Badge variant="danger" dark>Expired</Badge>;
    if (status.isActive) return <Badge variant="success" dark>Active</Badge>;
    if (status.isDraft) return <Badge variant="secondary" dark>Draft</Badge>;
    return <Badge variant="secondary" dark>{status.status || "Unknown"}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="!p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {overview.title || "Poll Analytics"}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {getStatusBadge()}
              <span className="text-sm text-surface-400">
                Created {new Date(overview.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DateFilter value={dateFilter} onChange={setDateFilter} dark />
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigator.share?.({ title: overview.title, url: window.location.href })}>
            <Share2 size={16} />
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
            <KPICard icon={Vote} label="Total Votes" value={overview.totalVotes || 0} delay={0} />
            <KPICard icon={Users} label="Unique Voters" value={voters.uniqueVoters || 0} delay={0.05} />
            <KPICard icon={Eye} label="Views" value={overview.views || 0} delay={0.1} />
            <KPICard icon={TrendingUp} label="Trending Score" value={trends.trendingScore || 0} delay={0.15} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Vote Distribution" loading={chartLoading}>
              {chartData?.pie?.labels?.length > 0 ? (
                <AnalyticsPieChart
                  data={chartData.pie.labels.map((label, i) => ({
                    name: label,
                    value: chartData.pie.datasets[0]?.data[i] || 0,
                  }))}
                  height={300}
                />
              ) : (
                <EmptyChart message="No vote data available" />
              )}
            </ChartCard>

            <ChartCard title="Vote Trends" loading={chartLoading}>
              {chartData?.bar?.labels?.length > 0 ? (
                <AnalyticsBarChart
                  data={chartData.bar.labels.map((label, i) => ({
                    name: label,
                    value: chartData.bar.datasets[0]?.data[i] || 0,
                  }))}
                  height={300}
                />
              ) : (
                <EmptyChart message="No trend data available" />
              )}
            </ChartCard>
          </div>

          <ChartCard title="Vote Timeline (Last 30 Days)" loading={analyticsLoading}>
            {timeline.daily?.length > 0 ? (
              <AnalyticsAreaChart
                data={timeline.daily.map((d) => ({
                  name: `${d._id?.month}/${d._id?.day}`,
                  value: d.count,
                }))}
                height={300}
              />
            ) : (
              <EmptyChart message="No timeline data available" />
            )}
          </ChartCard>
        </motion.div>
      )}

      {activeTab === "results" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {resultsLoading ? (
            <Card dark className="p-6">
              <Skeleton dark className="h-5 w-40 mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} dark className="h-12 w-full" />
                ))}
              </div>
            </Card>
          ) : (
            <>
              <Card dark className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Poll Results</h3>
                <div className="space-y-4">
                  {resultsData.map((option) => (
                    <div key={option.optionId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-surface-400">
                            #{option.rank}
                          </span>
                          <span className="text-sm font-medium text-white">
                            {option.text}
                          </span>
                          {option.isWinner && (
                            <CheckCircle2 size={16} className="text-success-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-surface-400">
                            {option.votes} votes
                          </span>
                          <span className="text-sm font-semibold text-white w-12 text-right">
                            {option.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary-500 transition-all duration-500"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <ChartCard title="Results Overview" loading={resultsLoading}>
                {resultsData.length > 0 ? (
                  <AnalyticsDonutChart
                    data={resultsData.map((opt) => ({
                      name: opt.text,
                      value: opt.votes,
                    }))}
                    height={300}
                  />
                ) : (
                  <EmptyChart message="No results data available" />
                )}
              </ChartCard>
            </>
          )}
        </motion.div>
      )}

      {activeTab === "trends" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard icon={TrendingUp} label="Daily Growth" value={trends.dailyGrowth || 0} delay={0} />
            <KPICard icon={TrendingUp} label="Weekly Growth" value={trends.weeklyGrowth || 0} delay={0.05} />
            <KPICard icon={TrendingUp} label="Monthly Growth" value={trends.monthlyGrowth || 0} delay={0.1} />
            <KPICard icon={BarChart3} label="Week Votes" value={trends.weekVotes || 0} delay={0.15} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Daily Votes" loading={analyticsLoading}>
              {timeline.daily?.length > 0 ? (
                <AnalyticsAreaChart
                  data={timeline.daily.map((d) => ({
                    name: `${d._id?.month}/${d._id?.day}`,
                    value: d.count,
                  }))}
                  height={300}
                />
              ) : (
                <EmptyChart message="No daily vote data" />
              )}
            </ChartCard>

            <ChartCard title="Hourly Distribution" loading={analyticsLoading}>
              {timeline.hourly?.length > 0 ? (
                <AnalyticsBarChart
                  data={timeline.hourly.map((h) => ({
                    name: `${h._id?.hour}:00`,
                    value: h.count,
                  }))}
                  height={300}
                />
              ) : (
                <EmptyChart message="No hourly vote data" />
              )}
            </ChartCard>
          </div>
        </motion.div>
      )}

      {activeTab === "voters" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard icon={Users} label="Total Votes" value={voters.totalVotes || 0} delay={0} />
            <KPICard icon={Users} label="Unique Voters" value={voters.uniqueVoters || 0} delay={0.05} />
            <KPICard icon={Users} label="Registered Voters" value={voters.registeredVotes || 0} delay={0.1} />
          </div>

          <Card dark className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Voters</h3>
            {voters.recentVoters?.length > 0 ? (
              <div className="space-y-3">
                {voters.recentVoters.map((voter, index) => (
                  <div
                    key={voter.userId || index}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center text-surface-300">
                        {voter.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {voter.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-surface-400">
                          @{voter.username || "unknown"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-surface-500">
                      {new Date(voter.votedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-400 text-center py-4">
                No voter data available for this poll.
              </p>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}
