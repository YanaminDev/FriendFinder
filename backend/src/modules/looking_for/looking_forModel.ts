import {z} from 'zod';

export const CreateLookingForSchema = z.object({
    looking_for: z.string().max(50)
})

export const DeleteLookingForSchema = z.object({
    id: z.number().positive()
})

export const UpdateLookingForSchema = z.object({
    id: z.number().positive(),
    name: z.string().max(50)
})