import { prisma } from "../../../lib/prisma";
import { CreateUserReview, GetUserReview, GetUserReviewByMatchId, DeleteUserReview } from "./userReviewModel";

export const userReviewRepository = {
  // Create a user review
  createUserReview: async (data: CreateUserReview) => {
    return await prisma.user_Review.create({
      data: {
        user_id: data.user_id,
        reviewed_user_id: data.reviewed_user_id,
        status: data.status,
        review_text: data.review_text,
        match_id: data.match_id,
      },
      include: {
        user: {
          select: { user_id: true, user_show_name: true }
        },
        reviewed_user: {
          select: { user_id: true, user_show_name: true }
        }
      }
    });
  },

  // Get review by ID
  getUserReviewById: async (review_id: string) => {
    return await prisma.user_Review.findUnique({
      where: { id: review_id },
      include: {
        user: { select: { user_id: true, user_show_name: true } },
        reviewed_user: { select: { user_id: true, user_show_name: true } }
      }
    });
  },

  // Get all reviews about a user
  getUserReviewsByUser: async (data: GetUserReview) => {
    return await prisma.user_Review.findMany({
      where: { reviewed_user_id: data.reviewed_user_id },
      include: {
        user: { select: { user_id: true, user_show_name: true } },
        reviewed_user: { select: { user_id: true, user_show_name: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  // Get reviews by match
  getUserReviewsByMatchId: async (data: GetUserReviewByMatchId) => {
    return await prisma.user_Review.findMany({
      where: { match_id: data.match_id },
      include: {
        user: { select: { user_id: true, user_show_name: true } },
        reviewed_user: { select: { user_id: true, user_show_name: true } }
      }
    });
  },

  // Delete review by user
  deleteUserReview: async (data: DeleteUserReview, userId: string) => {
    const review = await prisma.user_Review.findUnique({
      where: { id: data.review_id }
    });

    if (!review || review.user_id !== userId) {
      throw new Error("Unauthorized to delete this review");
    }

    return await prisma.user_Review.delete({
      where: { id: data.review_id }
    });
  },

  // Delete review by admin
  deleteUserReviewByAdmin: async (data: DeleteUserReview) => {
    return await prisma.user_Review.delete({
      where: { id: data.review_id }
    });
  }
};
