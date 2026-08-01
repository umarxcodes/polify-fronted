import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema } from "../schemas/pollSchemas";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, GripVertical, Clock, Check } from "lucide-react";
import { useCreatePoll } from "../hooks/useCreatePoll";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { toast } from "sonner";

const categories = [
  { value: "Product", label: "Product", icon: "🎯" },
  { value: "Technology", label: "Technology", icon: "💻" },
  { value: "Design", label: "Design", icon: "🎨" },
  { value: "Culture", label: "Culture", icon: "🌟" },
  { value: "Business", label: "Business", icon: "📈" },
  { value: "General", label: "General", icon: "💬" },
];

export default function CreatePollPage() {
  const navigate = useNavigate();
  const mutation = useCreatePoll();
  const [selectedCategory, setSelectedCategory] = useState("General");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
      category: "General",
      isAnonymous: false,
      allowMultipleVotes: false,
      allowComments: true,
    },
  });

  // React Hook Form's watch is intentionally used for the live builder preview.
  // eslint-disable-next-line react-hooks/incompatible-library
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
    const pollData = {
      ...data,
      category: selectedCategory,
      options: data.options.filter(opt => opt.text.trim()),
    };

    mutation.mutate(pollData, {
      onSuccess: (response) => {
        toast.success("Poll created successfully!", {
          description: "Your poll is now live and ready for votes.",
        });
        navigate(`/polls/${response.data?.data?._id || response.data?._id}`);
      },
      onError: (error) => {
        toast.error("Failed to create poll", {
          description: error.message || "Please try again.",
        });
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Create Poll</h1>
        <p className="text-surface-500 mt-2">Ask a question and let the community vote.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <Card className="p-6">
          <label className="block text-sm font-semibold text-surface-900 mb-3">
            Question <span className="text-danger-500">*</span>
          </label>
          <Input
            {...register("title")}
            placeholder="What do you want to ask?"
            error={errors.title?.message}
            className="text-base"
          />
          <p className="mt-2 text-xs text-surface-500">Be specific and clear to get better responses.</p>
        </Card>

        {/* Description */}
        <Card className="p-6">
          <label className="block text-sm font-semibold text-surface-900 mb-3">
            Description <span className="text-surface-400 font-normal">(optional)</span>
          </label>
          <textarea
            {...register("description")}
            placeholder="Add more context to your question..."
            rows={3}
            className="input w-full px-4 py-3 text-sm resize-none"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-danger-500">{errors.description.message}</p>
          )}
        </Card>

        {/* Category */}
        <Card className="p-6">
          <label className="block text-sm font-semibold text-surface-900 mb-3">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => {
                  setSelectedCategory(category.value);
                  setValue("category", category.value);
                }}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200
                  ${selectedCategory === category.value
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-surface-200 hover:border-surface-300 bg-white"
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium">{category.label}</span>
                {selectedCategory === category.value && (
                  <Check size={14} className="ml-auto text-brand-600" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Options */}
        <Card className="p-6">
          <label className="block text-sm font-semibold text-surface-900 mb-1">
            Options <span className="text-danger-500">*</span>
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
                  <div className="flex-shrink-0 text-surface-400 cursor-grab">
                    <GripVertical size={18} />
                  </div>
                  <div className="flex-1">
                    <input
                      {...register(`options.${index}.text`)}
                      placeholder={`Option ${index + 1}`}
                      className="input w-full"
                    />
                    {errors.options?.[index]?.text && (
                      <p className="mt-1 text-xs text-danger-500">{errors.options[index].text.message}</p>
                    )}
                  </div>
                  {watchedOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="flex-shrink-0 p-2 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
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
              className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              <Plus size={18} />
              Add option
            </button>
          )}

          {errors.options && !Array.isArray(errors.options) && (
            <p className="mt-2 text-xs text-danger-500">{errors.options.message}</p>
          )}
        </Card>

        {/* Settings */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Poll Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900">Allow multiple votes</p>
                <p className="text-xs text-surface-500">Let users vote for multiple options</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("allowMultipleVotes")} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900">Allow comments</p>
                <p className="text-xs text-surface-500">Let users discuss this poll</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("allowComments")} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-900">Anonymous poll</p>
                <p className="text-xs text-surface-500">Hide your identity from voters</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("isAnonymous")} className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-900 mb-2">
                <Clock size={16} className="inline mr-1.5" />
                End date <span className="text-surface-400 font-normal">(optional)</span>
              </label>
              <input
                type="datetime-local"
                {...register("endsAt")}
                className="input w-full"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting || mutation.isPending} size="lg">
            {isSubmitting || mutation.isPending ? "Creating..." : "Create Poll"}
          </Button>
        </div>
      </form>
    </div>
  );
}
