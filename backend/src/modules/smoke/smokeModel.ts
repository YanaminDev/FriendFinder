import {z} from 'zod';

export const CreateSmokeSchema = z.object({
    smoke: z.string().max(50)
})

export const DeleteSmokeSchema = z.object({
    id: z.string()
})

export const UpdateSmokeSchema = z.object({
    id: z.string(),
    name: z.string().max(50)
})
