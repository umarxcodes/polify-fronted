import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePollSchema } from "../schemas/pollSchemas";
import { usePollDetail } from "../hooks/usePollDetail";
import { useUpdatePoll } from "../hooks/useUpdatePoll";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPollPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = usePollDetail();
  const mutation = useUpdatePoll();

  const poll = data?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePollSchema),
    defaultValues: {
      title: poll?.title || "",
      description: poll?.description || "",
      options: poll?.options || [{ text: "" }, { text: "" }],
      isAnonymous: poll?.isAnonymous || false,
      allowMultipleVotes: poll?.allowMultipleVotes || false,
      endsAt: poll?.endsAt || "",
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate(`/polls/${id}`);
        },
      }
    );
  };

  if (isLoading) return <p>Loading poll...</p>;

  return (
    <div>
      <h1>Edit Poll</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Title</label>
          <input {...register("title")} />
          {errors.title && <span>{errors.title.message}</span>}
        </div>
        <div>
          <label>Description</label>
          <textarea {...register("description")} />
          {errors.description && <span>{errors.description.message}</span>}
        </div>
        <div>
          <label>Options</label>
          {errors.options && <span>{errors.options.message}</span>}
        </div>
        <div>
          <label>Ends At</label>
          <input type="datetime-local" {...register("endsAt")} />
        </div>
        <div>
          <label>
            <input type="checkbox" {...register("isAnonymous")} />
            Anonymous
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" {...register("allowMultipleVotes")} />
            Allow Multiple Votes
          </label>
        </div>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Poll"}
        </button>
      </form>
    </div>
  );
}