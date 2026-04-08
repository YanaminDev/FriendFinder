import {
    GET_LOCATION_REVIEW_BY_ID,
    GET_LOCATION_REVIEWS_BY_LOCATION,
    GET_LOCATION_REVIEWS_BY_USER,
    GET_LOCATION_REVIEWS_BY_MATCH,
    CREATE_LOCATION_REVIEW,
    DELETE_LOCATION_REVIEW,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreateLocationReviewRequest {
    user_id: string;
    location_id: string;
    status: 0 | 1;
    review_text?: string;
    match_id: string;
}

export interface LocationReview {
    id: string;
    location_id: string;
    user_id: string;
    status: number;
    review_text?: string;
    createdAt: string;
    match_id: string;
    location?: any;
    user?: any;
    match?: any;
}

export const createLocationReview = async (data: CreateLocationReviewRequest): Promise<LocationReview> => {
    try {
        return await mainApi.post<LocationReview>(CREATE_LOCATION_REVIEW, data);
    } catch (error) {
        console.error("Error creating location review:", error);
        throw error;
    }
};

export const getLocationReviewById = async (review_id: string): Promise<LocationReview> => {
    try {
        const endpoint = GET_LOCATION_REVIEW_BY_ID.replace(":review_id", review_id);
        return await mainApi.get<LocationReview>(endpoint);
    } catch (error) {
        console.error("Error getting location review:", error);
        throw error;
    }
};

export const getLocationReviewsByLocation = async (location_id: string): Promise<LocationReview[]> => {
    try {
        const endpoint = GET_LOCATION_REVIEWS_BY_LOCATION.replace(":location_id", location_id);
        return await mainApi.get<LocationReview[]>(endpoint);
    } catch (error) {
        console.error("Error getting location reviews by location:", error);
        throw error;
    }
};

export const getLocationReviewsByUser = async (user_id: string): Promise<LocationReview[]> => {
    try {
        const endpoint = GET_LOCATION_REVIEWS_BY_USER.replace(":user_id", user_id);
        return await mainApi.get<LocationReview[]>(endpoint);
    } catch (error) {
        console.error("Error getting location reviews by user:", error);
        throw error;
    }
};

export const getLocationReviewsByMatch = async (match_id: string): Promise<LocationReview[]> => {
    try {
        const endpoint = GET_LOCATION_REVIEWS_BY_MATCH.replace(":match_id", match_id);
        return await mainApi.get<LocationReview[]>(endpoint);
    } catch (error) {
        console.error("Error getting location reviews by match:", error);
        throw error;
    }
};

export const deleteLocationReview = async (review_id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_LOCATION_REVIEW, { review_id });
    } catch (error) {
        console.error("Error deleting location review:", error);
        throw error;
    }
};
