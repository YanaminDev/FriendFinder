import { z } from "zod";

export const CreatePositionSchema = z.object({
  name: z.string().min(1),
  information: z.string().optional(),
  phone: z.string().optional(),
  open_date: z.string().optional(),
  open_time: z.string().optional(),
  close_time: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export const GetPositionSchema = z.object({
  position_id: z.string(),
});

export const UpdatePositionSchema = z.object({
  position_id: z.string(),
  name: z.string().min(1).optional(),
  information: z.string().optional(),
  phone: z.string().optional(),
  open_date: z.string().optional(),
  open_time: z.string().optional(),
  close_time: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const DeletePositionSchema = z.object({
  position_id: z.string(),
});

export const SearchPositionSchema = z.object({
  user_latitude: z.number(),
  user_longitude: z.number(),
  radius: z.number().default(5), // km
});

export const PositionSchema = CreatePositionSchema.extend({
  id: z.string(),
  find_match: z.any().optional(),
  location: z.any().optional(),
  match: z.any().optional(),
});

export type CreatePosition = z.infer<typeof CreatePositionSchema>;
export type GetPosition = z.infer<typeof GetPositionSchema>;
export type UpdatePosition = z.infer<typeof UpdatePositionSchema>;
export type DeletePosition = z.infer<typeof DeletePositionSchema>;
export type SearchPosition = z.infer<typeof SearchPositionSchema>;
export type Position = z.infer<typeof PositionSchema>;