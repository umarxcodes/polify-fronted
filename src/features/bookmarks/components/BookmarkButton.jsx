import { motion } from "framer-motion";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useBookmarkStatus } from "../hooks/useBookmarks";
import { useBookmarks } from "../hooks/useBookmarks";
import { toast } from "sonner";

export default function BookmarkButton({ pollId, size = "sm", variant = "ghost" }) {
  const { data, isLoading: statusLoading } = useBookmarkStatus(pollId);
  const isBookmarked = data?.saved || false;

  const { addBookmark, removeBookmark, isAdding, isRemoving } = useBookmarks();

  const isLoading = statusLoading || isAdding || isRemoving;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    try {
      if (isBookmarked) {
        await removeBookmark(pollId);
        toast.success("Removed from bookmarks");
      } else {
        await addBookmark(pollId);
        toast.success("Added to bookmarks");
      }
    } catch (error) {
      toast.error("Action failed", { description: error.message });
    }
  };

  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Button
        variant={isBookmarked ? "primary" : variant}
        size={size}
        icon={
          isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Bookmark
              size={16}
              fill={isBookmarked ? "currentColor" : "none"}
            />
          )
        }
        onClick={handleClick}
        className={isBookmarked ? "text-brand-600" : ""}
        aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
        disabled={isLoading}
      />
    </motion.div>
  );
}
