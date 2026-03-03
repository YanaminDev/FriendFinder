import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";

export const languageRepository = {
    getLanguage : async () => {
        try {
            return await prisma.language.findMany()
        }
        catch(err){
            console.error(err)
            throw new Error("Failed to fetch language data")
        }
    },
    
    getLanguageById : async (id : number) => {
        try{
            return await prisma.language.findUnique({
                where : {
                    id : id
                }
            })
        }
        catch(err){
            throw new Error("Failed to fetch language data by id")
        }
    },

    createLanguage : async (data : {language : string}) => {
        try{
            return await prisma.language.create({
                data : {
                    name : data.language
                }
            })
        }
        catch(err){
            throw new Error("Failed to create language data")
        }
    },


    deleteLanguage : async (data : {id : number}) => {
        try{
            return await prisma.language.delete({
                where : {
                    id : data.id
                }
            })
        }
        catch(err){
            throw new Error("Failed to delete language data")
        }
    },

    updateLanguage : async (data : {id : number , name : string}) => {
        try{
            return await prisma.language.update({
                where : {
                    id : data.id
                },
                data : {
                    name : data.name
                }
            })
        }
        catch(err){
            throw new Error("Failed to update language data")
        }
    },

    

}