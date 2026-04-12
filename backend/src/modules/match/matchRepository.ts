import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";
import {
    CreateMatchSchema,
    GetMatchSchema,
    UpdateMatchLocationSchema,
    UpdateMatchCancelStatusSchema,
    UpdateMatchEndSchema,
    DeleteMatchSchema
} from "./matchModel";
import { z } from "zod";

type CreateMatchInput = z.infer<typeof CreateMatchSchema>;
type GetMatchInput = z.infer<typeof GetMatchSchema>;
type UpdateMatchLocationInput = z.infer<typeof UpdateMatchLocationSchema>;
type UpdateMatchCancelStatusInput = z.infer<typeof UpdateMatchCancelStatusSchema>;
type UpdateMatchEndInput = z.infer<typeof UpdateMatchEndSchema>;
type DeleteMatchInput = z.infer<typeof DeleteMatchSchema>;

export const matchRepository = {
    getMatchById: async (data: GetMatchInput) => {
        try {
            return await prisma.match.findUnique({
                where: {
                    id: data.match_id
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    createMatch: async (data: CreateMatchInput) => {
        try {
            // ยกเลิก findMatch ของทั้งคู่เมื่อ match สำเร็จ
            await prisma.find_Match.deleteMany({
                where: {
                    OR: [
                        { user_id: data.user1_id },
                        { user_id: data.user2_id }
                    ]
                }
            });

            return await prisma.match.create({
                data: {
                    user1_id: data.user1_id,
                    user2_id: data.user2_id,
                    activity_id: data.activity_id,
                    position_id: data.position_id,
                    ...(data.location_id !== undefined && { location_id: data.location_id }),
                    ...(data.end_date !== undefined && { end_date: new Date(data.end_date) })
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    updateMatchCancelStatus: async (match_id: string, data: UpdateMatchCancelStatusInput) => {
        try {
            return await prisma.match.update({
                where: {
                    id: match_id
                },
                data: {
                    cancel_status: data.cancel_status
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    updateMatchEndDate: async (match_id: string, data: UpdateMatchEndInput) => {
        try {
            return await prisma.match.update({
                where: {
                    id: match_id
                },
                data: {
                    end_date: data.end_date ? new Date(data.end_date) : null
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    updateMatchLocation: async (match_id: string, data: UpdateMatchLocationInput) => {
        try {
            return await prisma.match.update({
                where: {
                    id: match_id
                },
                data: {
                    location_id: data.location_id
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    deleteMatch: async (data: DeleteMatchInput) => {
        try {
            return await prisma.match.delete({
                where: {
                    id: data.match_id
                }
            })
        }
        catch(err) {
            throw err
        }
    }
}