import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";
import { hashPassword, verifyPassword } from "../../common/utils/hashPassword";


export const userRepository = {
    findByUsername: async (username: string) => {
        return await prisma.user.findUnique({
            where: { username }
        })
    },

    register: async (data: Prisma.UserCreateInput) => {
        const existingUser = await userRepository.findByUsername(data.username)
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
            if (user.isBanned) {
                throw new Error("Your account has been banned")
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
    },

    getProfile: async (user_id: string) => {
        return await prisma.user.findUnique({
            where: { user_id },
            select: {
                user_id: true,
                username: true,
                user_show_name: true,
                sex: true,
                age: true,
                birth_of_date: true,
                interested_gender: true,
                role: true,
            }
        })
    },

    updateUserShowName: async (user_id: string, user_show_name: string) => {
        try {
            return await prisma.user.update({
                where: { user_id },
                data: { user_show_name }
            })
        } catch (err) {
            throw new Error("Failed to update user show name")
        }
    },

    updateUserInterestedGender: async (user_id: string, interested_gender: string) => {
        try {
            return await prisma.user.update({
                where: { user_id },
                data: { interested_gender: interested_gender as any }
            })
        } catch (err) {
            throw new Error("Failed to update interested gender")
        }
    },

    setUserOnline: async (user_id: string, isOnline: boolean) => {
        try {
            return await prisma.user.update({
                where: { user_id },
                data: { isOnline }
            })
        } catch (err) {
            throw new Error("Failed to update user online status")
        }
    },

    getOnlineStatus: async (user_id: string) => {
        try {
            const user = await prisma.user.findUnique({
                where: { user_id },
                select: { isOnline: true }
            })
            return user?.isOnline ?? false
        } catch (err) {
            throw new Error("Failed to get user online status")
        }
    }

}