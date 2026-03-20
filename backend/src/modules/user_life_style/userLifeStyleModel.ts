import {z} from 'zod';

export const CreateUserLifeStyleSchema = z.object({
    user_id: z.string().uuid(),
    looking_for_id: z.string().uuid(),
    drinking_id: z.string().uuid(),
    pet_id: z.string().uuid(),
    smoke_id: z.string().uuid(),
    workout_id: z.string().uuid()
})


export const GetUserLifeStyleSchema = z.object({
    user_id: z.string().uuid()
})

export const UpdateUserLifeStyleLookingForSchema = z.object({
    looking_for_id: z.string().uuid()
})

export const UpdateUserLifeStyleDrinkingSchema = z.object({
    drinking_id: z.string().uuid()
})

export const UpdateUserLifeStylePetSchema = z.object({
    pet_id: z.string().uuid()
})

export const UpdateUserLifeStyleSmokeSchema = z.object({
    smoke_id: z.string().uuid()
})

export const UpdateUserLifeStyleWorkoutSchema = z.object({
    workout_id: z.string().uuid()
})
