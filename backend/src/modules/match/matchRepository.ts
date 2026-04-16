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
                },
                include: {
                    activity: true,
                    position: true,
                    location: true,
                    user1: { select: { user_id: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } },
                    user2: { select: { user_id: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } },
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    getActiveByUser: async (user_id: string) => {
        try {
            return await prisma.match.findFirst({
                where: {
                    cancel_status: false,
                    end_date: null,
                    OR: [{ user1_id: user_id }, { user2_id: user_id }],
                },
                orderBy: { createdAt: "desc" },
                include: {
                    activity: true,
                    position: true,
                    location: true,
                    user1: { select: { user_id: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } },
                    user2: { select: { user_id: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } },
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    getEndedByUser: async (user_id: string) => {
        try {
            return await prisma.match.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { end_date: { not: null } },
                                { cancel_status: true }
                            ]
                        },
                        {
                            OR: [{ user1_id: user_id }, { user2_id: user_id }]
                        }
                    ]
                },
                orderBy: { createdAt: "desc" },
                include: {
                    activity: true,
                    position: true,
                    location: true,
                    user1: { select: { user_id: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } },
                    user2: { select: { user_id: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } },
                    experience: {
                        where: { reviewer_id: user_id },
                        select: { id: true, content: true, status: true, createdAt: true, reviewee: { select: { user_id: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } } }
                    },
                    location_review: {
                        where: { user_id: user_id },
                        select: { id: true, review_text: true, status: true, createdAt: true }
                    },
                    user_review: {
                        where: { user_id: user_id },
                        select: { id: true, review_text: true, status: true, createdAt: true, reviewed_user: { select: { user_id: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } } }
                    }
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

            const match = await prisma.match.create({
                data: {
                    user1_id: data.user1_id,
                    user2_id: data.user2_id,
                    activity_id: data.activity_id,
                    position_id: data.position_id,
                    ...(data.location_id !== undefined && { location_id: data.location_id }),
                    ...(data.end_date !== undefined && { end_date: new Date(data.end_date) })
                }
            });

            // สร้าง chat ระหว่างทั้งคู่ (ถ้ายังไม่มี)
            const existingChat = await prisma.chat.findFirst({
                where: {
                    OR: [
                        { user1_id: data.user1_id, user2_id: data.user2_id },
                        { user1_id: data.user2_id, user2_id: data.user1_id },
                    ]
                }
            });
            if (!existingChat) {
                await prisma.chat.create({
                    data: {
                        user1_id: data.user1_id,
                        user2_id: data.user2_id,
                    }
                });
            }

            return match;
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
    },

    getAllMatchesWithReviews: async () => {
        try {
            return await prisma.match.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    user1: { select: { user_id: true, username: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } },
                    user2: { select: { user_id: true, username: true, user_show_name: true, images: { take: 1, select: { imageUrl: true } } } },
                    activity: { select: { name: true, icon: true } },
                    location: {
                        select: {
                            name: true,
                            location_image: {
                                take: 1,
                                orderBy: { createdAt: 'asc' },
                                select: { imageUrl: true }
                            }
                        }
                    },
                    position: { select: { name: true } },
                    experience: {
                        include: {
                            reviewer: { select: { user_id: true, username: true } },
                            reviewee: { select: { user_id: true, username: true } }
                        }
                    },
                    location_review: {
                        include: {
                            user: { select: { user_id: true, username: true } },
                            location: { select: { name: true } }
                        }
                    },
                    cancellation: {
                        include: {
                            reviewer: { select: { user_id: true, username: true } },
                            reviewee: { select: { user_id: true, username: true } },
                            quick_select: true
                        }
                    }
                }
            })
        }
        catch(err) {
            throw err
        }
    }
}