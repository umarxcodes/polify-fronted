import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { organizationService } from "../services/organizationService";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Dialog } from "../../../components/ui/Dialog";
import { Input } from "../../../components/ui/Input";
import { toast } from "sonner";

export default function OrganizationDetailPage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["organization", slug],
    queryFn: async () => organizationService.getOrganization(slug),
  });

  const inviteMutation = useMutation({
    mutationFn: ({ slug, email, role }) => organizationService.inviteMember(slug, { email, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", slug] });
      toast.success("Member invited");
      setInviteOpen(false);
      setInviteEmail("");
    },
    onError: () => toast.error("Failed to invite member"),
  });

  const removeMutation = useMutation({
    mutationFn: ({ slug, userId }) => organizationService.removeMember(slug, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", slug] });
      toast.success("Member removed");
    },
    onError: () => toast.error("Failed to remove member"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ slug, userId, role }) => organizationService.updateMemberRole(slug, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization", slug] });
      toast.success("Role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const org = data?.organization || {};
  const members = data?.members || [];

  const getRoleVariant = (role) => {
    switch (role) {
      case "owner": return "danger";
      case "admin": return "warning";
      default: return "secondary";
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/organizations">
            <Button variant="ghost" icon={<ArrowLeft size={16} />}>Back</Button>
          </Link>
        </div>
        <Card dark className="p-12 text-center">
          <p className="text-sm text-surface-400 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="secondary">Try again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/organizations">
          <Button variant="ghost" icon={<ArrowLeft size={16} />}>Back</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton dark className="h-32 w-full rounded-2xl" />
          <Skeleton dark className="h-64 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <Card dark className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{org.name}</h1>
                <p className="text-surface-400 mt-1">@{org.slug}</p>
                {org.description && (
                  <p className="text-sm text-surface-500 mt-2 max-w-2xl">{org.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" icon={<Users size={16} />}>
                  {members.length} Members
                </Button>
              </div>
            </div>
          </Card>

          <Card dark className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Members</h3>
              <Button onClick={() => setInviteOpen(true)} variant="ghost" size="sm" icon={<UserPlus size={16} />}>
                Invite
              </Button>
            </div>
            {members.length > 0 ? (
              <div className="divide-y divide-surface-800">
                {members.map((member, index) => (
                  <motion.div
                    key={member.userId?._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={member.userId?.profileImage}
                        fallback={member.userId?.name?.split(" ").map(n => n[0]).join("") || "U"}
                        size="sm"
                        color="brand"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{member.userId?.name || "Unknown"}</p>
                        <p className="text-xs text-surface-500">@{member.userId?.username || "unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleVariant(member.role)} size="sm">
                        {member.role}
                      </Badge>
                      {member.role !== "owner" && (
                        <Dropdown
                          align="right"
                          width={160}
                          trigger={
                            <button className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors">
                              <Settings size={14} />
                            </button>
                          }
                          items={[
                            { label: "Make Admin", onClick: () => roleMutation.mutate({ slug, userId: member.userId?._id, role: "admin" }) },
                            { label: "Make Member", onClick: () => roleMutation.mutate({ slug, userId: member.userId?._id, role: "member" }) },
                            { label: "Remove", onClick: () => removeMutation.mutate({ slug, userId: member.userId?._id }), danger: true },
                          ]}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-400 text-center py-8">No members yet.</p>
            )}
          </Card>
        </>
      )}

      <Dialog isOpen={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Member">
        <form onSubmit={(e) => { e.preventDefault(); inviteMutation.mutate({ slug, email: inviteEmail, role: inviteRole }); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Email</label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="member@example.com"
              required
              dark
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-surface-800 border border-surface-700 text-sm text-surface-100 outline-none focus:border-brand-500"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button type="submit" loading={inviteMutation.isPending}>Invite</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
