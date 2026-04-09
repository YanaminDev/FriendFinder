import {z} from 'zod';

export const CreateLanguageForSchema = z.object({
    language: z.string().max(50),
    icon: z.string().max(50)
})

export const DeleteLanguageForSchema = z.object({
    id: z.string()
})

export const UpdateLanguageForSchema = z.object({
    id: z.string(),
    name: z.string().max(50),
    icon: z.string().max(50)
})