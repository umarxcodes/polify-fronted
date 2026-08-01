import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  Calendar,
  Share2,
  UserPlus,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useUser } from "../hooks/useUser";

function ProfileHeader({ user, stats, isFollowing, onFollow, onUnfollow, isLoadingFollow }) {
  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="relative bg-gradient-to-br from-brand-500/10 via-surface-50 to-violet-500/10 border-b border-surface-200/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-brand-500/5 via-transparent to-transparent" />
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-500/25 overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            {user?.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-500 rounded-full border-4 border-surface-50 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-surface-900">{user?.name || "User"}</h1>
            <p className="text-surface-500 mt-1">@{user?.username || "user"}</p>
            {user?.bio && <p className="text-sm text-surface-600 mt-2 max-w-xl">{user.bio}</p>}
            <div className="flex items-center gap-4 mt-3">
              {user?.location && (
                <span className="text-xs text-surface-500 flex items-center gap-1">
                  <Calendar size={12} /> {user.location}
                </span>
              )}
              {user?.website && (
                <a href={user.website} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:underline">
                  {user.website}
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<Share2 size={16} />} />
            {isFollowing ? (
              <Button variant="secondary" size="sm" onClick={onUnfollow} loading={isLoadingFollow}>
                Following
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={onFollow} loading={isLoadingFollow} icon={<UserPlus size={16} />}>
                Follow
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-surface-200/60">
          <Link to={`/profile/${user?.username}/followers`} className="text-center hover:opacity-80 transition-opacity">
            <p className="text-lg font-bold text-surface-900">{stats?.followersCount || 0}</p>
            <p className="text-xs text-surface-500">Followers</p>
          </Link>
          <Link to={`/profile/${user?.username}/following`} className="text-center hover:opacity-80 transition-opacity">
            <p className="text-lg font-bold text-surface-900">{stats?.followingCount || 0}</p>
            <p className="text-xs text-surface-500">Following</p>
          </Link>
          <div className="text-center">
            <p className="text-lg font-bold text-surface-900">{stats?.totalPollsCreated || 0}</p>
            <p className="text-xs text-surface-500">Polls</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-surface-900">{stats?.totalVotesCast || 0}</p>
            <p className="text-xs text-surface-500">Votes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  const { username } = useParams();
  const { followUser, unfollowUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["user", "public", username],
    queryFn: () => apiClient.get(`/users/${username}`).then((r) => r.data?.data?.user || r.data?.user || r.data),
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

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="relative bg-gradient-to-br from-brand-500/10 via-surface-50 to-violet-500/10 border-b border-surface-200/60">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-end gap-6">
              <Skeleton className="w-24 h-24 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-danger-600">{profileError?.message || "User not found"}</p>
        <Link to="/dashboard"><Button className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <ProfileHeader
        user={profile}
        stats={stats}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        isLoadingFollow={isLoadingFollow}
      />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">About</h3>
            <p className="text-sm text-surface-600">{profile?.bio || "No bio yet."}</p>
            <div className="mt-4 space-y-2">
              {profile?.location && (
                <p className="text-sm text-surface-500"><span className="font-medium">Location:</span> {profile.location}</p>
              )}
              {profile?.website && (
                <p className="text-sm text-surface-500"><span className="font-medium">Website:</span> {profile.website}</p>
              )}
            </div>
          </Card>
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Activity</h3>
            <p className="text-sm text-surface-500">User activity will appear here.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
