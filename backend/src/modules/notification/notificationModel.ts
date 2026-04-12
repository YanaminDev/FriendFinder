import { z } from "zod";

export const CreateNotificationSchema = z.object({
    sender_id: z.string(),
    receiver_id: z.string(),
    type: z.enum(["match_request", "match_accepted"]),
    position_id: z.string().optional(),
    activity_id: z.string().optional(),
});

export const UpdateNotificationStatusSchema = z.object({
    id: z.string(),
    status: z.enum(["accepted", "rejected"]),
});

export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationStatus = z.infer<typeof UpdateNotificationStatusSchema>;
