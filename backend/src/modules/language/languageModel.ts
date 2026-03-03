import {z} from 'zod';

export const CreateLanguageForSchema = z.object({
    language: z.string().max(50)
})

export const DeleteLanguageForSchema = z.object({
    id: z.number().positive()
})

export const UpdateLanguageForSchema = z.object({
    id: z.number().positive(),
    name: z.string().max(50)
})