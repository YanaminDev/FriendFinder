import { prisma } from "../../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";
import {
    CreateLocationReviewSchema,
    GetLocationReviewSchema,
    GetUserLocationReviewSchema,
    GetLocationReviewByMatchIdSchema,
    DeleteLocationReviewSchema
} from "./locationReviewModel";
import { z } from "zod";

type CreateLocationReviewInput = z.infer<typeof CreateLocationReviewSchema>;
type GetLocationReviewInput = z.infer<typeof GetLocationReviewSchema>;
type GetUserLocationReviewInput = z.infer<typeof GetUserLocationReviewSchema>;
type GetLocationReviewByMatchIdInput = z.infer<typeof GetLocationReviewByMatchIdSchema>;
type DeleteLocationReviewInput = z.infer<typeof DeleteLocationReviewSchema>;

export const locationReviewRepository = {
    getLocationReviewById: async (review_id: string) => {
        try {
            return await prisma.location_review.findUnique({
                where: {
                    id: review_id
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    getLocationReviewsByLocation: async (data: GetLocationReviewInput) => {
        try {
            return await prisma.location_review.findMany({
                where: {
                    location_id: data.location_id
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    getLocationReviewsByUser: async (data: GetUserLocationReviewInput) => {
        try {
            return await prisma.location_review.findMany({
                where: {
                    user_id: data.user_id
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    getLocationReviewsByMatchId: async (data: GetLocationReviewByMatchIdInput) => {
        try {
            return await prisma.location_review.findMany({
                where: {
                    match_id: data.match_id
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    createLocationReview: async (data: CreateLocationReviewInput) => {
        try {
            return await prisma.location_review.create({
                data: {
                    user_id: data.user_id,
                    location_id: data.location_id,
                    status: data.status,
                    match_id: data.match_id,
                    ...(data.review_text !== "" && { review_text: data.review_text })
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    deleteLocationReview: async (data: DeleteLocationReviewInput , userId: string) => {
        try {
            return await prisma.location_review.delete({
                where: {
                    id: data.review_id,
                    user_id : userId
                }
            })
        }
        catch(err) {
            throw err
        }
    },

    deleteLocationReviewByAdmin: async (data: DeleteLocationReviewInput) => {
        try {
            return await prisma.location_review.delete({
                where: {
                    id: data.review_id,
                }
            })
        }
        catch(err) {
            throw err
        }
    }
}