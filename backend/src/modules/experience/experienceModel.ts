import { z } from "zod";

export const CreateExperienceSchema = z.object({
  content: z.string().optional(),
  status: z.union([z.literal(0), z.literal(1)]),
  match_id: z.string(),
  reviewer_id: z.string(),
  reviewee_id: z.string(),
});

export const GetExperienceSchema = z.object({
  experience_id: z.string(),
});

export const GetExperienceByMatchSchema = z.object({
  match_id: z.string(),
});

export const GetExperienceByReviewerSchema = z.object({
  reviewer_id: z.string(),
});

export const GetExperienceByRevieweeSchema = z.object({
  reviewee_id: z.string(),
});

export const UpdateExperienceSchema = z.object({
  experience_id: z.string(),
  content: z.string().optional(),
  status: z.union([z.literal(0), z.literal(1)]).optional(),
});

export const DeleteExperienceSchema = z.object({
  experience_id: z.string(),
});

export const GettotalExperienceFromUserSchema = z.object({
  user_id: z.string(),
});

export type CreateExperience = z.infer<typeof CreateExperienceSchema>;
export type GetExperience = z.infer<typeof GetExperienceSchema>;
export type GetExperienceByMatch = z.infer<typeof GetExperienceByMatchSchema>;
export type GetExperienceByReviewer = z.infer<typeof GetExperienceByReviewerSchema>;
export type GetExperienceByReviewee = z.infer<typeof GetExperienceByRevieweeSchema>;
export type UpdateExperience = z.infer<typeof UpdateExperienceSchema>;
export type DeleteExperience = z.infer<typeof DeleteExperienceSchema>;
export type GettotalExperienceFromUser = z.infer<typeof GettotalExperienceFromUserSchema>;
