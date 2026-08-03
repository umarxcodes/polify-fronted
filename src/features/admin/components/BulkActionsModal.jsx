import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckSquare } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

const BULK_ACTIONS = [
  { value: "resolved", label: "Resolve Selected", variant: "success", icon: "CheckCircle2" },
  { value: "rejected", label: "Dismiss Selected", variant: "danger", icon: "XCircle" },
];

export default function BulkActionsModal({ isOpen, onClose, selectedIds, onBulkAction, loading = false }) {
  const [selectedAction, setSelectedAction] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const handleSubmit = () => {
    if (!selectedAction || selectedIds.length === 0) return;
    onBulkAction({ action: selectedAction, reportIds: selectedIds, adminNotes });
    setSelectedAction("");
    setAdminNotes("");
  };

  const handleClose = () => {
    setSelectedAction("");
    setAdminNotes("");
    onClose();
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
            <div className="bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-surface-700">
                <div className="flex items-center gap-2">
                  <CheckSquare size={20} className="text-primary-400" />
                  <h3 className="text-lg font-semibold text-white">Bulk Actions</h3>
                </div>
                <button onClick={handleClose} className="p-1 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="lg">{selectedIds.length} reports selected</Badge>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-surface-300 mb-2">Select Action</label>
                  {BULK_ACTIONS.map((act) => (
                    <label
                      key={act.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAction === act.value
                          ? "border-primary-500 bg-primary-500/10"
                          : "border-surface-700 hover:border-surface-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="bulkAction"
                        value={act.value}
                        checked={selectedAction === act.value}
                        onChange={(e) => setSelectedAction(e.target.value)}
                        className="w-4 h-4 text-primary-500"
                      />
                      <span className="text-sm font-medium text-white">{act.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Admin Notes (optional)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for this bulk action..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-surface-700 border border-surface-600 text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-surface-700">
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAction || loading}
                  loading={loading}
                  variant={selectedAction === "rejected" ? "danger" : "primary"}
                >
                  Apply Action
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
