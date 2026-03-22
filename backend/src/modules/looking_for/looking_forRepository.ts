import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";

export const lookingForRepository = {
    getLookingFor : async () => {
        try {
            return await prisma.looking_for.findMany()
        }
        catch(err){
            console.error(err)
            throw new Error("Failed to fetch looking for data")
        }
    },
    
    getLookingForById : async (id : string) => {
        try{
            return await prisma.looking_for.findUnique({
                where : {
                    id : id
                }
            })
        }
        catch(err){
            throw new Error("Failed to fetch looking for data by id")
        }
    },

    createLookingFor : async (data : {looking_for : string}) => {
        try{
            return await prisma.looking_for.create({
                data : {
                    name : data.looking_for
                }
            })
        }
        catch(err){
            throw new Error("Failed to create looking for data")
        }
    },


    deleteLookingFor : async (data : {id : string}) => {
        try{
            return await prisma.looking_for.delete({
                where : {
                    id : data.id
                }
            })
        }
        catch(err){
            throw new Error("Failed to delete looking for data")
        }
    },

    updateLookingFor : async (data : {id : string , name : string}) => {
        try{
            return await prisma.looking_for.update({
                where : {
                    id : data.id
                },
                data : {
                    name : data.name
                }
            })
        }
        catch(err){
            throw new Error("Failed to update looking for data")
        }
    },

    

}