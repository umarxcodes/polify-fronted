import { motion } from "framer-motion";
import { TrendingUp, Trophy } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";

function VoteResultBar({ option, percentage, isWinner, totalVotes, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-surface-900 truncate">
            {option.text}
          </span>
          {isWinner && totalVotes > 0 && (
            <Badge variant="success" size="sm" dot className="hidden sm:flex">
              <TrendingUp size={12} />
              Leading
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-bold text-surface-900">
            {percentage}%
          </span>
          <span className="text-xs text-surface-500">
            ({option.votes?.toLocaleString() || 0})
          </span>
        </div>
      </div>
      <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isWinner
              ? "bg-gradient-to-r from-brand-500 to-brand-600"
              : "bg-surface-300"
          }`}
        />
      </div>
    </motion.div>
  );
}

export default function VoteResults({
  options = [],
  totalVotes = 0,
  pollType = "single",
  hasVoted = false,
  isLoading = false,
}) {
  const maxVotes = Math.max(...(options.map((opt) => opt.votes || 0) || [1]));

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-32 bg-surface-200 rounded animate-pulse" />
            <div className="h-3 w-full bg-surface-100 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!options || options.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-surface-500">No options available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-brand-500" />
          <span className="text-sm font-semibold text-surface-900">
            {totalVotes.toLocaleString()} total votes
          </span>
        </div>
        {pollType === "multiple" && (
          <Badge variant="secondary" size="sm">
            Multiple choice
          </Badge>
        )}
        {pollType === "anonymous" && (
          <Badge variant="secondary" size="sm">
            Anonymous
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {options.map((option, index) => {
          const percentage =
            totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isWinner = option.votes === maxVotes && totalVotes > 0;

          return (
            <VoteResultBar
              key={option.optionId || index}
              option={option}
              percentage={percentage}
              isWinner={isWinner}
              totalVotes={totalVotes}
              index={index}
            />
          );
        })}
      </div>

      {!hasVoted && (
        <div className="pt-4 border-t border-surface-200">
          <p className="text-sm text-surface-500 mb-3">
            Select an option to cast your vote
          </p>
        </div>
      )}
    </div>
  );
}
