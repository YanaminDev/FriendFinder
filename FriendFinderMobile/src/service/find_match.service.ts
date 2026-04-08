import {
    GET_FIND_MATCH,
    CREATE_FIND_MATCH,
    DELETE_FIND_MATCH,
    SEARCH_FIND_MATCH,
    UPDATE_FIND_MATCH,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreateFindMatchRequest {
    user_id: string;
    position_id: string;
    activity_id1?: string;
    activity_id2?: string;
    activity_id3?: string;
}

export interface SearchFindMatchRequest {
    position_id?: string;
    activity_id1?: string;
    activity_id2?: string;
    activity_id3?: string;
}

export interface UpdateFindMatchRequest {
    user_id: string;
    position_id?: string;
    activity_id1?: string;
    activity_id2?: string;
    activity_id3?: string;
}

export interface FindMatch {
    user_id: string;
    position_id: string;
    activity_id1?: string;
    activity_id2?: string;
    activity_id3?: string;
    position?: { id: string; name: string };
    activity1?: { id: string; name: string };
    activity2?: { id: string; name: string };
    activity3?: { id: string; name: string };
    user?: any;
}

export const getFindMatch = async (user_id: string): Promise<FindMatch> => {
    try {
        const endpoint = GET_FIND_MATCH.replace(":user_id", user_id);
        return await mainApi.get<FindMatch>(endpoint);
    } catch (error) {
        console.error("Error getting find match:", error);
        throw error;
    }
};

export const createFindMatch = async (data: CreateFindMatchRequest): Promise<FindMatch> => {
    try {
        return await mainApi.post<FindMatch>(CREATE_FIND_MATCH, data);
    } catch (error) {
        console.error("Error creating find match:", error);
        throw error;
    }
};

export const searchFindMatch = async (data: SearchFindMatchRequest): Promise<FindMatch[]> => {
    try {
        return await mainApi.post<FindMatch[]>(SEARCH_FIND_MATCH, data);
    } catch (error) {
        console.error("Error searching find match:", error);
        throw error;
    }
};

export const updateFindMatch = async (data: UpdateFindMatchRequest): Promise<FindMatch> => {
    try {
        return await mainApi.put<FindMatch>(UPDATE_FIND_MATCH, data);
    } catch (error) {
        console.error("Error updating find match:", error);
        throw error;
    }
};

export const deleteFindMatch = async (user_id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_FIND_MATCH, { user_id });
    } catch (error) {
        console.error("Error deleting find match:", error);
        throw error;
    }
};
