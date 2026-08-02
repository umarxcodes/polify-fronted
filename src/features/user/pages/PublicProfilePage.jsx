import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { ProfileHeader } from "../components/ProfileHeader";
import { useUser } from "../hooks/useUser";

export default function PublicProfilePage() {
  const { username } = useParams();
  const { followUser, unfollowUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["user", "public", username],
    queryFn: () =>
      apiClient
        .get(`/users/${username}`)
        .then((r) => r.data?.data?.user || r.data?.user || r.data),
    enabled: !!username,
  });

  const { data: stats } = useQuery({
    queryKey: ["user", "stats", username],
    queryFn: async () => {
      const res = await apiClient.get("/users/stats");
      return res.data?.data?.stats || res.data?.stats || {};
    },
  });

  const handleFollow = async () => {
    if (!profile?._id) return;
    setIsLoadingFollow(true);
    try {
      await followUser(profile._id);
      setIsFollowing(true);
    } catch {
      // handled
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    if (!profile?._id) return;
    setIsLoadingFollow(true);
    try {
      await unfollowUser(profile._id);
      setIsFollowing(false);
    } catch {
      // handled
    } finally {
      setIsLoadingFollow(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <ProfileHeader
        user={profile}
        stats={stats}
        isOwnProfile={false}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        isLoadingFollow={isLoadingFollow}
        loading={profileLoading}
        error={profileError}
        onRetry={() => window.location.reload()}
      />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">About</h3>
              <p className="text-sm text-surface-600">
                {profile?.bio || "No bio yet."}
              </p>
              <div className="mt-4 space-y-2">
                {profile?.location && (
                  <p className="text-sm text-surface-500">
                    <span className="font-medium">Location:</span>{" "}
                    {profile.location}
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
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Activity</h3>
              <p className="text-sm text-surface-500">
                User activity will appear here.
              </p>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}