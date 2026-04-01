import {
    CREATE_EXPERIENCE,
    GET_EXPERIENCE_BY_ID,
    GET_EXPERIENCES_BY_MATCH,
    GET_EXPERIENCES_BY_REVIEWER,
    GET_EXPERIENCES_BY_REVIEWEE,
    UPDATE_EXPERIENCE,
    DELETE_EXPERIENCE,
    GET_EXPERIENCE_STATS,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreateExperienceRequest {
    content?: string;
    status: 0 | 1;
    match_id: string;
    reviewer_id: string;
    reviewee_id: string;
}

export interface UpdateExperienceRequest {
    content?: string;
    status?: 0 | 1;
}

export interface Experience {
    id: string;
    createdAt: string;
    content?: string;
    status: number;
    match_id: string;
    reviewer_id: string;
    reviewee_id: string;
    match?: any;
    reviewer?: any;
    reviewee?: any;
}

export interface ExperienceStats {
    total: number;
    positive: number;
    negative: number;
}

export const createExperience = async (data: CreateExperienceRequest): Promise<Experience> => {
    try {
        return await mainApi.post<Experience>(CREATE_EXPERIENCE, data);
    } catch (error) {
        console.error("Error creating experience:", error);
        throw error;
    }
};

export const getExperienceById = async (experience_id: string): Promise<Experience> => {
    try {
        const endpoint = GET_EXPERIENCE_BY_ID.replace(":experience_id", experience_id);
        return await mainApi.get<Experience>(endpoint);
    } catch (error) {
        console.error("Error getting experience:", error);
        throw error;
    }
};

export const getExperiencesByMatch = async (match_id: string): Promise<Experience[]> => {
    try {
        const endpoint = GET_EXPERIENCES_BY_MATCH.replace(":match_id", match_id);
        return await mainApi.get<Experience[]>(endpoint);
    } catch (error) {
        console.error("Error getting experiences by match:", error);
        throw error;
    }
};

export const getExperiencesByReviewer = async (reviewer_id: string): Promise<Experience[]> => {
    try {
        const endpoint = GET_EXPERIENCES_BY_REVIEWER.replace(":reviewer_id", reviewer_id);
        return await mainApi.get<Experience[]>(endpoint);
    } catch (error) {
        console.error("Error getting experiences by reviewer:", error);
        throw error;
    }
};

export const getExperiencesByReviewee = async (reviewee_id: string): Promise<Experience[]> => {
    try {
        const endpoint = GET_EXPERIENCES_BY_REVIEWEE.replace(":reviewee_id", reviewee_id);
        return await mainApi.get<Experience[]>(endpoint);
    } catch (error) {
        console.error("Error getting experiences by reviewee:", error);
        throw error;
    }
};

export const updateExperience = async (experience_id: string, data: UpdateExperienceRequest): Promise<Experience> => {
    try {
        const endpoint = UPDATE_EXPERIENCE.replace(":experience_id", experience_id);
        return await mainApi.put<Experience>(endpoint, data);
    } catch (error) {
        console.error("Error updating experience:", error);
        throw error;
    }
};

export const deleteExperience = async (experience_id: string): Promise<{ message: string }> => {
    try {
        const endpoint = DELETE_EXPERIENCE.replace(":experience_id", experience_id);
        return await mainApi.delete<{ message: string }>(endpoint);
    } catch (error) {
        console.error("Error deleting experience:", error);
        throw error;
    }
};

export const getExperienceStats = async (user_id: string): Promise<ExperienceStats> => {
    try {
        const endpoint = GET_EXPERIENCE_STATS.replace(":user_id", user_id);
        return await mainApi.get<ExperienceStats>(endpoint);
    } catch (error) {
        console.error("Error getting experience stats:", error);
        throw error;
    }
};
