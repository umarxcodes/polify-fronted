import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function CommentInput({ onSubmit, placeholder = "Write a comment...", disabled = false, autoFocus = false }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting || disabled) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1"
        autoFocus={autoFocus}
        disabled={disabled || isSubmitting}
      />
      <Button
        type="submit"
        size="sm"
        icon={
          isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )
        }
        disabled={!content.trim() || disabled || isSubmitting}
      >
        {isSubmitting ? "Posting..." : "Post"}
      </Button>
    </form>
  );
}
