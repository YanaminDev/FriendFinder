import {z} from 'zod';

export const CreatePetSchema = z.object({
    pet: z.string().max(50)
})

export const DeletePetSchema = z.object({
    id: z.number().positive()
})

export const UpdatePetSchema = z.object({
    id: z.number().positive(),
    name: z.string().max(50)
})
