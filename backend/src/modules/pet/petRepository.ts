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

    getPetById: async (id: number) => {
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

    createPet: async (data: { pet: string }) => {
        try {
            return await prisma.pet.create({
                data: {
                    name: data.pet
                }
            })
        }
        catch (err) {
            throw new Error("Failed to create pet data")
        }
    },

    deletePet: async (data: { id: number }) => {
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

    updatePet: async (data: { id: number, name: string }) => {
        try {
            return await prisma.pet.update({
                where: {
                    id: data.id
                },
                data: {
                    name: data.name
                }
            })
        }
        catch (err) {
            throw new Error("Failed to update pet data")
        }
    },
}
