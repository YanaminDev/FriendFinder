import {z} from 'zod';
import { de } from 'zod/v4/locales';

export const CreateLocationSchema = z.object({
    name : z.string().trim().min(1).max(50),
    description : z.string().trim().max(500).optional(),
    phone : z.string().trim().max(10).optional(),
    activity_id : z.string().trim(),
    position_id : z.string().trim(),
    open_date : z.string().trim().max(100).optional(),
    open_time : z.string().trim().max(5).optional(),
    close_time : z.string().trim().max(5).optional()
})

export const GetLocationByIdSchema = z.object({
    id: z.string()
})

export const DeleteLocationSchema = z.object({
    id: z.string()
})

export const UpdateLocationSchema = z.object({
    description : z.string().trim().max(500).optional(),
    phone : z.string().trim().max(10).optional(),
    open_date : z.string().trim().max(100).optional(),
    open_time : z.string().trim().max(5).optional(),
    close_time : z.string().trim().max(5).optional()
})

export const GetLocationForMatchSchema = z.object({
    user_id_1 : z.string(),
    user_id_2 : z.string(),
    activity_id : z.string(),
    position_id : z.string()
})




// model Location {
//   id              String            @id @default(uuid())
//   name            String            @db.VarChar(50)
//   description     String?
//   phone           String?
//   position_id     String
//   activity_id     String
//   open_date       String?
//   open_time       String?
//   close_time      String?
//   activity        Activity          @relation(fields: [activity_id], references: [id])
//   position        Position          @relation(fields: [position_id], references: [id])
//   location_image  Location_image[]
//   location_review Location_review[]
//   match           Match[]

//   @@index([name, position_id, activity_id, open_date, open_time])
// }