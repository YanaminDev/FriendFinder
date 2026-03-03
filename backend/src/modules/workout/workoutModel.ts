import {z} from 'zod';

export const CreateWorkoutSchema = z.object({
    workout: z.string().max(50)
})

export const DeleteWorkoutSchema = z.object({
    id: z.number().positive()
})

export const UpdateWorkoutSchema = z.object({
    id: z.number().positive(),
    name: z.string().max(50)
})
