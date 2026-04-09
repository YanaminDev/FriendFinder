import {z} from 'zod';

export const CreateEducationSchema = z.object({
    education: z.string().max(50),
    icon: z.string().max(50)
})

export const DeleteEducationSchema = z.object({
    id: z.string()
})

export const UpdateEducationSchema = z.object({
    id: z.string(),
    name: z.string().max(50),
    icon: z.string().max(50)
})
