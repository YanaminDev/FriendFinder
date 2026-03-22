import {z} from 'zod';

export const CreateLocationImageSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number().positive()
})

export const CreateLocationImageDataSchema = z.object({
    locationId: z.string().uuid(),
    createdAt: z.date()
})