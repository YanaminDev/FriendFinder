import {z} from 'zod';

export const CreateActivitySchema = z.object({
    activity: z.string().max(50)
})

export const DeleteActivitySchema = z.object({
    id: z.number().positive()
})

export const UpdateActivitySchema = z.object({
    id: z.number().positive(),
    name: z.string().max(50)
})
