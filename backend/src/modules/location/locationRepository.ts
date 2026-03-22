import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";
import { CreateLocationSchema, UpdateLocationSchema } from "./locationModel";
import { z } from "zod";
import { get } from "node:http";

type CreateLocationInput = z.infer<typeof CreateLocationSchema>;
type UpdateLocationInput = z.infer<typeof UpdateLocationSchema>;

export const locationRepository = {
    getLocationbyid : async (id:string) => {
        try{
            return await prisma.location.findUnique({
                where : {
                    id : id
                }
            })
        }
        catch(err){
            throw err
        }
    },

    getLocation : async () => {
        try{
            return await prisma.location.findMany()
        }
        catch(err){
            throw err
        }
    },

    getLocationByPositionId : async (position_id : string) => {
        try{
            return await prisma.location.findMany({
                where : {
                    position_id : position_id
                }
            })
        }catch(err){
            throw err
        }
    },

    getLocationForMatch : async (user_id_1 : string , user_id_2 : string , activity_id : string , position_id : string) => {
        try{
            
        }
        catch(err){
            throw err
        }
    },

    createLocation : async (data : CreateLocationInput) => {
        try {
            return await prisma.location.create({
                data: {
                    name: data.name,
                    position_id : data.position_id,
                    activity_id : data.activity_id,
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.phone !== undefined && { phone: data.phone }),
                    ...(data.open_date !== undefined && { open_date: data.open_date }),
                    ...(data.open_time !== undefined && { open_time: data.open_time }),
                    ...(data.close_time !== undefined && { close_time: data.close_time }),
                }
            })
        }
        catch(err){
            throw err
        }
    },

    updateLocation : async (id : string, data : UpdateLocationInput) => {
        try {
            return await prisma.location.update({
                where: {
                    id: id
                },
                data: {
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.phone !== undefined && { phone: data.phone }),
                    ...(data.open_date !== undefined && { open_date: data.open_date }),
                    ...(data.open_time !== undefined && { open_time: data.open_time }),
                    ...(data.close_time !== undefined && { close_time: data.close_time }),
                }
            })
        }
        catch(err){
            throw err
        }
    },

    deleteLocation : async (id : string) => {
        try{
            return await prisma.location.delete({
                where:{
                    id : id
                }
            })
        }
        catch(err){
            throw err
        }
    }


}