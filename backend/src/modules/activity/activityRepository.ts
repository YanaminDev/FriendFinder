import { prisma } from "../../../lib/prisma";

export const activityRepository = {
    getActivity: async () => {
        try {
            return await prisma.activity.findMany()
        }
        catch (err) {
            console.error(err)
            throw new Error("Failed to fetch activity data")
        }
    },

    getActivityById: async (id: number) => {
        try {
            return await prisma.activity.findUnique({
                where: {
                    id: id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to fetch activity data by id")
        }
    },

    createActivity: async (data: { activity: string }) => {
        try {
            return await prisma.activity.create({
                data: {
                    name: data.activity
                }
            })
        }
        catch (err) {
            throw new Error("Failed to create activity data")
        }
    },

    deleteActivity: async (data: { id: number }) => {
        try {
            return await prisma.activity.delete({
                where: {
                    id: data.id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to delete activity data")
        }
    },

    updateActivity: async (data: { id: number, name: string }) => {
        try {
            return await prisma.activity.update({
                where: {
                    id: data.id
                },
                data: {
                    name: data.name
                }
            })
        }
        catch (err) {
            throw new Error("Failed to update activity data")
        }
    },
}
