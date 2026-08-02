import { motion } from "framer-motion";
import {
  Vote,
  Share2,
  Bookmark,
  TrendingUp,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { Dropdown } from "../ui/Dropdown";

function PollOption({
  option,
  percentage,
  isSelected,
  isWinner,
  onSelect,
  disabled,
  index,
  pollType,
}) {
  const isMultiple = pollType === "multiple";

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => !disabled && onSelect(option._id)}
      disabled={disabled}
      className={`
        relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300
        ${
          isSelected
            ? "border-primary-500 bg-primary-500/5"
            : "border-surface-200 hover:border-surface-300 bg-white hover:shadow-sm"
        }
        ${disabled ? "cursor-default" : "cursor-pointer"}
      `}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.2 + index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          absolute inset-0 rounded-xl origin-left
          ${isWinner ? "bg-gradient-to-r from-primary-500/10 to-primary-600/5" : "bg-surface-50"}
        `}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${isSelected ? "border-primary-500 bg-primary-500" : "border-surface-300"}
            `}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
            )}
            {isMultiple && !isSelected && (
              <div className="w-3 h-3 rounded-sm border-2 border-surface-300" />
            )}
          </div>
          <span className="text-sm font-medium text-surface-900">
            {option.text}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isWinner && (
            <Badge variant="success" size="sm" className="hidden sm:flex">
              <TrendingUp size={12} />
              Leading
            </Badge>
          )}
          <span
            className={`text-sm font-bold ${isSelected ? "text-primary-600" : "text-surface-900"}`}
          >
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-2 h-1.5 bg-surface-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            delay: 0.3 + index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`
            h-full rounded-full
            ${isWinner ? "bg-gradient-to-r from-primary-500 to-primary-600" : "bg-surface-300"}
          `}
        />
      </div>
    </motion.button>
  );
}

function PollCard({
  poll,
  index = 0,
  showDescription = false,
  selectedOption,
  voteCount,
  hasVoted,
  onVote,
  bookmarkStatus,
  onBookmark,
  onShare,
  dropdownItems,
  onToggleComments,
  commentsCount,
}) {
  const totalVotes =
    voteCount ||
    poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) ||
    1;
  const maxVotes = Math.max(
    ...(poll.options?.map((opt) => opt.votes || 0) || [1])
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card hover className="overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                fallback={poll.createdBy?.name?.[0] || "U"}
                color="brand"
                size="md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-900">
                    {poll.createdBy?.name || "Anonymous"}
                  </span>
                  {poll.isVerified && (
                    <Badge variant="primary" size="sm" dot>
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-surface-500">
                    @{poll.createdBy?.username || "user"}
                  </span>
                  <span className="text-xs text-surface-400">·</span>
                  <span className="text-xs text-surface-500">
                    {poll.timeAgo || "2h"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" size="sm">
                {poll.category || "General"}
              </Badge>
              {dropdownItems && dropdownItems.length > 0 && (
                <Dropdown
                  trigger={
                    <button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  }
                  items={dropdownItems}
                  align="right"
                />
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-surface-900 leading-tight">
              {poll.title}
            </h3>
            {showDescription && poll.description && (
              <p className="text-sm text-surface-600 mt-2 leading-relaxed">
                {poll.description}
              </p>
            )}
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="space-y-3">
            {poll.options?.map((option, idx) => {
              const percentage = hasVoted
                ? Math.round((option.votes / totalVotes) * 100)
                : 0;
              const isWinner = hasVoted && option.votes === maxVotes;
              return (
                <PollOption
                  key={option._id || idx}
                  option={option}
                  percentage={percentage}
                  isSelected={selectedOption === option._id}
                  isWinner={isWinner}
                  onSelect={onVote}
                  disabled={hasVoted}
                  index={idx}
                  pollType={poll.type}
                />
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-surface-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 transition-colors">
                <Vote size={16} />
                <span className="font-medium">
                  {totalVotes.toLocaleString()} votes
                </span>
              </button>
              {onToggleComments && (
                <button
                  onClick={onToggleComments}
                  className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span className="font-medium">
                    {commentsCount ?? poll.commentsCount ?? 0}
                  </span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onBookmark && (
                <Button
                  variant={bookmarkStatus ? "primary" : "ghost"}
                  size="sm"
                  onClick={onBookmark}
                  icon={
                    <Bookmark
                      size={16}
                      fill={bookmarkStatus ? "currentColor" : "none"}
                    />
                  }
                />
              )}
              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  icon={<Share2 size={16} />}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export { PollOption, PollCard };
export default PollCard;