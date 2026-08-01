import { motion } from "framer-motion";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useBookmarkStatus } from "../hooks/useBookmarks";

export default function BookmarkButton({ pollId, size = "sm", variant = "ghost" }) {
  const { data, isLoading } = useBookmarkStatus(pollId);
  const isBookmarked = data?.saved || false;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Button
        variant={variant}
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
      />
    </motion.div>
  );
}
