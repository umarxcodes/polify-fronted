import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  ExternalLink,
  Trash2,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { organizationService } from "../services/organizationService";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Input } from "../../../components/ui/Input";
import { Dialog } from "../../../components/ui/Dialog";
import { toast } from "sonner";

export default function OrganizationsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["organizations", search, page],
    queryFn: async () => {
      const response = await organizationService.getOrganizations({ page, limit: 20, search });
      return response;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => organizationService.createOrganization(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created");
      closeDialog();
    },
    onError: () => toast.error("Failed to create organization"),
  });

  const deleteMutation = useMutation({
    mutationFn: (slug) => organizationService.deleteOrganization(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization deleted");
    },
    onError: () => toast.error("Failed to delete organization"),
  });

  const organizations = data?.organizations || [];

  const openCreateDialog = () => {
    setName("");
    setSlug("");
    setDescription("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setName("");
    setSlug("");
    setDescription("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      description,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Organizations</h1>
          <p className="text-surface-400 mt-1">Manage your teams and organizations</p>
        </div>
        <Button onClick={openCreateDialog} icon={<Plus size={16} />}>
          Create Organization
        </Button>
      </div>

      <Card dark className="p-4">
        <div className="max-w-md">
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={<Search size={16} />}
          />
        </div>
      </Card>

      <Card dark className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton dark className="w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton dark className="h-4 w-48" />
                  <Skeleton dark className="h-3 w-32" />
                </div>
                <Skeleton dark className="h-8 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-sm text-surface-400 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="secondary">Try again</Button>
          </div>
        ) : organizations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-3">
              <Building2 size={24} />
            </div>
            <h3 className="text-lg font-semibold text-surface-200 mb-1">No organizations found</h3>
            <p className="text-sm text-surface-400">Create your first organization to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-800">
            {organizations.map((org, index) => (
              <motion.div
                key={org._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-4 hover:bg-surface-800/50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400 flex-shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{org.name}</p>
                    <p className="text-xs text-surface-500 truncate">@{org.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={org.isActive !== false ? "success" : "secondary"} size="sm" dot>
                    {org.isActive !== false ? "Active" : "Inactive"}
                  </Badge>
                  <Link to={`/organizations/${org.slug}`}>
                    <Button variant="ghost" size="sm" icon={<ExternalLink size={14} />}>
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 size={14} />}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this organization?")) {
                        deleteMutation.mutate(org.slug);
                      }
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <Dialog isOpen={dialogOpen} onClose={closeDialog} title="Create Organization">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization name"
              required
              dark
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Slug</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="organization-slug"
              required
              dark
            />
            <p className="text-xs text-surface-500 mt-1">Lowercase letters, numbers, and hyphens only.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-sm text-white placeholder:text-surface-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeDialog}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Create</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
