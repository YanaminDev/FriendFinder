import {z} from 'zod';

export const CreateLocationReviewSchema = z.object({
    user_id: z.string().uuid(),
    location_id: z.string().uuid(),
    status: z.union([z.literal(0), z.literal(1)]),
    review_text: z.string().optional(),
    match_id: z.string().uuid()
})

export const GetLocationReviewSchema = z.object({
    location_id: z.string().uuid()
})

export const GetUserLocationReviewSchema = z.object({
    user_id: z.string().uuid()
})

export const GetLocationReviewByMatchIdSchema = z.object({
    match_id: z.string().uuid()
})


export const DeleteLocationReviewSchema = z.object({
    review_id: z.string().uuid()
})



// Inferred types from schemas
export type CreateLocationReview = z.infer<typeof CreateLocationReviewSchema>;
export type GetLocationReview = z.infer<typeof GetLocationReviewSchema>;
export type GetUserLocationReview = z.infer<typeof GetUserLocationReviewSchema>;
export type GetLocationReviewByMatchId = z.infer<typeof GetLocationReviewByMatchIdSchema>;
export type DeleteLocationReview = z.infer<typeof DeleteLocationReviewSchema>;