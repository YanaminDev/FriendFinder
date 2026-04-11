import { prisma } from "../../../lib/prisma";
import {
    CreatePositionSchema,
    GetPositionSchema,
    UpdatePositionSchema,
    DeletePositionSchema,
    SearchPositionSchema
} from "./positionModel";
import { z } from "zod";

type CreatePositionInput = z.infer<typeof CreatePositionSchema>;
type GetPositionInput = z.infer<typeof GetPositionSchema>;
type UpdatePositionInput = z.infer<typeof UpdatePositionSchema>;
type DeletePositionInput = z.infer<typeof DeletePositionSchema>;
type SearchPositionInput = z.infer<typeof SearchPositionSchema>;

export const positionRepository = {
    createPosition: async (data: CreatePositionInput) => {
        try {
            return await prisma.position.create({
                data: {
                    name: data.name,
                    information: data.information,
                    phone: data.phone,
                    open_date: data.open_date,
                    open_time: data.open_time,
                    close_time: data.close_time,
                    image: data.image,
                    latitude: data.latitude,
                    longitude: data.longitude
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getPosition: async (data: GetPositionInput) => {
        try {
            return await prisma.position.findUnique({
                where: {
                    id: data.position_id
                },
                include: {
                    find_match: true,
                    location: true,
                    match: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    updatePosition: async (data: UpdatePositionInput) => {
        try {
            return await prisma.position.update({
                where: {
                    id: data.position_id
                },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.information && { information: data.information }),
                    ...(data.phone && { phone: data.phone }),
                    ...(data.open_date && { open_date: data.open_date }),
                    ...(data.open_time && { open_time: data.open_time }),
                    ...(data.close_time && { close_time: data.close_time }),
                    ...(data.image && { image: data.image }),
                    ...(data.latitude && { latitude: data.latitude }),
                    ...(data.longitude && { longitude: data.longitude })
                },
                include: {
                    find_match: true,
                    location: true,
                    match: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    deletePosition: async (data: DeletePositionInput) => {
        try {
            return await prisma.position.delete({
                where: {
                    id: data.position_id
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getAllPositions: async () => {
        try {
            return await prisma.position.findMany();
        }
        catch (err) {
            throw err;
        }
    },

    searchPosition: async (data: SearchPositionInput) => {
        try {
            return await prisma.position.findMany({
                where: {
                    latitude: {
                        gte: data.user_latitude - data.radius,
                        lte: data.user_latitude + data.radius
                    },
                    longitude: {
                        gte: data.user_longitude - data.radius,
                        lte: data.user_longitude + data.radius
                    }
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    updatePositionImage: async (positionId: string, imageUrl: string) => {
        try {
            return await prisma.position.update({
                where: { id: positionId },
                data: { image: imageUrl }
            });
        }
        catch (err) {
            throw err;
        }
    }
};