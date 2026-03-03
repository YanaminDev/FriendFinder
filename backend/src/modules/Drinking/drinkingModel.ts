import {z} from 'zod';

export const CreateDrinkingSchema = z.object({
    drinking: z.string().max(50)
})

export const DeleteDrinkingSchema = z.object({
    id: z.number().positive()
})

export const UpdateDrinkingSchema = z.object({
    id: z.number().positive(),
    name: z.string().max(50)
})