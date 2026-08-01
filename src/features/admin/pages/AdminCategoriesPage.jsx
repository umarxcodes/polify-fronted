import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  Plus,
  Edit,
  FolderOpen,
} from "lucide-react";
import { apiClient } from "../../../lib/axios";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Badge } from "../../../components/ui/Badge";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Input } from "../../../components/ui/Input";
import { Dialog } from "../../../components/ui/Dialog";
import { toast } from "sonner";

const unwrap = (response) => response.data?.data || response.data;

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "categories", search],
    queryFn: async () => {
      const params = { limit: 100 };
      if (search) params.search = search;
      const response = await apiClient.get("/admin/categories", { params });
      return unwrap(response);
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => unwrap(apiClient.post("/admin/categories", payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category created");
      closeDialog();
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => unwrap(apiClient.patch(`/admin/categories/${id}`, payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category updated");
      closeDialog();
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.delete(`/admin/categories/${id}`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category deleted");
    },
    onError: () => toast.error("Failed to delete category"),
  });

  const restoreMutation = useMutation({
    mutationFn: (id) => unwrap(apiClient.patch(`/admin/categories/${id}/restore`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category restored");
    },
    onError: () => toast.error("Failed to restore category"),
  });

  const categories = data?.categories || [];

  const openCreateDialog = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setName(category.name || "");
    setDescription(category.description || "");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setName("");
    setDescription("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, description };
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Categories</h1>
          <p className="text-surface-400 mt-1">Manage poll categories</p>
        </div>
        <Button onClick={openCreateDialog} icon={<Plus size={16} />}>
          Add Category
        </Button>
      </div>

      <Card dark className="p-4">
        <div className="max-w-md">
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </Card>

      <Card dark className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton dark className="w-10 h-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton dark className="h-4 w-48" />
                  <Skeleton dark className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-sm text-surface-400 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="secondary">Try again</Button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-surface-500 mx-auto mb-3">
              <FolderOpen size={24} />
            </div>
            <h3 className="text-lg font-semibold text-surface-200 mb-1">No categories found</h3>
            <p className="text-sm text-surface-400">Create your first category to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-800">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between p-4 hover:bg-surface-800/50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400 flex-shrink-0">
                    <FolderOpen size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{category.name}</p>
                    <p className="text-xs text-surface-500 truncate">{category.description || "No description"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={category.isActive !== false ? "success" : "secondary"} size="sm" dot>
                    {category.isActive !== false ? "Active" : "Inactive"}
                  </Badge>
                  <Dropdown
                    align="right"
                    width={160}
                    trigger={
                      <button className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    }
                    items={[
                      { label: "Edit", icon: Edit, onClick: () => openEditDialog(category) },
                      ...(category.isActive !== false
                        ? [{ label: "Delete", icon: Trash2, onClick: () => deleteMutation.mutate(category._id), danger: true }]
                        : [{ label: "Restore", icon: RotateCcw, onClick: () => restoreMutation.mutate(category._id) }]),
                    ]}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog isOpen={dialogOpen} onClose={closeDialog} title={editingCategory ? "Edit Category" : "Create Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
              dark
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-sm text-white placeholder:text-surface-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeDialog}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
