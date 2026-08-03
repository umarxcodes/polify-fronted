import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Vote, Calendar, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { votingService } from "../services/votingService";
import { Card } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";

export default function VoteHistoryPage() {
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["votes", "history"],
    queryFn: () => votingService.getUserVoteHistory(),
  });

  const votes = data?.votes || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Vote History</h1>
        <p className="text-surface-400 mt-1">Your voting activity across all polls</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} dark className="p-5">
              <div className="flex items-center gap-4">
                <Skeleton dark className="w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton dark className="h-4 w-48" />
                  <Skeleton dark className="h-3 w-32" />
                </div>
                <Skeleton dark className="h-8 w-20 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <ErrorState
          error={error.message}
          onRetry={() => refetch()}
          title="Failed to load vote history"
          dark
        />
      )}

      {!isLoading && !error && votes.length === 0 && (
        <EmptyState
          type="empty"
          title="No votes yet"
          description="Start participating in polls to see your voting history here."
          action={{ label: "Explore Polls", onClick: () => navigate("/dashboard") }}
          icon={Vote}
          dark
        />
      )}

      {!isLoading && !error && votes.length > 0 && (
        <div className="space-y-3">
          {votes.map((vote, index) => (
            <motion.div
              key={vote._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/polls/${vote.pollId?._id || vote.pollId}`}>
                <Card hover dark className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400 flex-shrink-0">
                      <Vote size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {vote.pollId?.title || "Unknown Poll"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-surface-500">
                          {vote.selectedOptions?.length || 0} option{(vote.selectedOptions?.length || 0) !== 1 ? "s" : ""} selected
                        </span>
                        <span className="text-xs text-surface-500">·</span>
                        <span className="text-xs text-surface-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(vote.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {vote.isAnonymous && (
                        <Badge variant="secondary" size="sm">Anonymous</Badge>
                      )}
                      <ExternalLink size={14} className="text-surface-500" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}