import {z} from 'zod';

export const CreateEducationSchema = z.object({
    education: z.string().max(50)
})

export const DeleteEducationSchema = z.object({
    id: z.number().positive()
})

export const UpdateEducationSchema = z.object({
    id: z.number().positive(),
    name: z.string().max(50)
})
