import { z } from 'zod';

// Password schema - matching backend requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/\d/, 'Password must contain number')
  .regex(/[@$!%*?&]/, 'Password must contain special character (@$!%*?&)');

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register schema - matching backend UserSignupSchema
export const registerSchema = z
  .object({
    user_show_name: z.string().min(1, 'Display name is required').max(50, 'Display name max 50 characters'),
    username: z.string().min(1, 'Username is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
    sex: z.enum(['male', 'female', 'lgbtq']),
    age: z.number().int('Age must be integer').min(13, 'Age must be at least 13'),
    birth_of_date: z.string().min(1, 'Birth date is required'),
    interested_gender: z.enum(['male', 'female', 'lgbtq']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Location schema
export const createLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(50, 'Name max 50 characters'),
  description: z.string().max(500, 'Description max 500 characters').optional(),
  phone: z.string().max(10, 'Phone max 10 characters').optional(),
  activity_id: z.string().min(1, 'Activity is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  open_date: z.string().optional(),
  open_time: z.string().optional(),
  close_time: z.string().optional(),
});

export type CreateLocationFormData = z.infer<typeof createLocationSchema>;

// Update location schema
export const updateLocationSchema = z.object({
  description: z.string().max(500).optional(),
  phone: z.string().max(10).optional(),
  open_date: z.string().optional(),
  open_time: z.string().optional(),
  close_time: z.string().optional(),
});

export type UpdateLocationFormData = z.infer<typeof updateLocationSchema>;
