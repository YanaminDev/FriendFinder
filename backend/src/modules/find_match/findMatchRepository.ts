import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";
import {
    CreateFindMatchSchema,
    SearchFindMatchSchema,
    GetFindMatchSchema,
    DeleteFindMatchSchema,
    UpdateFindMatchSchema
} from "./findMatchModel";
import { z } from "zod";

type CreateFindMatchInput = z.infer<typeof CreateFindMatchSchema>;
type GetFindMatchInput = z.infer<typeof GetFindMatchSchema>;
type DeleteFindMatchInput = z.infer<typeof DeleteFindMatchSchema>;
type SearchFindMatchInput = z.infer<typeof SearchFindMatchSchema>;
type UpdateFindMatchInput = z.infer<typeof UpdateFindMatchSchema>;

export const findMatchRepository = {
    getFindMatchByUserId: async (data: GetFindMatchInput) => {
        try {
            return await prisma.find_Match.findUnique({
                where: {
                    user_id: data.user_id
                },
                include: {
                    activity1: true,
                    activity2: true,
                    activity3: true,
                    position: true,
                    user: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    searchFindMatch: async (data: SearchFindMatchInput) => {
        try {
            return await  prisma.find_Match.findMany({
                where: {
                    ...(data.position_id && { position_id: data.position_id }),
                    ...(data.activity_id1 && { activity_id1: data.activity_id1 }),
                    ...(data.activity_id2 && { activity_id2: data.activity_id2 }),
                    ...(data.activity_id3 && { activity_id3: data.activity_id3 })
                },
                include: {
                    activity1: true,
                    activity2: true,
                    activity3: true,
                    position: true,
                    user: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    updateFindMatch: async (data: UpdateFindMatchInput) => {
        try {
            return await  prisma.find_Match.update({
                where: {
                    user_id: data.user_id
                },
                data: {
                    ...(data.position_id && { position_id: data.position_id }),
                    ...(data.activity_id1 && { activity_id1: data.activity_id1 }),
                    ...(data.activity_id2 && { activity_id2: data.activity_id2 }),
                    ...(data.activity_id3 && { activity_id3: data.activity_id3 })
                },
                include: {
                    activity1: true,
                    activity2: true,
                    activity3: true,
                    position: true,
                    user: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    createFindMatch: async (data: CreateFindMatchInput) => {
        try {
            return await prisma.find_Match.create({
                data: {
                    user_id: data.user_id,
                    position_id: data.position_id,
                    ...(data.activity_id1 && { activity_id1: data.activity_id1 }),
                    ...(data.activity_id2 && { activity_id2: data.activity_id2 }),
                    ...(data.activity_id3 && { activity_id3: data.activity_id3 })
                },
                include: {
                    activity1: true,
                    activity2: true,
                    activity3: true,
                    position: true,
                    user: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    deleteFindMatch: async (data: DeleteFindMatchInput) => {
        try {
            return await prisma.find_Match.delete({
                where: {
                    user_id: data.user_id
                }
            });
        }
        catch (err) {
            throw err;
        }
    }
};
