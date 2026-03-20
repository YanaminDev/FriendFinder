import {z} from 'zod';
import { Blood_Group } from '../../../generated/prisma/enums';


export const CreateUserInformationSchema = z.object({
    user_id : z.string().uuid(),
    user_height : z.number().positive(),
    user_bio : z.string().optional(),
    blood_group : z.nativeEnum(Blood_Group).optional(),
    language_id : z.string().uuid().optional(),
    education_id : z.string().uuid().optional()
})




export const GetUserInformationSchema = z.object({
    user_id : z.string().uuid(),
})


export const UpdateUserInformationBioSchema = z.object({
    user_bio : z.string()
})

export const UpdateUserInformationHeightSchema = z.object({
    user_height : z.number().positive()
})

export const UpdateUserInformationBloodGroupSchema = z.object({
    blood_group : z.nativeEnum(Blood_Group)
})

export const UpdateUserInformationLanguageSchema = z.object({
    language_id : z.string().uuid()
})


export const UpdateUserInformationEducationSchema = z.object({
    education_id : z.string().uuid()
})






