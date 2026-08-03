import { z } from "zod";

export const createPollSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().optional(),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "Option text is required"),
      })
    )
    .min(2, "At least 2 options are required")
    .max(10, "No more than 10 options allowed"),
  isAnonymous: z.boolean().optional(),
  allowMultipleVotes: z.boolean().optional(),
  allowComments: z.boolean().optional(),
  expiresAt: z.string().min(1, "Expiration date is required"),
  category: z.string().optional(),
});

export const updatePollSchema = createPollSchema.partial();

export const voteSchema = z.object({
  optionId: z.string().min(1, "Option is required"),
});