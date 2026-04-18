import {z} from 'zod';

const passwordSchema = z.string()
    .min(8, 'ต้องมีอย่างน้อย 8 ตัวอักษร')
    .regex(/[A-Z]/, 'ต้องมีตัวพิมพ์ใหญ่')
    .regex(/[a-z]/, 'ต้องมีตัวพิมพ์เล็ก')
    .regex(/\d/, 'ต้องมีตัวเลข')
    .regex(/[@$!%*?&]/, 'ต้องมีอักษรพิเศษ (@$!%*?&)');

export const UserSignupSchema = z.object({
    user_show_name: z.string().max(50),
    username: z.string(),
    password: passwordSchema,
    sex: z.enum(['male', 'female', 'lgbtq']),
    age: z.number().int().positive(),
    birth_of_date: z.string().date(),
    interested_gender: z.enum(['male', 'female', 'lgbtq'])
})

export const GoogleSignupSchema = z.object({
    user_show_name: z.string().max(50),
    google_id: z.string().min(1),
    sex: z.enum(['male', 'female', 'lgbtq']),
    age: z.number().int().positive(),
    birth_of_date: z.string().date(),
    interested_gender: z.enum(['male', 'female', 'lgbtq'])
})

export const GoogleLoginSchema = z.object({
    idToken: z.string().min(1, 'idToken is required')
})

export const UserLoginSchema = z.object({
    username: z.string(),
    password: passwordSchema
})

export const ChangePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: passwordSchema
})
