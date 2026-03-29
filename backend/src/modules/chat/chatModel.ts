import { z } from "zod";

export const CreateChatSchema = z.object({
  user1_id: z.string(),
  user2_id: z.string(),
});

export const GetChatSchema = z.object({
  chat_id: z.string(),
});

export const GetChatsByUserSchema = z.object({
  user_id: z.string(),
});

export const DeleteChatSchema = z.object({
  chat_id: z.string(),
});

export const ChatSchema = CreateChatSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  user1: z.any().optional(),
  user2: z.any().optional(),
  chatMessage: z.any().optional(),
});

export type CreateChat = z.infer<typeof CreateChatSchema>;
export type GetChat = z.infer<typeof GetChatSchema>;
export type GetChatsByUser = z.infer<typeof GetChatsByUserSchema>;
export type DeleteChat = z.infer<typeof DeleteChatSchema>;
export type Chat = z.infer<typeof ChatSchema>;