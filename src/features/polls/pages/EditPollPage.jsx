import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePollSchema } from "../schemas/pollSchemas";
import { usePollDetail } from "../hooks/usePollDetail";
import { useUpdatePoll } from "../hooks/useUpdatePoll";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical, Check, Target, Cpu, Palette, Globe, Briefcase, MessageCircle, FileText, Settings2, CalendarClock } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { toast } from "sonner";

const categories = [
  { value: "Product", label: "Product", icon: Target },
  { value: "Technology", label: "Technology", icon: Cpu },
  { value: "Design", label: "Design", icon: Palette },
  { value: "Culture", label: "Culture", icon: Globe },
  { value: "Business", label: "Business", icon: Briefcase },
  { value: "General", label: "General", icon: MessageCircle },
];

export default function EditPollPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = usePollDetail();
  const mutation = useUpdatePoll();

  const poll = data?.data;
  const [selectedCategory, setSelectedCategory] = useState(poll?.category || "General");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updatePollSchema),
    defaultValues: {
      title: poll?.title || "",
      description: poll?.description || "",
      options: poll?.options || [{ text: "" }, { text: "" }],
      category: poll?.category || "General",
      isAnonymous: poll?.isAnonymous || false,
      allowMultipleVotes: poll?.allowMultipleVotes || false,
      allowComments: poll?.allowComments !== false,
      expiresAt: poll?.expiresAt || "",
    },
  });

  const watchedOptions = watch("options");

  const addOption = () => {
    if (watchedOptions.length < 10) {
      setValue("options", [...watchedOptions, { text: "" }]);
    }
  };

  const removeOption = (index) => {
    if (watchedOptions.length > 2) {
      setValue("options", watchedOptions.filter((_, i) => i !== index));
    }
  };

  const onSubmit = (data) => {
    const trimmedOptions = data.options
      .map((opt) => ({ text: opt.text.trim() }))
      .filter((opt) => opt.text.length > 0);

    const pollData = {
      title: data.title.trim(),
      description: data.description?.trim() || "",
      options: trimmedOptions,
      category: selectedCategory,
      isAnonymous: data.isAnonymous || false,
      allowMultipleVotes: data.allowMultipleVotes || false,
      allowComments: data.allowComments !== false,
      expiresAt: data.expiresAt || "",
    };

    mutation.mutate(
      { id, data: pollData },
      {
        onSuccess: () => {
          toast.success("Poll updated successfully");
          navigate(`/polls/${id}`);
        },
        onError: (error) => {
          toast.error("Failed to update poll", {
            description: error.response?.data?.message || error.message || "Please try again.",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-surface-800 rounded animate-pulse" />
        <Card dark className="p-6 space-y-4">
          <div className="h-4 w-32 bg-surface-800 rounded animate-pulse" />
          <div className="h-10 w-full bg-surface-800 rounded animate-pulse" />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Poll</h1>
        <p className="text-surface-400 mt-2">Update your poll details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card dark className="p-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 mb-3">
            <FileText size={18} className="text-brand-400" />
            Question <span className="text-danger-400">*</span>
          </label>
          <Input
            dark
            {...register("title")}
            placeholder="What do you want to ask?"
            error={errors.title?.message}
            className="text-base"
          />
        </Card>

        <Card dark className="p-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 mb-3">
            <MessageCircle size={18} className="text-brand-400" />
            Description <span className="text-surface-500 font-normal">(optional)</span>
          </label>
          <textarea
            {...register("description")}
            placeholder="Add more context to your question..."
            rows={3}
            className="input w-full px-4 py-3 text-sm resize-none bg-surface-800 border-surface-700 text-white placeholder:text-surface-500"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-danger-400">{errors.description.message}</p>
          )}
        </Card>

        <Card dark className="p-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 mb-3">
            <Target size={18} className="text-brand-400" />
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.value);
                    setValue("category", category.value);
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200
                    ${
                      selectedCategory === category.value
                        ? "border-brand-500 bg-brand-500/15 text-brand-400"
                        : "border-surface-700 hover:border-surface-600 bg-surface-800 text-surface-300"
                    }
                  `}
                >
                  <Icon size={18} className={selectedCategory === category.value ? "text-brand-400" : "text-surface-500"} />
                  <span className="text-sm font-medium">{category.label}</span>
                  {selectedCategory === category.value && (
                    <Check size={14} className="ml-auto text-brand-400" />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card dark className="p-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-surface-200 mb-1">
            <Plus size={18} className="text-brand-400" />
            Options <span className="text-danger-400">*</span>
          </label>
          <p className="text-xs text-surface-500 mb-4">Add at least 2 options for people to choose from.</p>

          <div className="space-y-3">
            <AnimatePresence>
              {watchedOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 text-surface-500 cursor-grab">
                    <GripVertical size={18} />
                  </div>
                  <div className="flex-1">
                    <input
                      {...register(`options.${index}.text`)}
                      placeholder={`Option ${index + 1}`}
                      className="input w-full bg-surface-800 border-surface-700 text-white placeholder:text-surface-500"
                    />
                    {errors.options?.[index]?.text && (
                      <p className="mt-1 text-xs text-danger-400">{errors.options[index].text.message}</p>
                    )}
                  </div>
                  {watchedOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="flex-shrink-0 p-2 rounded-lg text-surface-500 hover:text-danger-400 hover:bg-danger-500/10 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {watchedOptions.length < 10 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              <Plus size={18} />
              Add option
            </button>
          )}

          {errors.options && !Array.isArray(errors.options) && (
            <p className="mt-2 text-xs text-danger-400">{errors.options.message}</p>
          )}
        </Card>

        <Card dark className="p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-surface-200 mb-4">
            <Settings2 size={18} className="text-brand-400" />
            Poll Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-200">Allow multiple votes</p>
                <p className="text-xs text-surface-500">Let users vote for multiple options</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("allowMultipleVotes")} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-200">Allow comments</p>
                <p className="text-xs text-surface-500">Let users discuss this poll</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("allowComments")} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-200">Anonymous poll</p>
                <p className="text-xs text-surface-500">Hide your identity from voters</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("isAnonymous")} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-200 mb-2">
                <CalendarClock size={16} className="text-surface-500" />
                Expiration date <span className="text-danger-400 font-normal">*</span>
              </label>
              <input
                type="datetime-local"
                {...register("expiresAt")}
                className="input w-full bg-surface-800 border-surface-700 text-white placeholder:text-surface-500"
              />
              {errors.expiresAt && (
                <p className="mt-1 text-xs text-danger-400">{errors.expiresAt.message}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting || mutation.isPending} size="lg">
            {isSubmitting || mutation.isPending ? "Updating..." : "Update Poll"}
          </Button>
        </div>
      </form>
    </div>
  );
}
