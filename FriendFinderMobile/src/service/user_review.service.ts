import {
    CREATE_USER_REVIEW,
    GET_USER_REVIEW_BY_ID,
    GET_USER_REVIEWS_BY_REVIEWER,
    GET_USER_REVIEWS_BY_REVIEWEE,
    DELETE_USER_REVIEW,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreateUserReviewRequest {
    user_id: string;
    reviewed_user_id: string;
    status: 0 | 1;
    review_text?: string;
    match_id: string;
}

export interface UserReview {
    id: string;
    user_id: string;
    reviewed_user_id: string;
    status: number;
    review_text?: string;
    createdAt: string;
    match_id: string;
    user?: any;
    reviewedUser?: any;
    match?: any;
}

export const createUserReview = async (data: CreateUserReviewRequest): Promise<UserReview> => {
    try {
        return await mainApi.post<UserReview>(CREATE_USER_REVIEW, data);
    } catch (error) {
        console.error("Error creating user review:", error);
        throw error;
    }
};

export const getUserReviewById = async (review_id: string): Promise<UserReview> => {
    try {
        const endpoint = GET_USER_REVIEW_BY_ID.replace(":review_id", review_id);
        return await mainApi.get<UserReview>(endpoint);
    } catch (error) {
        console.error("Error getting user review:", error);
        throw error;
    }
};

export const getUserReviewsByReviewer = async (user_id: string): Promise<UserReview[]> => {
    try {
        const endpoint = GET_USER_REVIEWS_BY_REVIEWER.replace(":user_id", user_id);
        return await mainApi.get<UserReview[]>(endpoint);
    } catch (error) {
        console.error("Error getting user reviews by reviewer:", error);
        throw error;
    }
};

export const getUserReviewsByReviewee = async (user_id: string): Promise<UserReview[]> => {
    try {
        const endpoint = GET_USER_REVIEWS_BY_REVIEWEE.replace(":user_id", user_id);
        return await mainApi.get<UserReview[]>(endpoint);
    } catch (error) {
        console.error("Error getting user reviews by reviewee:", error);
        throw error;
    }
};

export const deleteUserReview = async (review_id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_USER_REVIEW, { review_id });
    } catch (error) {
        console.error("Error deleting user review:", error);
        throw error;
    }
};
