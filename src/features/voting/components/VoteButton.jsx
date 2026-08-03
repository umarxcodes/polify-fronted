import { motion } from "framer-motion";
import { Vote, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export const VoteButton = ({
  onRemove,
  selectedOptionIds = [],
  pollType = "single",
  allowVoteChange = false,
  disabled = false,
  isLoading = false,
  hasVoted = false,
  className = "",
}) => {
  const isMultiple = pollType === "multiple";
  const canChange = hasVoted && allowVoteChange;

  const handleClick = () => {
    if (isLoading) return;
    if (hasVoted && !allowVoteChange) return;
  };

  const getButtonText = () => {
    if (isLoading) return "Voting...";
    if (hasVoted && !allowVoteChange) return "Voted";
    if (hasVoted && canChange) return "Change Vote";
    if (isMultiple) return `Vote (${selectedOptionIds.length} selected)`;
    return "Vote";
  };

  const getVariant = () => {
    if (hasVoted && !allowVoteChange) return "secondary";
    if (hasVoted && canChange) return "outline";
    return "default";
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          variant={getVariant()}
          size="md"
          disabled={disabled || isLoading}
          loading={isLoading}
          icon={
            isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : hasVoted && !allowVoteChange ? (
              <CheckCircle2 size={16} />
            ) : (
              <Vote size={16} />
            )
          }
          onClick={handleClick}
          className="min-w-[120px]"
        >
          {getButtonText()}
        </Button>
      </motion.div>

      {hasVoted && allowVoteChange && (
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            variant="ghost"
            size="md"
            disabled={isLoading}
            loading={isLoading}
            icon={<XCircle size={16} />}
            onClick={onRemove}
            className="text-surface-500 hover:text-danger-600"
          >
            Remove
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default VoteButton;
