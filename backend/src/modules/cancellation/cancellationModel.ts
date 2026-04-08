import { z } from "zod";

export const CreateCancellationSchema = z.object({
  content: z.string().optional(),
  match_id: z.string(),
  reviewer_id: z.string(),
  reviewee_id: z.string(),
  quick_select_id: z.string().optional(),
});

export const GetCancellationSchema = z.object({
  cancellation_id: z.string(),
});

export const GetCancellationByMatchSchema = z.object({
  match_id: z.string(),
});

export const GetCancellationByUserSchema = z.object({
  user_id: z.string(),
});

export const GetCancellationByReviewerSchema = z.object({
  reviewer_id: z.string(),
});

export const DeleteCancellationSchema = z.object({
  cancellation_id: z.string(),
});

export const CancellationSchema = CreateCancellationSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  match: z.any().optional(),
  quick_select: z.any().optional(),
  reviewer: z.any().optional(),
  reviewee: z.any().optional(),
});

export type CreateCancellation = z.infer<typeof CreateCancellationSchema>;
export type GetCancellation = z.infer<typeof GetCancellationSchema>;
export type GetCancellationByMatch = z.infer<typeof GetCancellationByMatchSchema>;
export type GetCancellationByUser = z.infer<typeof GetCancellationByUserSchema>;
export type GetCancellationByReviewer = z.infer<typeof GetCancellationByReviewerSchema>;
export type DeleteCancellation = z.infer<typeof DeleteCancellationSchema>;
export type Cancellation = z.infer<typeof CancellationSchema>;