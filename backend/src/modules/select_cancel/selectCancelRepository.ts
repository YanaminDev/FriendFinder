import { prisma } from "../../../lib/prisma";

export const selectCancelRepository = {
    getSelectCancel: async () => {
        try {
            return await prisma.select_Cancel.findMany()
        }
        catch (err) {
            console.error(err)
            throw new Error("Failed to fetch select cancel data")
        }
    },

    getSelectCancelById: async (id: string) => {
        try {
            return await prisma.select_Cancel.findUnique({
                where: {
                    id: id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to fetch select cancel data by id")
        }
    },

    createSelectCancel: async (data: { select_cancel: string }) => {
        try {
            return await prisma.select_Cancel.create({
                data: {
                    name: data.select_cancel
                }
            })
        }
        catch (err) {
            throw new Error("Failed to create select cancel data")
        }
    },

    deleteSelectCancel: async (data: { id: string }) => {
        try {
            return await prisma.select_Cancel.delete({
                where: {
                    id: data.id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to delete select cancel data")
        }
    },

    updateSelectCancel: async (data: { id: string, name: string }) => {
        try {
            return await prisma.select_Cancel.update({
                where: {
                    id: data.id
                },
                data: {
                    name: data.name
                }
            })
        }
        catch (err) {
            throw new Error("Failed to update select cancel data")
        }
    },
}
