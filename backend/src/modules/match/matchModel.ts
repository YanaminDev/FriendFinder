import {z} from 'zod';

export const CreateMatchSchema = z.object({
    user1_id: z.string().uuid(),
    user2_id: z.string().uuid(),
    location_id: z.string().uuid().optional(),
    activity_id: z.string().uuid(),
    position_id: z.string().uuid(),
    end_date: z.string().datetime().optional()
});

export const GetMatchSchema = z.object({
    match_id: z.string().uuid()
});

export const UpdateMatchLocationSchema = z.object({
    location_id: z.string().uuid()
});


export const UpdateMatchCancelStatusSchema = z.object({
    cancel_status: z.boolean()
});

export const UpdateMatchEndSchema = z.object({
    end_date: z.string().datetime().or(z.string().date())
});

 

export const DeleteMatchSchema = z.object({
    match_id: z.string().uuid()
});

// Inferred types from schemas
export type CreateMatch = z.infer<typeof CreateMatchSchema>;
export type GetMatch = z.infer<typeof GetMatchSchema>;
export type UpdateMatchLocation = z.infer<typeof UpdateMatchLocationSchema>;
export type UpdateMatchCancelStatus = z.infer<typeof UpdateMatchCancelStatusSchema>;
export type UpdateMatchEnd = z.infer<typeof UpdateMatchEndSchema>;
export type DeleteMatch = z.infer<typeof DeleteMatchSchema>;
