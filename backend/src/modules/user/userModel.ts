import {z} from 'zod';

export const UserSignupSchema = z.object({
    user_show_name: z.string().max(50),
    username: z.string(),
    password: z.string().min(8),
    sex: z.enum(['male', 'female', 'lgbtq']),
    age: z.number().int().positive(),
    birth_of_date: z.string().date(),
    interested_gender: z.enum(['male', 'female', 'lgbtq'])
})

export const UserLoginSchema = z.object({
    username: z.string(),
    password: z.string().min(8)
})
