import {z} from 'zod';

export const CreateLocationImageSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number().positive()
})

export const  GetSignedUrlSchema = z.object({
    locationId: z.string().uuid()
})

export const  GetSignedUrlSchemaWithId = z.object({
    locationId: z.string().uuid(),
    imageId: z.string().uuid()
})


export const  GetLocationImageUrlSchema = z.object({
    locationId: z.string().uuid(),
})

export const  GetLocationImageUrlSchemaUserId = z.object({
    locationId: z.string().uuid(),
    imageId: z.string().uuid()
})


export const DeleteUserImageUrlSchema = z.object({
    imageId: z.string().uuid()
})

export const UpdateUserImageUrlSchema = z.object({
    imageId: z.string().uuid()
})