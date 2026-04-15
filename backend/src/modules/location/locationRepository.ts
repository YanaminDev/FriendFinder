import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";
import { CreateLocationSchema, UpdateLocationSchema } from "./locationModel";
import { z } from "zod";
import { get } from "node:http";
import { askAIForLocationRecommendation } from "../../../lib/lllm";

type CreateLocationInput = z.infer<typeof CreateLocationSchema>;
type UpdateLocationInput = z.infer<typeof UpdateLocationSchema>;

export const locationRepository = {
    getLocationbyid : async (id:string) => {
        try{
            return await prisma.location.findUnique({
                where : {
                    id : id
                }
            })
        }
        catch(err){
            throw err
        }
    },

    getLocation : async () => {
        try{
            return await prisma.location.findMany()
        }
        catch(err){
            throw err
        }
    },

    getLocationByPositionId : async (position_id : string) => {
        try{
            return await prisma.location.findMany({
                where : {
                    position_id : position_id
                }
            })
        }catch(err){
            throw err
        }
    },

    getLocationWithImagesByPositionId : async (position_id : string) => {
        try{
            return await prisma.location.findMany({
                where : {
                    position_id : position_id
                },
                include : {
                    location_image : {
                        orderBy : { createdAt : 'asc' }
                    }
                }
            })
        }catch(err){
            throw err
        }
    },

    getLocationForMatch : async (user_id_1 : string , user_id_2 : string , position_id : string , activity_id : string) => {
        try{
            const [user1Info, user2Info, allLocations] = await Promise.all([
                prisma.user_Information.findUnique({
                    where: { user_id: user_id_1 },
                    select: { user_bio: true },
                }),
                prisma.user_Information.findUnique({
                    where: { user_id: user_id_2 },
                    select: { user_bio: true },
                }),
                prisma.location.findMany({
                    where: { position_id, activity_id },
                    include: {
                        activity: { select: { name: true } },
                        location_image: { take: 1, orderBy: { createdAt: 'asc' } },
                        location_review: {
                            select: { status: true, review_text: true },
                        },
                    },
                }),
            ]);

            if (allLocations.length <= 3) return allLocations;

            const activityName = allLocations[0]?.activity?.name;
            const recommendedIds = await askAIForLocationRecommendation(
                user1Info?.user_bio,
                user2Info?.user_bio,
                allLocations,
                activityName
            );

            const ordered = recommendedIds
                .map(id => allLocations.find(l => l.id === id))
                .filter((l): l is NonNullable<typeof l> => l !== undefined);

            const remaining = allLocations.filter(l => !recommendedIds.includes(l.id));
            while (ordered.length < 3 && remaining.length > 0) {
                ordered.push(remaining.shift()!);
            }

            return ordered;
        }
        catch(err){
            throw err
        }
    },

    createLocation : async (data : CreateLocationInput) => {
        try {
            // Create Position first if not provided
            let positionId = data.position_id;
            if (!positionId) {
                const newPosition = await prisma.position.create({
                    data: {
                        name: data.name,
                        latitude: data.latitude,
                        longitude: data.longitude,
                    }
                });
                positionId = newPosition.id;
            }

            return await prisma.location.create({
                data: {
                    name: data.name,
                    position_id : positionId,
                    activity_id : data.activity_id,
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.phone !== undefined && { phone: data.phone }),
                    ...(data.open_date !== undefined && { open_date: data.open_date }),
                    ...(data.open_time !== undefined && { open_time: data.open_time }),
                    ...(data.close_time !== undefined && { close_time: data.close_time }),
                }
            })
        }
        catch(err){
            throw err
        }
    },

    updateLocation : async (id : string, data : UpdateLocationInput) => {
        try {
            return await prisma.location.update({
                where: {
                    id: id
                },
                data: {
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.phone !== undefined && { phone: data.phone }),
                    ...(data.open_date !== undefined && { open_date: data.open_date }),
                    ...(data.open_time !== undefined && { open_time: data.open_time }),
                    ...(data.close_time !== undefined && { close_time: data.close_time }),
                }
            })
        }
        catch(err){
            throw err
        }
    },

    deleteLocation : async (id : string) => {
        try{
            return await prisma.$transaction(async (tx) => {
                await tx.location_image.deleteMany({ where: { location_id: id } })
                await tx.location_review.deleteMany({ where: { location_id: id } })
                await tx.match.deleteMany({ where: { location_id: id } })
                return await tx.location.delete({ where: { id: id } })
            })
        }
        catch(err){
            throw err
        }
    }


}