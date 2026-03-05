import {z} from 'zod';

export const CreateUserImageSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number().positive()
})

export const  GetSignedUrlSchema = z.object({
    userId: z.string().uuid()
})

export const  GetSignedUrlSchemaWithId = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid()
})


export const  GetUserImageUrlSchema = z.object({
    userId: z.string().uuid()
})

export const  GetUserImageUrlSchemaUserId = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid()
})


export const DeleteUserImageUrlSchema = z.object({
    imageId: z.string().uuid()
})

export const UpdateUserImageUrlSchema = z.object({
    imageId: z.string().uuid()
})