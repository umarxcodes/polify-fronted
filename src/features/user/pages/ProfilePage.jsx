import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

function ProfileHeader({ user }) {
  if (!user) return null;
  const initials = (user.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className="relative bg-gradient-to-br from-brand-500/10 via-surface-50 to-violet-500/10 border-b border-surface-200/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/5 via-transparent to-transparent" />
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-end gap-6">
          <div className="relative" style={{ animation: "scaleIn 0.4s ease-out" }}>
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-500/25">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-500 rounded-full border-4 border-surface-50" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-surface-900" style={{ animation: "fadeInUp 0.4s ease-out 0.1s both" }}>
              {user.name || "User"}
            </h1>
            <p className="text-surface-500 mt-1" style={{ animation: "fadeInUp 0.4s ease-out 0.15s both" }}>
              @{user.username || "user"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get("/users/me");
      return data?.data || data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="relative bg-gradient-to-br from-brand-500/10 via-surface-50 to-violet-500/10 border-b border-surface-200/60">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 rounded-2xl bg-surface-200 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-48 bg-surface-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-surface-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-500 mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-1">Failed to load profile</h3>
        <p className="text-sm text-surface-500 mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <ProfileHeader user={user} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">About</h3>
            <p className="text-sm text-surface-600">{user?.bio || "No bio yet."}</p>
            <div className="mt-4 space-y-2">
              {user?.location && (
                <p className="text-sm text-surface-500"><span className="font-medium">Location:</span> {user.location}</p>
              )}
              {user?.website && (
                <p className="text-sm text-surface-500"><span className="font-medium">Website:</span> {user.website}</p>
              )}
            </div>
          </Card>
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-surface-900">{user?.stats?.polls || 0}</p>
                <p className="text-sm text-surface-500">Polls</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-surface-900">{user?.stats?.votes || 0}</p>
                <p className="text-sm text-surface-500">Votes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-surface-900">{user?.stats?.followers || 0}</p>
                <p className="text-sm text-surface-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-surface-900">{user?.stats?.following || 0}</p>
                <p className="text-sm text-surface-500">Following</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
