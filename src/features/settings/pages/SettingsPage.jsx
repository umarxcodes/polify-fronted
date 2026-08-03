import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Trash2,
  Monitor,
  Camera,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Smartphone,
  Globe,
  Lock,
  Mail,
  Moon,
  Sun,
  MonitorSmartphone,
  Volume2,
  MessageSquare,
  Vote,
  Settings as SettingsIcon,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile, useUpdateProfile, useUploadAvatar, useDeleteAvatar } from "../hooks/useSettings";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "../hooks/useSettings";
import { useChangePassword } from "../hooks/useSettings";
import { useDeleteAccount } from "../hooks/useSettings";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Skeleton } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Dialog } from "../../../components/ui/Dialog";
import { Badge } from "../../../components/ui/Badge";
import { Avatar } from "../../../components/ui/Avatar";
import { useTheme } from "../../../contexts/ThemeContext";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
  bio: z.string().max(300, "Bio must be at most 300 characters").optional().or(z.literal("")),
  location: z.string().max(100, "Location must be at most 100 characters").optional().or(z.literal("")),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  github: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "devices", label: "Devices", icon: Monitor },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

function PasswordStrength({ password }) {
  if (!password) return null;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const percentage = Math.min(100, (strength / 6) * 100);
  const color = percentage < 40 ? "bg-danger-500" : percentage < 70 ? "bg-warning-500" : "bg-success-500";

  return (
    <div className="mt-2">
      <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs text-surface-500 mt-1">
        {percentage < 40 ? "Weak" : percentage < 70 ? "Fair" : "Strong"} password
      </p>
    </div>
  );
}

