import {
    GET_MATCH_BY_ID,
    GET_ACTIVE_MATCH,
    CREATE_MATCH,
    UPDATE_MATCH_CANCEL_STATUS,
    UPDATE_MATCH_END,
    UPDATE_MATCH_LOCATION,
    DELETE_MATCH,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreateMatchRequest {
    user1_id: string;
    user2_id: string;
    location_id?: string;
    activity_id: string;
    position_id: string;
    end_date?: string;
}

export interface Match {
    id: string;
    user1_id: string;
    user2_id: string;
    location_id?: string;
    activity_id: string;
    position_id: string;
    cancel_status: boolean;
    end_date?: string;
    createdAt: string;
    activity?: { id: string; name: string };
    location?: { id: string; name: string };
    position?: { id: string; name: string };
    user1?: any;
    user2?: any;
}

export const getActiveMatchByUser = async (user_id: string): Promise<Match | null> => {
    const endpoint = GET_ACTIVE_MATCH.replace(":user_id", user_id);
    return await mainApi.get<Match | null>(endpoint);
};

export const getMatchById = async (match_id: string): Promise<Match> => {
    try {
        const endpoint = GET_MATCH_BY_ID.replace(":match_id", match_id);
        return await mainApi.get<Match>(endpoint);
    } catch (error) {
        console.error("Error getting match:", error);
        throw error;
    }
};

export const createMatch = async (data: CreateMatchRequest): Promise<Match> => {
    try {
        return await mainApi.post<Match>(CREATE_MATCH, data);
    } catch (error) {
        console.error("Error creating match:", error);
        throw error;
    }
};

export const updateMatchCancelStatus = async (match_id: string, cancel_status: boolean): Promise<Match> => {
    try {
        const endpoint = UPDATE_MATCH_CANCEL_STATUS.replace(":match_id", match_id);
        return await mainApi.put<Match>(endpoint, { cancel_status });
    } catch (error) {
        console.error("Error updating match cancel status:", error);
        throw error;
    }
};

export const updateMatchEndDate = async (match_id: string, end_date: string): Promise<Match> => {
    try {
        const endpoint = UPDATE_MATCH_END.replace(":match_id", match_id);
        return await mainApi.put<Match>(endpoint, { end_date });
    } catch (error) {
        console.error("Error updating match end date:", error);
        throw error;
    }
};

export const updateMatchLocation = async (match_id: string, location_id: string): Promise<Match> => {
    try {
        const endpoint = UPDATE_MATCH_LOCATION.replace(":match_id", match_id);
        return await mainApi.put<Match>(endpoint, { location_id });
    } catch (error) {
        console.error("Error updating match location:", error);
        throw error;
    }
};

export const deleteMatch = async (match_id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_MATCH, { match_id });
    } catch (error) {
        console.error("Error deleting match:", error);
        throw error;
    }
};
