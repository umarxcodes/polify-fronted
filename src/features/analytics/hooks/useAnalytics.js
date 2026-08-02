import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: async () => {
      const data = await analyticsService.getAnalyticsOverview();
      return data?.data || data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePollAnalytics(pollId) {
  return useQuery({
    queryKey: ["analytics", "poll", pollId],
    queryFn: async () => {
      const data = await analyticsService.getPollAnalytics(pollId);
      return data?.data || data;
    },
    enabled: Boolean(pollId),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePollResults(pollId) {
  return useQuery({
    queryKey: ["analytics", "poll", "results", pollId],
    queryFn: async () => {
      const data = await analyticsService.getPollResults(pollId);
      return data?.data || data;
    },
    enabled: Boolean(pollId),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePollChartData(pollId) {
  return useQuery({
    queryKey: ["analytics", "poll", "chart", pollId],
    queryFn: async () => {
      const data = await analyticsService.getPollChartData(pollId);
      return data?.data || data;
    },
    enabled: Boolean(pollId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTrendingPolls() {
  return useQuery({
    queryKey: ["analytics", "trending"],
    queryFn: async () => {
      const data = await analyticsService.getTrendingPolls();
      return data?.polls || data?.data?.polls || [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["analytics", "user", "stats"],
    queryFn: async () => {
      const data = await analyticsService.getUserStats();
      return data?.stats || data?.data?.stats || {};
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserVoteHistory(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["analytics", "user", "votes", page, limit],
    queryFn: async () => {
      const data = await analyticsService.getUserVoteHistory(page, limit);
      return data?.votes || data?.data?.votes || [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUserBookmarks() {
  return useQuery({
    queryKey: ["analytics", "user", "bookmarks"],
    queryFn: async () => {
      const data = await analyticsService.getUserBookmarks();
      return data?.bookmarks || data?.data?.bookmarks || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ["analytics", "user", "profile"],
    queryFn: async () => {
      const data = await analyticsService.getUserProfile();
      return data?.data || data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoryAnalytics() {
  return useQuery({
    queryKey: ["analytics", "categories"],
    queryFn: async () => {
      const data = await analyticsService.getPolls({ limit: 100 });
      const polls = data?.polls || data?.data?.polls || [];

      const categoryMap = new Map();
      polls.forEach((poll) => {
        const cat = poll.category || "Uncategorized";
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, {
            category: cat,
            count: 0,
            totalVotes: 0,
            totalComments: 0,
            totalBookmarks: 0,
          });
        }
        const entry = categoryMap.get(cat);
        entry.count += 1;
        entry.totalVotes += poll.totalVotes || 0;
        entry.totalComments += poll.commentsCount || 0;
        entry.totalBookmarks += poll.savedCount || 0;
      });

      return Array.from(categoryMap.values()).sort((a, b) => b.totalVotes - a.totalVotes);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useTagAnalytics() {
  return useQuery({
    queryKey: ["analytics", "tags"],
    queryFn: async () => {
      const data = await analyticsService.getPolls({ limit: 100 });
      const polls = data?.polls || data?.data?.polls || [];

      const tagMap = new Map();
      polls.forEach((poll) => {
        (poll.tags || []).forEach((tag) => {
          if (!tagMap.has(tag)) {
            tagMap.set(tag, {
              tag,
              count: 0,
              totalVotes: 0,
              totalBookmarks: 0,
            });
          }
          const entry = tagMap.get(tag);
          entry.count += 1;
          entry.totalVotes += poll.totalVotes || 0;
          entry.totalBookmarks += poll.savedCount || 0;
        });
      });

      return Array.from(tagMap.values()).sort((a, b) => b.totalVotes - a.totalVotes);
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useEngagementAnalytics() {
  return useQuery({
    queryKey: ["analytics", "engagement"],
    queryFn: async () => {
      const [overviewRes, userStatsRes, bookmarksRes] = await Promise.all([
        analyticsService.getAnalyticsOverview(),
        analyticsService.getUserStats(),
        analyticsService.getUserBookmarks(),
      ]);

      const overview = overviewRes?.data || overviewRes || {};
      const userStats = userStatsRes?.stats || userStatsRes || {};
      const bookmarks = bookmarksRes?.bookmarks || bookmarksRes?.data?.bookmarks || [];

      return {
        views: overview.totalViews || 0,
        totalVotes: overview.totalVotes || 0,
        totalComments: userStats.totalComments || 0,
        totalBookmarks: bookmarks.length || userStats.totalSavedPolls || 0,
        totalLikes: userStats.totalLikesReceived || 0,
        followers: userStats.followersCount || 0,
        following: userStats.followingCount || 0,
        avgEngagement: overview.engagementRate || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useVoteAnalytics() {
  return useQuery({
    queryKey: ["analytics", "votes"],
    queryFn: async () => {
      const [voteHistoryRes, overviewRes] = await Promise.all([
        analyticsService.getUserVoteHistory(1, 100),
        analyticsService.getAnalyticsOverview(),
      ]);

      const votes = voteHistoryRes?.votes || voteHistoryRes?.data?.votes || [];
      const overview = overviewRes?.data || overviewRes || {};

      const votesByDay = new Map();
      const votesByWeek = new Map();
      const votesByMonth = new Map();
      const votesByPoll = new Map();

      votes.forEach((vote) => {
        const date = new Date(vote.createdAt);
        const dayKey = date.toISOString().split("T")[0];
        const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const pollId = vote.pollId?._id || vote.pollId;

        votesByDay.set(dayKey, (votesByDay.get(dayKey) || 0) + 1);
        votesByWeek.set(weekKey, (votesByWeek.get(weekKey) || 0) + 1);
        votesByMonth.set(monthKey, (votesByMonth.get(monthKey) || 0) + 1);

        if (pollId) {
          if (!votesByPoll.has(pollId)) {
            votesByPoll.set(pollId, {
              pollId,
              title: vote.pollId?.title || "Unknown Poll",
              votes: 0,
            });
          }
          votesByPoll.get(pollId).votes += 1;
        }
      });

      return {
        totalVotes: votes.length || overview.totalVotes || 0,
        votesByDay: Array.from(votesByDay.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-30),
        votesByWeek: Array.from(votesByWeek.entries())
          .map(([week, count]) => ({ week, count }))
          .sort((a, b) => a.week.localeCompare(b.week))
          .slice(-12),
        votesByMonth: Array.from(votesByMonth.entries())
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => a.month.localeCompare(b.month))
          .slice(-12),
        votesByPoll: Array.from(votesByPoll.values()).sort((a, b) => b.votes - a.votes).slice(0, 10),
        mostActivePolls: Array.from(votesByPoll.values()).sort((a, b) => b.votes - a.votes).slice(0, 5),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
