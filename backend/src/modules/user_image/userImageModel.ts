import {z} from 'zod';

export const CreateUserImageSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number().positive()
})