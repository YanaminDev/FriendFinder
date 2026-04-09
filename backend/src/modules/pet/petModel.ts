import {z} from 'zod';

export const CreatePetSchema = z.object({
    pet: z.string().max(50),
    icon: z.string().max(50)
})

export const DeletePetSchema = z.object({
    id: z.string()
})

export const UpdatePetSchema = z.object({
    id: z.string(),
    name: z.string().max(50),
    icon: z.string().max(50)
})
