import { useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { toast } from "sonner";
import { useUser } from "../hooks/useUser";

export default function EditProfilePage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { profile, updateProfile, uploadProfileImage, deleteProfileImage } =
    useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: profile?.name || "",
      username: profile?.username || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      website: profile?.website || "",
      github: profile?.github || "",
      linkedin: profile?.linkedin || "",
      twitter: profile?.twitter || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      reset(data);
    } catch {
      // Error handled in hook
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      await uploadProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteProfileImage();
      setImagePreview(null);
    } catch {
      // Error handled in hook
    }
  };

  const hasChanges = isDirty || imagePreview;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">
            Edit Profile
          </h1>
          <p className="text-surface-500 mt-1">Update your public profile</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card dark className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-brand-500/25 overflow-hidden">
                  {imagePreview || profile?.profileImage ? (
                    <img
                      src={imagePreview || profile?.profileImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (profile?.name || "U")[0]?.toUpperCase()
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-500 rounded-full border-2 border-surface-900 flex items-center justify-center cursor-pointer hover:bg-brand-600 transition-colors">
                  <Upload size={12} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-sm font-medium text-surface-300">Profile Photo</p>
                <p className="text-xs text-surface-400 mt-0.5">
                  JPG, PNG or WebP. Max 5MB.
                </p>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="text-xs text-danger-400 hover:text-danger-300 mt-1"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            {isUploading && (
              <p className="text-xs text-surface-400">Uploading...</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                error={errors.name?.message}
                {...register("name", { required: "Name is required" })}
              />
              <Input
                label="Username"
                error={errors.username?.message}
                {...register("username", { required: "Username is required" })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Bio
              </label>
              <Textarea
                {...register("bio", {
                  maxLength: {
                    value: 300,
                    message: "Bio must be at most 300 characters",
                  },
                })}
                rows={4}
                placeholder="Tell us about yourself..."
                error={errors.bio?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Location"
                {...register("location")}
                placeholder="City, Country"
              />
              <Input
                label="Website"
                {...register("website")}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input
                label="GitHub"
                {...register("github")}
                placeholder="https://github.com/username"
              />
              <Input
                label="LinkedIn"
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/username"
              />
              <Input
                label="Twitter"
                {...register("twitter")}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!hasChanges}
                icon={<Save size={16} />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}