function SectionHeader({ title, description, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        {Icon && <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-500">
          <Icon size={18} />
        </div>}
        <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
      </div>
      {description && <p className="text-sm text-surface-500 ml-11">{description}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswords, setShowPasswords] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const { theme, setTheme } = useTheme();

  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useProfile();
  const { data: preferences, isLoading: preferencesLoading } = useNotificationPreferences();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();
  const changePasswordMutation = useChangePassword();
  const updateNotificationMutation = useUpdateNotificationPreferences();
  const deleteAccountMutation = useDeleteAccount();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
      bio: "",
      location: "",
      website: "",
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
        twitter: profile.twitter || "",
      });
    }
  }, [profile, profileForm]);

  const onProfileSubmit = async (data) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast.success("Profile updated", { description: "Your changes have been saved." });
      refetchProfile();
    } catch (error) {
      toast.error("Failed to update profile", {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed", { description: "Your password has been updated." });
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to change password", {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", { description: "Please upload an image file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Please upload an image smaller than 5MB." });
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success("Avatar updated", { description: "Your profile picture has been updated." });
      refetchProfile();
    } catch (error) {
      toast.error("Failed to upload avatar", {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatarMutation.mutateAsync();
      toast.success("Avatar removed", { description: "Your profile picture has been removed." });
      refetchProfile();
    } catch (error) {
      toast.error("Failed to remove avatar", {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleNotificationChange = async (key, value) => {
    try {
      await updateNotificationMutation.mutateAsync({ [key]: value });
      toast.success("Notification preference updated");
    } catch (error) {
      toast.error("Failed to update preference", {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync(passwordForm.getValues("currentPassword"));
      toast.success("Account deleted", { description: "Your account has been permanently deleted." });
      window.location.href = "/login";
    } catch (error) {
      toast.error("Failed to delete account", {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <Card className="p-2">
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            </Card>
          </div>
          <div className="flex-1">
            <Card className="p-6">
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <ErrorState
        title="Failed to load settings"
        message={profileError.message}
        onRetry={() => refetchProfile()}
        dark
      />
    );
  }

  const notificationFields = [
    { key: "emailNotifications", label: "Email notifications", description: "Receive account updates via email", icon: Mail },
    { key: "pushNotifications", label: "Push notifications", description: "Receive push notifications in browser", icon: Volume2 },
    { key: "voteNotifications", label: "Vote notifications", description: "When someone votes on your polls", icon: Vote },
    { key: "commentNotifications", label: "Comment notifications", description: "When someone comments on your polls", icon: MessageSquare },
    { key: "pollNotifications", label: "Poll updates", description: "When polls you follow change or close", icon: Bell },
    { key: "systemNotifications", label: "System notifications", description: "Important service announcements", icon: SettingsIcon },
    { key: "marketingNotifications", label: "Marketing emails", description: "Product updates and tips", icon: Mail },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-surface-400 mt-2">Manage your account settings and preferences.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <Card dark className="p-2">
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? "bg-primary-500/15 text-primary-400"
                      : "text-surface-400 hover:text-white hover:bg-surface-800"
                    }
                  `}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {tab.id === "danger" && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-danger-500" />
                  )}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card dark className="p-6">
                  <SectionHeader title="Profile Information" description="Update your public profile details" icon={User} />

                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <Avatar
                        src={profile?.profileImage}
                        alt={profile?.name}
                        fallback={profile?.name?.charAt(0)}
                        size="xl"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary-600 transition-colors shadow-lg"
                      >
                        <Camera size={14} />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploadAvatarMutation.isPending}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{profile?.name}</h4>
                      <p className="text-xs text-surface-400">@{profile?.username}</p>
                      <button
                        onClick={handleDeleteAvatar}
                        disabled={deleteAvatarMutation.isPending || !profile?.profileImage}
                        className="mt-2 text-xs text-danger-400 hover:text-danger-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove photo
                      </button>
                    </div>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        label="Full Name"
                        {...profileForm.register("name")}
                        error={profileForm.formState.errors.name?.message}
                        dark
                      />
                      <Input
                        label="Username"
                        {...profileForm.register("username")}
                        error={profileForm.formState.errors.username?.message}
                        dark
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-300 mb-1.5">Bio</label>
                      <Textarea
                        {...profileForm.register("bio")}
                        rows={4}
                        className="w-full resize-none"
                        placeholder="Tell us about yourself..."
                        dark
                      />
                      {profileForm.formState.errors.bio && (
                        <p className="mt-1.5 text-xs text-danger-400">{profileForm.formState.errors.bio.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        label="Location"
                        {...profileForm.register("location")}
                        placeholder="City, Country"
                        dark
                      />
                      <Input
                        label="Website"
                        {...profileForm.register("website")}
                        placeholder="https://example.com"
                        dark
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <Input
                        label="GitHub"
                        {...profileForm.register("github")}
                        placeholder="https://github.com/username"
                        dark
                      />
                      <Input
                        label="LinkedIn"
                        {...profileForm.register("linkedin")}
                        placeholder="https://linkedin.com/in/username"
                        dark
                      />
                      <Input
                        label="Twitter"
                        {...profileForm.register("twitter")}
                        placeholder="https://twitter.com/username"
                        dark
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-800">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => profileForm.reset()}
                        disabled={!profileForm.formState.isDirty}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        loading={updateProfileMutation.isPending}
                        disabled={!profileForm.formState.isDirty}
                        icon={<Save size={16} />}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card dark className="p-6">
                  <SectionHeader title="Account Information" description="Your account details and status" icon={Mail} />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-surface-800">
                      <div>
                        <p className="text-sm font-medium text-surface-400">Email</p>
                        <p className="text-white font-medium">{profile?.email}</p>
                      </div>
                      <Badge variant={profile?.isVerified ? "success" : "warning"} dark>
                        {profile?.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-surface-800">
                      <div>
                        <p className="text-sm font-medium text-surface-400">Username</p>
                        <p className="text-white font-medium">@{profile?.username}</p>
                      </div>
                      <Badge variant="secondary" dark>Unique</Badge>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-surface-800">
                      <div>
                        <p className="text-sm font-medium text-surface-400">Role</p>
                        <p className="text-white font-medium capitalize">{profile?.role || "User"}</p>
                      </div>
                      <Badge variant="secondary" dark>{profile?.role || "User"}</Badge>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-surface-800">
                      <div>
                        <p className="text-sm font-medium text-surface-400">Account Status</p>
                        <p className="text-white font-medium">
                          {profile?.isSuspended ? "Suspended" : profile?.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <Badge variant={profile?.isActive ? "success" : "danger"} dark>
                        {profile?.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-surface-400">Member Since</p>
                        <p className="text-white font-medium">
                          {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card dark className="p-6">
                  <SectionHeader title="Change Password" description="Update your password to keep your account secure" icon={Lock} />
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-surface-300 mb-1.5">Current Password</label>
                      <div className="relative">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          {...passwordForm.register("currentPassword")}
                          error={passwordForm.formState.errors.currentPassword?.message}
                          dark
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
                        >
                          {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-300 mb-1.5">New Password</label>
                        <Input
                          type={showPasswords ? "text" : "password"}
                          {...passwordForm.register("newPassword")}
                          error={passwordForm.formState.errors.newPassword?.message}
                          dark
                         />
                         {/* eslint-disable-next-line react-hooks/incompatible-library */}
                         <PasswordStrength password={passwordForm.watch("newPassword")} />
                      </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-300 mb-1.5">Confirm New Password</label>
                      <Input
                        type={showPasswords ? "text" : "password"}
                        {...passwordForm.register("confirmPassword")}
                        error={passwordForm.formState.errors.confirmPassword?.message}
                        dark
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-800">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => passwordForm.reset()}
                        disabled={!passwordForm.formState.isDirty}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        loading={changePasswordMutation.isPending}
                        disabled={!passwordForm.formState.isDirty}
                        icon={<Lock size={16} />}
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Card>

                <Card dark className="p-6">
                  <SectionHeader title="Login Activity" description="Recent login activity on your account" icon={MonitorSmartphone} />
                  {profile?.loginActivity?.length > 0 ? (
                    <div className="space-y-3">
                      {profile.loginActivity.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center">
                              <Globe size={18} className="text-surface-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {activity.userAgent || "Unknown device"}
                              </p>
                              <p className="text-xs text-surface-400">
                                {activity.ipAddress || "Unknown IP"} • {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : "Unknown time"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-surface-400 text-center py-4">No recent login activity</p>
                  )}
                </Card>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card dark className="p-6">
                  <SectionHeader title="Notification Preferences" description="Choose how and when we notify you" icon={Bell} />
                  {preferencesLoading ? (
                    <div className="space-y-4">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton dark className="h-4 w-48" />
                          <Skeleton dark className="h-6 w-12" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {notificationFields.map((field) => (
                        <div
                          key={field.key}
                          className="flex items-center justify-between py-3 border-b border-surface-800 last:border-b-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400 mt-0.5">
                              <field.icon size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{field.label}</p>
                              <p className="text-xs text-surface-400 mt-0.5">{field.description}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences?.[field.key] ?? true}
                              onChange={(e) => handleNotificationChange(field.key, e.target.checked)}
                              disabled={updateNotificationMutation.isPending}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card dark className="p-6">
                  <SectionHeader title="Privacy Settings" description="Control your privacy and visibility" icon={Eye} />
                  <div className="space-y-6">
                    {[
                      {
                        label: "Public profile",
                        description: "Allow anyone to view your profile and polls",
                        enabled: true,
                      },
                      {
                        label: "Show activity status",
                        description: "Let others see when you're active",
                        enabled: false,
                      },
                      {
                        label: "Allow search engine indexing",
                        description: "Allow search engines to index your public polls",
                        enabled: true,
                      },
                    ].map((setting) => (
                      <div
                        key={setting.label}
                        className="flex items-center justify-between py-3 border-b border-surface-800 last:border-b-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{setting.label}</p>
                          <p className="text-xs text-surface-400 mt-0.5">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.enabled}
                            onChange={() => toast.info("This feature is not yet available")}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card dark className="p-6">
                  <SectionHeader title="Appearance" description="Customize how Pollify looks for you" icon={Palette} />
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-surface-300 mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "light", label: "Light", icon: Sun },
                          { id: "dark", label: "Dark", icon: Moon },
                          { id: "system", label: "System", icon: MonitorSmartphone },
                        ].map((themeOption) => (
                          <button
                            key={themeOption.id}
                            onClick={() => setTheme(themeOption.id)}
                            className={`
                              p-4 rounded-xl border-2 text-sm font-medium transition-all
                              flex flex-col items-center gap-2
                              ${theme === themeOption.id
                                ? "border-primary-500 bg-primary-500/15 text-primary-400"
                                : "border-surface-700 hover:border-surface-600 text-surface-400"
                              }
                            `}
                          >
                            <themeOption.icon size={20} />
                            {themeOption.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "devices" && (
              <motion.div
                key="devices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card dark className="p-6">
                  <SectionHeader title="Active Devices" description="Manage your active sessions" icon={Monitor} />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Current Device</p>
                          <p className="text-xs text-surface-400">
                            {navigator.userAgent.includes("Chrome") ? "Chrome" : navigator.userAgent.includes("Firefox") ? "Firefox" : "Browser"} • {navigator.platform}
                          </p>
                          <p className="text-xs text-surface-500 mt-0.5">Active now</p>
                        </div>
                      </div>
                      <Badge variant="success" dark>Current</Badge>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      variant="danger"
                      onClick={() => toast.info("This feature requires backend support")}
                      icon={<LogOut size={16} />}
                    >
                      Logout All Devices
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "danger" && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card dark className="p-6 border-danger-500/30">
                  <SectionHeader title="Delete Account" description="Permanently delete your account and all data" icon={Trash2} />
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/20">
                      <h4 className="text-sm font-semibold text-danger-400 mb-2">Warning: This action is irreversible</h4>
                      <ul className="text-xs text-surface-400 space-y-1 list-disc list-inside">
                        <li>All your polls and votes will be permanently deleted</li>
                        <li>Your profile and all data will be removed</li>
                        <li>You will not be able to recover your account</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-300 mb-1.5">
                          Type "DELETE" to confirm
                        </label>
                        <Input
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="DELETE"
                          dark
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-300 mb-1.5">Current Password</label>
                        <Input
                          type="password"
                          {...passwordForm.register("currentPassword")}
                          placeholder="Enter your current password"
                          dark
                        />
                      </div>

                      <Button
                        variant="danger"
                        onClick={() => setShowDeleteDialog(true)}
                        disabled={deleteConfirmText !== "DELETE" || !passwordForm.watch("currentPassword")}
                        icon={<Trash2 size={16} />}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Account"
        dark
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-300">
            Are you absolutely sure you want to delete your account? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteAccountMutation.isPending}
              onClick={handleDeleteAccount}
            >
              Yes, Delete My Account
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
