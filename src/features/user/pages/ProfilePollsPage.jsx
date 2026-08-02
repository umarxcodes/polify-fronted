import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Vote, Clock, Eye, MoreHorizontal } from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { useAuth } from "../../../contexts/AuthContext";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Dropdown } from "../../../components/ui/Dropdown";

function PollCard({ poll, index = 0 }) {
  const menuItems = [
    { label: "View Details", onClick: () => {} },
    { label: "Share", onClick: () => {} },
    { label: "Delete", onClick: () => {}, danger: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card hover className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" size="sm">
                {poll.category || "General"}
              </Badge>
              <Badge
                variant={poll.isActive ? "success" : "secondary"}
                size="sm"
              >
                {poll.isActive ? "Active" : "Closed"}
              </Badge>
            </div>
            <Link to={`/polls/${poll._id}`}>
              <h4 className="text-base font-semibold text-surface-900 hover:text-brand-600 transition-colors">
                {poll.title}
              </h4>
            </Link>
            {poll.description && (
              <p className="text-sm text-surface-600 mt-1 line-clamp-2">
                {poll.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-surface-500">
                <Vote size={14} />
                {poll.totalVotes?.toLocaleString() || 0} votes
              </span>
              <span className="flex items-center gap-1 text-xs text-surface-500">
                <Eye size={14} />
                {poll.views?.toLocaleString() || 0} views
              </span>
              <span className="flex items-center gap-1 text-xs text-surface-500">
                <Clock size={14} />
                {poll.timeAgo || "Recently"}
              </span>
            </div>
          </div>
          <Dropdown
            trigger={
              <button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            }
            items={menuItems}
            align="right"
          />
        </div>

        {poll.options && poll.options.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-200">
            <div className="space-y-2">
              {poll.options.slice(0, 3).map((option, idx) => {
                const percentage = poll.totalVotes
                  ? Math.round(
                      (option.votes / poll.totalVotes) * 100
                    )
                  : 0;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-surface-600 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default function ProfilePollsPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", "polls"],
    queryFn: async () => {
      const response = await apiClient.get("/polls", {
        params: { limit: 100 },
      });
      const body = response.data;
      const allPolls = body?.data?.polls || body?.polls || [];
      const userId = user?.id;
      const mine = Array.isArray(allPolls)
        ? allPolls.filter((poll) => {
            const created = poll.createdBy;
            return (
              created &&
              (created._id === userId || created === userId)
            );
          })
        : [];
      return mine;
    },
  });

  const polls = data || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-600">{error.message}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">
              My Polls
            </h2>
            <p className="text-surface-500 mt-1">
              Polls you've created
            </p>
          </div>
          <Link to="/polls/create">
            <Button variant="primary" icon={<Vote size={18} />}>
              Create Poll
            </Button>
          </Link>
        </div>
      </motion.div>

      {polls.length > 0 ? (
        <div className="space-y-4">
          {polls.map((poll, index) => (
            <PollCard
              key={poll._id || index}
              poll={poll}
              index={index}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400 mx-auto mb-4">
            <Vote size={28} />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 mb-1">
            No polls yet
          </h3>
          <p className="text-sm text-surface-500 mb-4">
            Create your first poll to see it here.
          </p>
          <Link to="/polls/create">
            <Button variant="primary" icon={<Vote size={18} />}>
              Create Poll
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}