import { prisma } from "../../../lib/prisma";

export const workoutRepository = {
    getWorkout: async () => {
        try {
            return await prisma.workout.findMany()
        }
        catch (err) {
            console.error(err)
            throw new Error("Failed to fetch workout data")
        }
    },

    getWorkoutById: async (id: string) => {
        try {
            return await prisma.workout.findUnique({
                where: {
                    id: id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to fetch workout data by id")
        }
    },

    createWorkout: async (data: { workout: string }) => {
        try {
            return await prisma.workout.create({
                data: {
                    name: data.workout
                }
            })
        }
        catch (err) {
            throw new Error("Failed to create workout data")
        }
    },

    deleteWorkout: async (data: { id: string }) => {
        try {
            return await prisma.workout.delete({
                where: {
                    id: data.id
                }
            })
        }
        catch (err) {
            throw new Error("Failed to delete workout data")
        }
    },

    updateWorkout: async (data: { id: string, name: string }) => {
        try {
            return await prisma.workout.update({
                where: {
                    id: data.id
                },
                data: {
                    name: data.name
                }
            })
        }
        catch (err) {
            throw new Error("Failed to update workout data")
        }
    },
}
