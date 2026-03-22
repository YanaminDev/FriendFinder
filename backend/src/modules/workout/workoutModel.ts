import {z} from 'zod';

export const CreateWorkoutSchema = z.object({
    workout: z.string().max(50)
})

export const DeleteWorkoutSchema = z.object({
    id: z.string()
})

export const UpdateWorkoutSchema = z.object({
    id: z.string(),
    name: z.string().max(50)
})
