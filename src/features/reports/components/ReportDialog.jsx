import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";
import { Dialog } from "../../../components/ui/Dialog";

const REASONS = [
  { value: "spam", label: "Spam", description: "Unsolicited or repetitive content" },
  { value: "harassment", label: "Harassment", description: "Targeted attacks or bullying" },
  { value: "hate_speech", label: "Hate Speech", description: "Discriminatory or offensive language" },
  { value: "misinformation", label: "Misinformation", description: "False or misleading information" },
  { value: "inappropriate_content", label: "Inappropriate Content", description: "Adult or explicit content" },
  { value: "copyright", label: "Copyright Violation", description: "Unauthorized use of copyrighted material" },
  { value: "fake_account", label: "Fake Account", description: "Impersonation or fake profile" },
  { value: "scam", label: "Scam or Fraud", description: "Deceptive or fraudulent content" },
  { value: "other", label: "Other", description: "Other violation not listed above" },
];

export default function ReportDialog({ isOpen, onClose, onSubmit, isReporting = false, targetType = "content" }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    onSubmit({ reason, description, targetType });
  };

  const handleClose = () => {
    setReason("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} title={`Report ${targetType}`} dark>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">
            Why are you reporting this {targetType}?
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {REASONS.map((r) => (
              <label
                key={r.value}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  reason === r.value
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-surface-700 hover:border-surface-600"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-4 h-4 text-primary-500"
                />
                <div>
                  <p className="text-sm font-medium text-white">{r.label}</p>
                  <p className="text-xs text-surface-400">{r.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Additional Details (optional)
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more context about this report..."
            rows={3}
            maxLength={500}
            dark
          />
          <p className="text-xs text-surface-500 mt-1">{description.length}/500</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isReporting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" disabled={!reason || isReporting} icon={isReporting ? <Loader2 size={16} className="animate-spin" /> : <Flag size={16} />}>
            {isReporting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
