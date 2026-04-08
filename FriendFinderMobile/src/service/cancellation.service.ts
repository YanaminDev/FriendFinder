import {
    CREATE_CANCELLATION,
    GET_CANCELLATION_BY_ID,
    GET_CANCELLATIONS_BY_MATCH,
    GET_CANCELLATIONS_BY_USER,
    GET_CANCELLATIONS_BY_REVIEWER,
    DELETE_CANCELLATION,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreateCancellationRequest {
    content?: string;
    match_id: string;
    reviewer_id: string;
    reviewee_id: string;
    quick_select_id?: string;
}

export interface Cancellation {
    id: string;
    content?: string;
    match_id: string;
    reviewer_id: string;
    reviewee_id: string;
    quick_select_id?: string;
    createdAt: string;
    match?: any;
    quick_select?: any;
    reviewer?: any;
    reviewee?: any;
}

export const createCancellation = async (data: CreateCancellationRequest): Promise<Cancellation> => {
    try {
        return await mainApi.post<Cancellation>(CREATE_CANCELLATION, data);
    } catch (error) {
        console.error("Error creating cancellation:", error);
        throw error;
    }
};

export const getCancellationById = async (cancellation_id: string): Promise<Cancellation> => {
    try {
        const endpoint = GET_CANCELLATION_BY_ID.replace(":cancellation_id", cancellation_id);
        return await mainApi.get<Cancellation>(endpoint);
    } catch (error) {
        console.error("Error getting cancellation:", error);
        throw error;
    }
};

export const getCancellationsByMatch = async (match_id: string): Promise<Cancellation[]> => {
    try {
        const endpoint = GET_CANCELLATIONS_BY_MATCH.replace(":match_id", match_id);
        return await mainApi.get<Cancellation[]>(endpoint);
    } catch (error) {
        console.error("Error getting cancellations by match:", error);
        throw error;
    }
};

export const getCancellationsByUser = async (user_id: string): Promise<Cancellation[]> => {
    try {
        const endpoint = GET_CANCELLATIONS_BY_USER.replace(":user_id", user_id);
        return await mainApi.get<Cancellation[]>(endpoint);
    } catch (error) {
        console.error("Error getting cancellations by user:", error);
        throw error;
    }
};

export const getCancellationsByReviewer = async (reviewer_id: string): Promise<Cancellation[]> => {
    try {
        const endpoint = GET_CANCELLATIONS_BY_REVIEWER.replace(":reviewer_id", reviewer_id);
        return await mainApi.get<Cancellation[]>(endpoint);
    } catch (error) {
        console.error("Error getting cancellations by reviewer:", error);
        throw error;
    }
};

export const deleteCancellation = async (cancellation_id: string): Promise<{ message: string }> => {
    try {
        const endpoint = DELETE_CANCELLATION.replace(":cancellation_id", cancellation_id);
        return await mainApi.delete<{ message: string }>(endpoint);
    } catch (error) {
        console.error("Error deleting cancellation:", error);
        throw error;
    }
};
