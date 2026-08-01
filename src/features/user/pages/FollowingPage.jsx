import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, ArrowLeft } from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Avatar } from "../../../components/ui/Avatar";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useParams } from "react-router-dom";

export default function FollowingPage() {
  const { username } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "following", username],
    queryFn: async () => {
      const userRes = await apiClient.get(`/users/${username}`);
      const userId = userRes.data?.data?.user?._id || userRes.data?.user?._id;
      const { data } = await apiClient.get(`/follow/${userId}/following`);
      return data?.data || data;
    },
    enabled: !!username,
  });

  const users = data?.users || [];

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${username}`}><Button variant="ghost" size="sm" icon={<ArrowLeft size={18} />}>Back</Button></Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Following</h1>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} dark className="p-4 flex items-center gap-4">
              <Skeleton dark className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton dark className="h-4 w-32" />
                <Skeleton dark className="h-3 w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-danger-500">{error.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Try again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${username}`}><Button variant="ghost" size="sm" icon={<ArrowLeft size={18} />}>Back</Button></Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Following</h1>
          <p className="text-surface-400 mt-1">People @{username} follows</p>
        </div>
      </div>

      <Card dark className="p-6">
        {users.length > 0 ? (
          <div className="space-y-3">
            {users.map((u, index) => (
              <motion.div
                key={u._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/profile/${u.username}`}>
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-800 transition-colors">
                    <Avatar fallback={u.name?.[0] || "U"} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{u.name}</p>
                      <p className="text-xs text-surface-500">@{u.username}</p>
                    </div>
                    {u.isVerified && <Badge variant="primary" size="sm" dot>Verified</Badge>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto text-surface-500 mb-3" size={32} />
            <p className="text-sm text-surface-400">Not following anyone yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
