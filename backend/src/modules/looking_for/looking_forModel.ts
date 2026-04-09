import {z} from 'zod';

export const CreateLookingForSchema = z.object({
    looking_for: z.string().max(50),
    icon: z.string().max(50)
})

export const DeleteLookingForSchema = z.object({
    id: z.string()
})

export const UpdateLookingForSchema = z.object({
    id: z.string(),
    name: z.string().max(50),
    icon: z.string().max(50)
})