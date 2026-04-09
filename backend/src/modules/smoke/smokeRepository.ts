import { prisma } from "../../../lib/prisma";

export const smokeRepository = {
    getSmoke: async () => {
        try {
            return await prisma.smoke.findMany()
        }
        catch (err) {
            console.error(err)
            throw new Error("Failed to fetch smoke data")
        }
    },

    getSmokeById: async (id: string) => {
        try {
            return await prisma.smoke.findUnique({
                where: {
                    id: id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to fetch smoke data by id")
        }
    },

    createSmoke: async (data: { smoke: string, icon: string }) => {
        try {
            return await prisma.smoke.create({
                data: {
                    name: data.smoke,
                    icon: data.icon
                }
            })
        }
        catch (err) {
            throw new Error("Failed to create smoke data")
        }
    },

    deleteSmoke: async (data: { id: string }) => {
        try {
            return await prisma.smoke.delete({
                where: {
                    id: data.id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to delete smoke data")
        }
    },

    updateSmoke: async (data: { id: string, name: string, icon: string }) => {
        try {
            return await prisma.smoke.update({
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
            throw new Error("Failed to update smoke data")
        }
    },
}
