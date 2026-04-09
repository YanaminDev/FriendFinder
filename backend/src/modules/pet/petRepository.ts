import { prisma } from "../../../lib/prisma";

export const petRepository = {
    getPet: async () => {
        try {
            return await prisma.pet.findMany()
        }
        catch (err) {
            console.error(err)
            throw new Error("Failed to fetch pet data")
        }
    },

    getPetById: async (id: string) => {
        try {
            return await prisma.pet.findUnique({
                where: {
                    id: id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to fetch pet data by id")
        }
    },

    createPet: async (data: { pet: string, icon: string }) => {
        try {
            return await prisma.pet.create({
                data: {
                    name: data.pet,
                    icon: data.icon
                }
            })
        }
        catch (err) {
            throw new Error("Failed to create pet data")
        }
    },

    deletePet: async (data: { id: string }) => {
        try {
            return await prisma.pet.delete({
                where: {
                    id: data.id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to delete pet data")
        }
    },

    updatePet: async (data: { id: string, name: string, icon: string }) => {
        try {
            return await prisma.pet.update({
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
            throw new Error("Failed to update pet data")
        }
    },
}
