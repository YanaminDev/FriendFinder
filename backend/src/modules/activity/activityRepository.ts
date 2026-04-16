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

    getActivityWithLocationCount: async () => {
        try {
            const activities = await prisma.activity.findMany({
                include: {
                    _count: { select: { location: true } }
                }
            })
            return activities.map(a => ({
                id: a.id,
                name: a.name,
                icon: a.icon,
                locationCount: a._count.location
            }))
        }
        catch (err) {
            console.error(err)
            throw new Error("Failed to fetch activity data with location count")
        }
    },

    getActivityById: async (id: string) => {
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

    createActivity: async (data: { activity: string, icon: string }) => {
        try {
            return await prisma.activity.create({
                data: {
                    name: data.activity,
                    icon: data.icon
                }
            })
        }
        catch (err: any) {
            console.error("Activity create error:", err);
            throw new Error(err.message || "Failed to create activity data")
        }
    },

    deleteActivity: async (data: { id: string }) => {
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

    updateActivity: async (data: { id: string, name: string, icon: string }) => {
        try {
            return await prisma.activity.update({
                where: {
                    id: data.id
                },
                data: {
                    name: data.name,
                    icon: data.icon
                }
            })
        }
        catch (err) {
            throw new Error("Failed to update activity data")
        }
    },
}
