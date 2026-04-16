import { z } from 'zod';

export const CreateUserReviewSchema = z.object({
    user_id: z.string().uuid(),
    reviewed_user_id: z.string().uuid(),
    status: z.union([z.literal(0), z.literal(1)]),
    review_text: z.string().optional(),
    match_id: z.string().uuid()
})

export const GetUserReviewSchema = z.object({
    reviewed_user_id: z.string().uuid()
})

export const GetUserReviewByMatchIdSchema = z.object({
    match_id: z.string().uuid()
})

export const DeleteUserReviewSchema = z.object({
    review_id: z.string().uuid()
})

// Inferred types from schemas
export type CreateUserReview = z.infer<typeof CreateUserReviewSchema>;
export type GetUserReview = z.infer<typeof GetUserReviewSchema>;
export type GetUserReviewByMatchId = z.infer<typeof GetUserReviewByMatchIdSchema>;
export type DeleteUserReview = z.infer<typeof DeleteUserReviewSchema>;
