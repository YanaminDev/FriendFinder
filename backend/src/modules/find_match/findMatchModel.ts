import { z } from "zod";

export const CreateFindMatchSchema = z.object({
  user_id: z.string(),
  position_id: z.string(),
  activity_id1: z.string().optional(),
  activity_id2: z.string().optional(),
  activity_id3: z.string().optional(),
});

export const GetFindMatchSchema = z.object({
  user_id: z.string(),
});

export const SearchFindMatchSchema = z.object({
  position_id: z.string().optional(),
  activity_id1: z.string().optional(),
  activity_id2: z.string().optional(),
  activity_id3: z.string().optional(),
});

export const DeleteFindMatchSchema = z.object({
  user_id: z.string(),
});

export const UpdateFindMatchSchema = z.object({
  user_id: z.string(),
  position_id: z.string().optional(),
  activity_id1: z.string().optional(),
  activity_id2: z.string().optional(),
  activity_id3: z.string().optional(),
});

export type CreateFindMatch = z.infer<typeof CreateFindMatchSchema>;
export type GetFindMatch = z.infer<typeof GetFindMatchSchema>;
export type SearchFindMatch = z.infer<typeof SearchFindMatchSchema>;
export type DeleteFindMatch = z.infer<typeof DeleteFindMatchSchema>;
export type UpdateFindMatch = z.infer<typeof UpdateFindMatchSchema>;
