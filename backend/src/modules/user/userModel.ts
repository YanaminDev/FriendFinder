import {z} from 'zod';

export const UserSignupSchema = z.object({
    username:z.string(),
    password:z.string().min(8),
    email:z.string().email(),
    sex:z.enum(['MALE','FEMALE ','LGBTQ'])

})
