import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";
import { Blood_Group } from '../../../generated/prisma/enums';
import { ca } from "zod/v4/locales";

export const userInformationRepository = {
    createUserInformation : async (userId: string, user_height : number , user_bio? : string , blood_group? : Blood_Group , language_id? : string , education_id? : string) => {
        try{
            return await prisma.user_Information.create({
                data:{
                    user_id: userId,
                    user_height: user_height,
                    user_bio,
                    blood_group,
                    language_id,
                    education_id
                }
            })
        }
        catch(err){
            throw (err)
        }
    },

    getUserInformation : async (userId : string) => {
        try{
            const userInformation = await prisma.user_Information.findUnique({
                where :{
                    user_id : userId
                }
            })
            return userInformation
        }
        catch(err){
            throw (err)
        }
    },

   updateUserInformationBio : async (userId: string, bio : string) => {
        try{
            return await prisma.user_Information.update({
                where : {
                    user_id : userId
                },
                data : {
                    user_bio : bio
                }
            })
        }
        catch(err){
            throw (err)
        }
   },

   updateUserInformationHeight : async (userId: string, height: number) => {
        try{
            return await prisma.user_Information.update({
                where : {
                    user_id : userId
                },
                data : {
                    user_height : height
                }
            })
        }
        catch(err){
            throw (err)
        }
   },

   updateUserInformationBloodGroup : async (userId: string, blood_group: Blood_Group) => {
        try{
            return await prisma.user_Information.update({
                where : {
                    user_id : userId
                },
                data : {
                    blood_group : blood_group
                }
            })
        }
        catch(err){
            throw (err)
        }
   },

   updateUserInformationLanguage : async (userId: string, language_id: string) => {
        try{
            return await prisma.user_Information.update({
                where : {
                    user_id : userId
                },
                data : {
                    language_id : language_id
                }
            })
        }
        catch(err){
            throw (err)
        }
   },

   updateUserInformationEducation : async (userId: string, education_id: string) => {
        try{
            return await prisma.user_Information.update({
                where : {
                    user_id : userId
                },
                data : {
                    education_id : education_id
                }
            })
        }
        catch(err){
            throw (err)
        }
   },





}

