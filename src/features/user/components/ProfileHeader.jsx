import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Share2, Settings, UserPlus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";

function getInitials(name) {
  return (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

function ProfileStats({ stats }) {
  if (!stats) return null;

  const items = [
    { label: "Polls", value: stats.totalPollsCreated || 0 },
    { label: "Votes", value: stats.totalVotesCast || 0 },
    { label: "Comments", value: stats.totalComments || 0 },
    { label: "Followers", value: stats.followersCount || 0 },
    { label: "Following", value: stats.followingCount || 0 },
  ];

  return (
    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-surface-200/60">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <p className="text-lg font-bold text-surface-900">{item.value}</p>
          <p className="text-xs text-surface-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function ProfileHeader({
  user,
  stats,
  isOwnProfile = true,
  isFollowing = false,
  onFollow,
  onUnfollow,
  isLoadingFollow = false,
  loading = false,
  error = null,
  onRetry,
}) {
  if (loading) {
    return (
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
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-danger-600 text-sm">
          {error?.message || "Failed to load profile"}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="secondary" className="mt-3">
            Try again
          </Button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gradient-to-br from-brand-500/10 via-surface-50 to-violet-500/10 border-b border-surface-200/60"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-brand-500/5 via-transparent to-transparent" />
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-500/25 overflow-hidden">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            {user?.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-500 rounded-full border-4 border-surface-50 flex items-center justify-center">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-surface-900">
              {user?.name || "User"}
            </h1>
            <p className="text-surface-500 mt-1">
              @{user?.username || "user"}
            </p>
            {user?.bio && (
              <p className="text-sm text-surface-600 mt-2 max-w-xl">
                {user.bio}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3">
              {user?.location && (
                <span className="text-xs text-surface-500 flex items-center gap-1">
                  <Calendar size={12} /> {user.location}
                </span>
              )}
              {user?.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-600 hover:underline"
                >
                  {user.website}
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOwnProfile ? (
              <>
                <Button variant="ghost" size="sm" icon={<Share2 size={16} />} />
                {isFollowing ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onUnfollow}
                    loading={isLoadingFollow}
                  >
                    Following
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onFollow}
                    loading={isLoadingFollow}
                    icon={<UserPlus size={16} />}
                  >
                    Follow
                  </Button>
                )}
              </>
            ) : (
              <>
                <Link to="/profile/settings">
                  <Button variant="ghost" size="sm" icon={<Settings size={16} />} />
                </Link>
                <Button variant="secondary" size="sm" icon={<Share2 size={16} />} />
              </>
            )}
          </div>
        </div>

        <ProfileStats stats={stats} />
      </div>
    </motion.div>
  );
}

export default ProfileHeader;