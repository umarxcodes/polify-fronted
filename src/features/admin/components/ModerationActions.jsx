import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";

const MODERATION_ACTIONS = [
  { value: "no_action", label: "No Action", description: "Mark as resolved without taking action" },
  { value: "delete_poll", label: "Delete Poll", description: "Remove the reported poll" },
  { value: "delete_comment", label: "Delete Comment", description: "Remove the reported comment" },
  { value: "suspend_user", label: "Suspend User", description: "Temporarily suspend the reported user" },
  { value: "warn_user", label: "Warn User", description: "Send a warning to the reported user" },
  { value: "ban_user", label: "Ban User", description: "Permanently ban the reported user" },
  { value: "restore_content", label: "Restore Content", description: "Restore previously deleted content" },
];

export default function ModerationActions({ isOpen, onClose, report, onAction, loading = false }) {
  const [action, setAction] = useState("no_action");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState("select");

  const handleSubmit = () => {
    onAction({ action, notes });
    setNotes("");
    setAction("no_action");
    setStep("select");
  };

  const handleClose = () => {
    setNotes("");
    setAction("no_action");
    setStep("select");
    onClose();
  };

  if (!isOpen || !report) return null;

  const getActionTitle = () => {
    if (step === "confirm") return "Confirm Action";
    if (report.status === "pending") return "Take Action";
    return "Update Report";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-surface-700">
                <h3 className="text-lg font-semibold text-white">{getActionTitle()}</h3>
                <button onClick={handleClose} className="p-1 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {step === "select" ? (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-surface-300 mb-2">Moderation Action</label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {MODERATION_ACTIONS.map((opt) => (
                          <label
                            key={opt.value}
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                              action === opt.value
                                ? "border-primary-500 bg-primary-500/10"
                                : "border-surface-700 hover:border-surface-600"
                            }`}
                          >
                            <input
                              type="radio"
                              name="action"
                              value={opt.value}
                              checked={action === opt.value}
                              onChange={(e) => setAction(e.target.value)}
                              className="mt-1 w-4 h-4 text-primary-500"
                            />
                            <div>
                              <p className="text-sm font-medium text-white">{opt.label}</p>
                              <p className="text-xs text-surface-400">{opt.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-300 mb-1.5">Admin Notes</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add moderation notes..."
                        rows={3}
                        dark
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-700/50">
                      <p className="text-sm text-surface-300">You are about to:</p>
                      <p className="text-white font-medium mt-1">
                        {MODERATION_ACTIONS.find((a) => a.value === action)?.label}
                      </p>
                      {notes && (
                        <div className="mt-2">
                          <p className="text-xs text-surface-400">Notes:</p>
                          <p className="text-sm text-surface-200">{notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-surface-700">
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                {step === "select" ? (
                  <Button onClick={() => setStep("confirm")} disabled={!action || loading}>
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} loading={loading}>
                    Confirm Action
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
