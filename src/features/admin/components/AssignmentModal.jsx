import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Avatar } from "../../../components/ui/Avatar";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { toast } from "sonner";

const unwrap = (response) => response.data?.data || response.data;

export default function AssignmentModal({ isOpen, onClose, reportId, onAssigned }) {
  const [search, setSearch] = useState("");
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchModerators = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/users", {
        params: { role: "admin", limit: 50 },
      });
      const data = unwrap(response);
      setModerators(data?.users || data || []);
    } catch {
      toast.error("Failed to fetch moderators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchModerators();
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!selected) return;
    setAssigning(true);
    try {
      const response = await apiClient.patch(`/admin/reports/${reportId}/assign`, {
        moderatorId: selected._id || selected.id,
      });
      onAssigned?.(unwrap(response));
      onClose();
    } catch {
      toast.error("Failed to assign moderator");
    } finally {
      setAssigning(false);
    }
  };

  const filtered = moderators.filter((m) => {
    const term = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(term) ||
      m.username?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-surface-700">
                <h3 className="text-lg font-semibold text-white">Assign Moderator</h3>
                <button onClick={onClose} className="p-1 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Search Moderators</label>
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    icon={<Search size={16} />}
                    dark
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton dark className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton dark className="h-4 w-32 mb-1" />
                          <Skeleton dark className="h-3 w-48" />
                        </div>
                      </div>
                    ))
                  ) : filtered.length === 0 ? (
                    <p className="text-sm text-surface-400 text-center py-4">No moderators found</p>
                  ) : (
                    filtered.map((mod) => (
                      <button
                        key={mod._id || mod.id}
                        onClick={() => setSelected(mod)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          selected?._id === mod._id || selected?.id === mod.id
                            ? "border-primary-500 bg-primary-500/10"
                            : "border-surface-700 hover:border-surface-600"
                        }`}
                      >
                        <Avatar src={mod.avatar} name={mod.name} size="sm" />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-white">{mod.name}</p>
                          <p className="text-xs text-surface-400">{mod.email}</p>
                        </div>
                        {mod.role && (
                          <Badge variant={mod.role === "super_admin" ? "danger" : "info"} size="sm">
                            {mod.role.replace("_", " ")}
                          </Badge>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-surface-700">
                <Button variant="secondary" onClick={onClose} disabled={assigning}>
                  Cancel
                </Button>
                <Button onClick={handleAssign} disabled={!selected || assigning} loading={assigning}>
                  Assign
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
