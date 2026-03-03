import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";
import { hashPassword, verifyPassword } from "../../common/utils/hashPassword";


export const userRepository = {
    register: async (data: Prisma.UserCreateInput) => {
        try{
            const existingUser = await prisma.user.findUnique({
            where: {
                username: data.username
            }
        })
        if (existingUser) {
            throw new Error("Username already exists")
        }

        data.password = await hashPassword(data.password)

        return await prisma.user.create({
            data : {
                user_show_name: data.user_show_name,
                username: data.username,
                password: data.password,
                sex: data.sex,
                age: data.age,
                birth_of_date: new Date(data.birth_of_date),
                interested_gender: data.interested_gender
            }
            
        })
        }
        catch(err){
            console.error(err)
            throw new Error("Registration failed")
        }
        
    },

    login : async (data: {username: string, password: string}) => {
        try{
            const user = await prisma.user.findUnique({
                where: {
                    username: data.username
                }
            })
            if (!user) {
                throw new Error("Invalid Credentials")
            }
            const isPasswordValid = await verifyPassword(user.password, data.password)
            if (!isPasswordValid) {
                throw new Error("Invalid Credentials")
            }
            return user
        }
        catch(err){
            throw new Error("Invalid Credentials")
        }
    },


    deleteUser : async (id : string) => {
        try{
            const user = await prisma.user.delete({
                where :{
                    user_id : id
                }
            })
            return user

        }
        catch(err){
            throw new Error("Failed to delete user")
        }
    },

    deleteUserByAdmin : async (id : string) => {
        try{
            const user = await prisma.user.delete({
                where :{
                    user_id : id
                }
            })
            return user

        }
        catch(err){
            throw new Error("Failed to delete user")
        }
    }


}