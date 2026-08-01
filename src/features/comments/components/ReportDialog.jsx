import { useState } from "react";
import { motion } from "framer-motion";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "abuse", label: "Abuse" },
  { value: "hate_speech", label: "Hate Speech" },
  { value: "other", label: "Other" },
];

export default function ReportDialog({ isOpen, onClose, onSubmit, isReporting }) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    onSubmit({ reason });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <Flag size={20} className="text-danger-500" />
          <h3 className="text-lg font-semibold text-surface-900">Report Comment</h3>
        </div>
        <p className="text-sm text-surface-500 mb-4">
          Please select a reason for reporting this comment.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            {REASONS.map((r) => (
              <label
                key={r.value}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  reason === r.value
                    ? "border-brand-500 bg-brand-50"
                    : "border-surface-200 hover:border-surface-300"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-brand-600"
                />
                <span className="text-sm font-medium text-surface-900">
                  {r.label}
                </span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
              disabled={isReporting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              className="flex-1"
              disabled={!reason || isReporting}
              icon={
                isReporting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Flag size={16} />
                )
              }
            >
              {isReporting ? "Submitting..." : "Report"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
