import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Settings, Save, Globe, Bell } from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Switch } from "../../../components/ui/Switch";
import { toast } from "sonner";

const unwrap = (response) => response.data?.data || response.data;

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    siteName: "Pollify",
    siteDescription: "Create and vote on polls",
    allowRegistration: true,
    requireEmailVerification: true,
    maxPollsPerUser: 50,
    maxOptionsPerPoll: 10,
    pollExpiryDays: 30,
    maintenanceMode: false,
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => unwrap(apiClient.patch("/admin/settings", payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Settings updated successfully");
    },
    onError: () => toast.error("Failed to update settings"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(settings);
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-surface-400 mt-1">Manage platform configuration</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <Card dark className="p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">General</h3>
                <p className="text-sm text-surface-400">Platform information</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Site Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  dark
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleChange("siteDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-sm text-white placeholder:text-surface-500 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card dark className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-500/20 to-success-600/10 flex items-center justify-center text-success-400">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Configuration</h3>
                  <p className="text-sm text-surface-400">Platform limits</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Max Polls Per User</label>
                  <Input
                    type="number"
                    value={settings.maxPollsPerUser}
                    onChange={(e) => handleChange("maxPollsPerUser", parseInt(e.target.value) || 0)}
                    dark
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Max Options Per Poll</label>
                  <Input
                    type="number"
                    value={settings.maxOptionsPerPoll}
                    onChange={(e) => handleChange("maxOptionsPerPoll", parseInt(e.target.value) || 0)}
                    dark
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Default Poll Expiry (Days)</label>
                  <Input
                    type="number"
                    value={settings.pollExpiryDays}
                    onChange={(e) => handleChange("pollExpiryDays", parseInt(e.target.value) || 0)}
                    dark
                  />
                </div>
              </div>
            </Card>

            <Card dark className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning-500/20 to-warning-600/10 flex items-center justify-center text-warning-400">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Features</h3>
                  <p className="text-sm text-surface-400">Toggle features</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-300">Allow Registration</span>
                  <Switch
                    checked={settings.allowRegistration}
                    onChange={(e) => handleChange("allowRegistration", e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-300">Require Email Verification</span>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onChange={(e) => handleChange("requireEmailVerification", e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-300">Maintenance Mode</span>
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => setSettings({
            siteName: "Pollify",
            siteDescription: "Create and vote on polls",
            allowRegistration: true,
            requireEmailVerification: true,
            maxPollsPerUser: 50,
            maxOptionsPerPoll: 10,
            pollExpiryDays: 30,
            maintenanceMode: false,
          })}>Reset</Button>
          <Button type="submit" loading={updateMutation.isPending} icon={<Save size={16} />}>
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
