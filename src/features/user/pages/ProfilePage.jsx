import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { ProfileHeader } from "../components/ProfileHeader";

export default function ProfilePage() {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => apiClient.get("/users/me").then((r) => r.data?.data || r.data),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["user", "stats"],
    queryFn: () => apiClient.get("/users/stats").then((r) => r.data?.data || r.data),
  });

  const isLoading = profileLoading || statsLoading;

  return (
    <div className="min-h-screen bg-surface-50">
      <ProfileHeader
        user={profile}
        stats={stats?.stats}
        isOwnProfile
        loading={isLoading}
        error={profileError}
        onRetry={() => window.location.reload()}
      />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">About</h3>
            <p className="text-sm text-surface-600">
              {profile?.bio || "No bio yet."}
            </p>
            <div className="mt-4 space-y-2">
              {profile?.location && (
                <p className="text-sm text-surface-500">
                  <span className="font-medium">Location:</span> {profile.location}
                </p>
              )}
              {profile?.website && (
                <p className="text-sm text-surface-500">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    {profile.website}
                  </a>
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}