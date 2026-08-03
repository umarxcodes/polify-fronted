import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { toast } from "sonner";

export const useUser = () => {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userService.getProfile(),
    staleTime: 60_000,
  });

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["user", "stats"],
    queryFn: () => userService.getUserStats(),
    staleTime: 60_000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload) => userService.updateProfile(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["user", "profile"] });
      const previousProfile = queryClient.getQueryData(["user", "profile"]);

      if (previousProfile) {
        queryClient.setQueryData(["user", "profile"], {
          ...previousProfile,
          ...payload,
        });
      }

      return { previousProfile };
    },
    onError: (err, _payload, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["user", "profile"], context.previousProfile);
      }
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file) => userService.uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      toast.success("Profile image updated");
    },
    onError: () => {
      toast.error("Failed to upload image");
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: () => userService.deleteProfileImage(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      toast.success("Profile image removed");
    },
    onError: () => {
      toast.error("Failed to remove image");
    },
  });

  const followMutation = useMutation({
    mutationFn: (userId) => userService.followUser(userId),
    onSuccess: () => {
      toast.success("User followed");
    },
    onError: () => {
      toast.error("Failed to follow user");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (userId) => userService.unfollowUser(userId),
    onSuccess: () => {
      toast.success("User unfollowed");
    },
    onError: () => {
      toast.error("Failed to unfollow user");
    },
  });

  const updateProfile = (payload) => updateProfileMutation.mutateAsync(payload);
  const uploadProfileImage = (file) => uploadImageMutation.mutateAsync(file);
  const deleteProfileImage = () => deleteImageMutation.mutateAsync();
  const followUser = (userId) => followMutation.mutateAsync(userId);
  const unfollowUser = (userId) => unfollowMutation.mutateAsync(userId);

  return {
    profile,
    stats,
    profileLoading,
    statsLoading,
    profileError,
    updateProfile,
    uploadProfileImage,
    deleteProfileImage,
    followUser,
    unfollowUser,
    refetchProfile,
    refetchStats,
    isUpdating: updateProfileMutation.isPending,
    isUploading: uploadImageMutation.isPending,
  };
};

export const usePublicProfile = (username) => {
  return useQuery({
    queryKey: ["user", "public", username],
    queryFn: () => userService.getPublicProfile(username),
    enabled: !!username,
    staleTime: 60_000,
  });
};

export const useBookmarks = (params = {}) => {
  return useQuery({
    queryKey: ["user", "bookmarks", params],
    queryFn: () => userService.getBookmarks(params),
    staleTime: 30_000,
  });
};

export const useUserSearch = (query, params = {}) => {
  return useQuery({
    queryKey: ["users", "search", query, params],
    queryFn: () => userService.searchUsers(query, params),
    enabled: !!query && query.length > 0,
    staleTime: 30_000,
  });
};
