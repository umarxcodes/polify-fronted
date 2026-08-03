import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bookmark,
  Share2,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { pollService } from "../services/pollService";
import { useBookmarkStatus, useBookmarks } from "../../bookmarks/hooks/useBookmarks";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Skeleton, SkeletonList } from "../../../components/ui/Skeleton";
import { PollCard } from "../../../components/cards/PollCard";
import { toast } from "sonner";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export default function PollFeedPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("latest");

  const {
    data: polls = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["polls", filter],
    queryFn: async () => {
      const response = await pollService.getAllPolls({ filter });
      const body = response.data;
      const received = body?.data?.polls || body?.polls || [];
      return received;
    },
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
        <SkeletonList count={3} />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-3xl mx-auto"
      >
        <EmptyState
          type="error"
          title="Failed to load polls"
          description={error.message}
          action={{ label: "Try again", onClick: () => refetch() }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Poll Feed</h2>
          <p className="text-surface-500 mt-1">
            Discover and vote on community polls
          </p>
        </div>
        <Link to="/polls/create">
          <Button variant="primary" icon={<Plus size={18} />}>
            Create Poll
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {["latest", "trending", "ending-soon", "popular"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${
                filter === f
                  ? "bg-primary-500 text-white shadow-sm shadow-primary-500/25"
                  : "bg-white text-surface-600 border border-surface-200 hover:border-surface-300"
              }
            `}
          >
            {f === "latest"
              ? "Latest"
              : f === "trending"
                ? "Trending"
                : f === "ending-soon"
                  ? "Ending Soon"
                  : "Popular"}
          </button>
        ))}
      </div>

      {polls.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {polls.map((poll, idx) => (
            <PollCardWrapper
              key={poll._id || idx}
              poll={poll}
              index={idx}
            />
          ))}
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <EmptyState
            type="empty"
            title="No polls yet"
            description="Be the first to create a poll!"
            action={{
              label: "Create Poll",
              onClick: () => navigate("/polls/create"),
            }}
          />
        </Card>
      )}
    </motion.div>
  );
}

function PollCardWrapper({ poll, index }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(poll.totalVotes || 0);
  const [showComments, setShowComments] = useState(false);

  const { data: bookmarkData } = useBookmarkStatus(poll._id);
  const isBookmarked = bookmarkData?.saved || false;

  const { addBookmark, removeBookmark } = useBookmarks();

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark(poll._id);
        toast.success("Removed from bookmarks");
      } else {
        await addBookmark(poll._id);
        toast.success("Added to bookmarks");
      }
    } catch (error) {
      toast.error("Action failed", { description: error.message });
    }
  };

  const handleVote = async (optionId) => {
    if (hasVoted) return;

    try {
      await pollService.vote(poll._id, optionId);
      setSelectedOption(optionId);
      setHasVoted(true);
      setVoteCount((prev) => prev + 1);
      toast.success("Vote recorded!", {
        description: "Your vote has been counted.",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Voting failed", {
        description: error.response?.data?.message || error.message || "Please try again.",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/polls/${poll._id}`
      );
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const menuItems = [
    { label: "Save poll", icon: Bookmark, onClick: handleBookmark },
    { label: "Share", icon: Share2, onClick: handleShare },
    { label: "Report", icon: MoreHorizontal, onClick: () => {} },
  ];

  return (
    <PollCard
      poll={poll}
      index={index}
      onVote={handleVote}
      hasVoted={hasVoted}
      selectedOption={selectedOption}
      voteCount={voteCount}
      bookmarkStatus={isBookmarked}
      onBookmark={handleBookmark}
      onShare={handleShare}
      dropdownItems={menuItems}
      onToggleComments={() => setShowComments(!showComments)}
      commentsCount={poll.commentsCount}
    />
  );
}