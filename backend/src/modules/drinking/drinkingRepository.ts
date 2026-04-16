import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";

export const drinkingRepository = {
    getDrinking : async () => {
        try {
            return await prisma.drinking.findMany()
        }
        catch(err){
            console.error(err)
            throw new Error("Failed to fetch drinking for data")
        }
    },

    getDrinkingById : async (id : string) => {
        try{
            return await prisma.drinking.findUnique({
                where : {
                    id : id
                }
            })
        }
        catch(err){
            throw new Error("Failed to fetch drinking data by id")
        }
    },

    createDrinking : async (data : {drinking : string, icon : string}) => {
        try{
            return await prisma.drinking.create({
                data : {
                    name : data.drinking,
                    icon : data.icon
                }
            })
        }
        catch(err){
            throw new Error("Failed to create drinking for data")
        }
    },


    deleteDrinking : async (data : {id :string}) => {
        try{
            return await prisma.drinking.delete({
                where : {
                    id : data.id
                }
            })
        }
        catch(err){
            throw new Error("Failed to delete drinking data")
        }
    },

    updateDrinking : async (data : {id : string , name : string, icon : string}) => {
        try{
            return await prisma.drinking.update({
                where : {
                    id : data.id
                },
                data : {
                    name : data.name,
                    icon : data.icon
                }
            })
        }
        catch(err){
            throw new Error("Failed to update drinking data")
        }
    },

    

}