import { prisma } from "../../../lib/prisma";
import {
    CreateCancellationSchema,
    GetCancellationSchema,
    GetCancellationByMatchSchema,
    GetCancellationByUserSchema,
    GetCancellationByReviewerSchema,
    DeleteCancellationSchema
} from "./cancellationModel";
import { z } from "zod";

type CreateCancellationInput = z.infer<typeof CreateCancellationSchema>;
type GetCancellationInput = z.infer<typeof GetCancellationSchema>;
type GetCancellationByMatchInput = z.infer<typeof GetCancellationByMatchSchema>;
type GetCancellationByUserInput = z.infer<typeof GetCancellationByUserSchema>;
type GetCancellationByReviewerInput = z.infer<typeof GetCancellationByReviewerSchema>;
type DeleteCancellationInput = z.infer<typeof DeleteCancellationSchema>;

export const cancellationRepository = {
    createCancellation: async (data: CreateCancellationInput) => {
        try {
            return await prisma.cancellation.create({
                data: {
                    content: data.content,
                    match_id: data.match_id,
                    reviewer_id: data.reviewer_id,
                    reviewee_id: data.reviewee_id,
                    quick_select_id: data.quick_select_id
                },
                include: {
                    match: true,
                    quick_select: true,
                    reviewer: true,
                    reviewee: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getCancellation: async (data: GetCancellationInput) => {
        try {
            return await prisma.cancellation.findUnique({
                where: {
                    id: data.cancellation_id
                },
                include: {
                    match: true,
                    quick_select: true,
                    reviewer: true,
                    reviewee: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getCancellationByMatch: async (data: GetCancellationByMatchInput) => {
        try {
            return await prisma.cancellation.findMany({
                where: {
                    match_id: data.match_id
                },
                include: {
                    match: true,
                    quick_select: true,
                    reviewer: true,
                    reviewee: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getCancellationByUser: async (data: GetCancellationByUserInput) => {
        try {
            return await prisma.cancellation.findMany({
                where: {
                    OR: [
                        { reviewer_id: data.user_id },
                        { reviewee_id: data.user_id }
                    ]
                },
                include: {
                    match: true,
                    quick_select: true,
                    reviewer: true,
                    reviewee: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getCancellationByReviewer: async (data: GetCancellationByReviewerInput) => {
        try {
            return await prisma.cancellation.findMany({
                where: {
                    reviewer_id: data.reviewer_id
                },
                include: {
                    match: true,
                    quick_select: true,
                    reviewer: true,
                    reviewee: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    deleteCancellation: async (data: DeleteCancellationInput) => {
        try {
            return await prisma.cancellation.delete({
                where: {
                    id: data.cancellation_id
                }
            });
        }
        catch (err) {
            throw err;
        }
    }
};