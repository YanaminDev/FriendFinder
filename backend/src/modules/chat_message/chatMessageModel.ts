import { z } from "zod";

export const SendMessageSchema = z.object({
  chat_id: z.string(),
  message: z.string().min(1),
  sender_id: z.string(),
  chatType: z.string().default("text"),
});

export const GetMessagesSchema = z.object({
  chat_id: z.string(),
});

export type SendMessage = z.infer<typeof SendMessageSchema>;
export type GetMessages = z.infer<typeof GetMessagesSchema>;
