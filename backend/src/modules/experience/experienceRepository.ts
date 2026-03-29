import { prisma } from "../../../lib/prisma";
import {
    CreateExperienceSchema,
    GetExperienceSchema,
    GetExperienceByMatchSchema,
    GetExperienceByReviewerSchema,
    GetExperienceByRevieweeSchema,
    UpdateExperienceSchema,
    DeleteExperienceSchema,
    GettotalExperienceFromUserSchema
} from "./experienceModel";
import { z } from "zod";

type CreateExperienceInput = z.infer<typeof CreateExperienceSchema>;
type GetExperienceInput = z.infer<typeof GetExperienceSchema>;
type GetExperienceByMatchInput = z.infer<typeof GetExperienceByMatchSchema>;
type GetExperienceByReviewerInput = z.infer<typeof GetExperienceByReviewerSchema>;
type GetExperienceByRevieweeInput = z.infer<typeof GetExperienceByRevieweeSchema>;
type UpdateExperienceInput = z.infer<typeof UpdateExperienceSchema>;
type DeleteExperienceInput = z.infer<typeof DeleteExperienceSchema>;
type GettotalExperienceFromUserInput = z.infer<typeof GettotalExperienceFromUserSchema>;

export const experienceRepository = {
    createExperience: async (data: CreateExperienceInput) => {
        try {
            return await prisma.experience.create({
                data: {
                    content: data.content,
                    status: data.status,
                    match_id: data.match_id,
                    reviewer_id: data.reviewer_id,
                    reviewee_id: data.reviewee_id
                },
                include: {
                    match: true,
                    reviewer: true,
                    reviewee: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getExperience: async (data: GetExperienceInput) => {
        try {
            return await prisma.experience.findUnique({
                where: {
                    id: data.experience_id
                },
                include: {
                    match: true,
                    reviewer: true,
                    reviewee: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getExperienceByMatch: async (data: GetExperienceByMatchInput) => {
        try {
            return await prisma.experience.findMany({
                where: {
                    match_id: data.match_id
                },
                include: {
                    match: true,
                    reviewer: true,
                    reviewee: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getExperienceByReviewer: async (data: GetExperienceByReviewerInput) => {
        try {
            return await prisma.experience.findMany({
                where: {
                    reviewer_id: data.reviewer_id
                },
                include: {
                    match: true,
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

    getExperienceByReviewee: async (data: GetExperienceByRevieweeInput) => {
        try {
            return await prisma.experience.findMany({
                where: {
                    reviewee_id: data.reviewee_id
                },
                include: {
                    match: true,
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

    updateExperience: async (data: UpdateExperienceInput) => {
        try {
            return await prisma.experience.update({
                where: {
                    id: data.experience_id
                },
                data: {
                    ...(data.content && { content: data.content }),
                    ...(data.status !== undefined && { status: data.status })
                },
                include: {
                    match: true,
                    reviewer: true,
                    reviewee: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    deleteExperience: async (data: DeleteExperienceInput) => {
        try {
            return await prisma.experience.delete({
                where: {
                    id: data.experience_id
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getTotalExperienceFromUser: async (data: GettotalExperienceFromUserInput) => {
        try {
            const experiences = await prisma.experience.findMany({
                where: {
                    reviewee_id: data.user_id
                }
            });

            const { totalLikes, totalDislikes } = experiences.reduce(
                (acc, exp) => {
                    if (exp.status === 1) {
                        acc.totalLikes++;
                    } else if (exp.status === 0) {
                        acc.totalDislikes++;
                    }
                    return acc;
                },
                { totalLikes: 0, totalDislikes: 0 }
            );

            const totalRating = experiences.length > 0 ? (totalLikes / experiences.length) * 100 : 0;

            return {
                user_id: data.user_id,
                totalReviews: experiences.length,
                totalLikes,
                totalDislikes,
                ratingPercentage: Math.round(totalRating)
            };
        }
        catch (err) {
            throw err;
        }
    }
};