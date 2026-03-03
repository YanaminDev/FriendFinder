import { prisma } from "../../../lib/prisma";

export const educationRepository = {
    getEducation: async () => {
        try {
            return await prisma.education.findMany()
        }
        catch (err) {
            console.error(err)
            throw new Error("Failed to fetch education data")
        }
    },

    getEducationById: async (id: number) => {
        try {
            return await prisma.education.findUnique({
                where: {
                    id: id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to fetch education data by id")
        }
    },

    createEducation: async (data: { education: string }) => {
        try {
            return await prisma.education.create({
                data: {
                    name: data.education
                }
            })
        }
        catch (err) {
            throw new Error("Failed to create education data")
        }
    },

    deleteEducation: async (data: { id: number }) => {
        try {
            return await prisma.education.delete({
                where: {
                    id: data.id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to delete education data")
        }
    },

    updateEducation: async (data: { id: number, name: string }) => {
        try {
            return await prisma.education.update({
                where: {
                    id: data.id
                },
                data: {
                    name: data.name
                }
            })
        }
        catch (err) {
            throw new Error("Failed to update education data")
        }
    },
}
