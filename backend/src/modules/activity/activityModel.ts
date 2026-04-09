import {z} from 'zod';

export const CreateActivitySchema = z.object({
    activity: z.string().max(50),
    icon: z.string().max(50)
})

export const DeleteActivitySchema = z.object({
    id: z.string()
})

export const UpdateActivitySchema = z.object({
    id: z.string(),
    name: z.string().max(50),
    icon: z.string().max(50)
})
