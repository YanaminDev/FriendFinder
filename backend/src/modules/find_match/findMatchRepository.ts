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
            // ค้นหา user ที่มี position เดียวกัน + มี activity คล้ายกันอย่างน้อย 1 ตัว
            const activityIds = [data.activity_id1, data.activity_id2, data.activity_id3].filter(Boolean);

            const activityConditions = activityIds.length > 0
                ? {
                    OR: activityIds.flatMap((id) => [
                        { activity_id1: id },
                        { activity_id2: id },
                        { activity_id3: id },
                    ])
                }
                : {};

            return await prisma.find_Match.findMany({
                where: {
                    ...(data.position_id && { position_id: data.position_id }),
                    ...activityConditions,
                    position: {
                        isHidden: false
                    }
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
            return await prisma.find_Match.upsert({
                where: { user_id: data.user_id },
                update: {
                    position_id: data.position_id,
                    activity_id1: data.activity_id1 ?? null,
                    activity_id2: data.activity_id2 ?? null,
                    activity_id3: data.activity_id3 ?? null,
                },
                create: {
                    user_id: data.user_id,
                    position_id: data.position_id,
                    activity_id1: data.activity_id1 ?? null,
                    activity_id2: data.activity_id2 ?? null,
                    activity_id3: data.activity_id3 ?? null,
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
            // Use deleteMany so it doesn't error if record doesn't exist (might be already deleted when match was created)
            return await prisma.find_Match.deleteMany({
                where: {
                    user_id: data.user_id
                }
            });
        }
        catch (err) {
            console.error("Delete find match error for user:", data.user_id, err);
            throw err;
        }
    }
};
