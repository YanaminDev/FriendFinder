import {z} from 'zod';

export const CreateSelectCancelSchema = z.object({
    select_cancel: z.string().max(50)
})

export const DeleteSelectCancelSchema = z.object({
    id: z.string()
})

export const UpdateSelectCancelSchema = z.object({
    id: z.string(),
    name: z.string().max(50)
})
