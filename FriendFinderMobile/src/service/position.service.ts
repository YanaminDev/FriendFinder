import {
    CREATE_POSITION,
    GET_POSITION_BY_ID,
    UPDATE_POSITION,
    DELETE_POSITION,
    SEARCH_NEARBY_POSITION,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreatePositionRequest {
    name: string;
    information?: string;
    phone?: string;
    open_date?: string;
    open_time?: string;
    close_time?: string;
    latitude: number;
    longitude: number;
}

export interface UpdatePositionRequest {
    name?: string;
    information?: string;
    phone?: string;
    open_date?: string;
    open_time?: string;
    close_time?: string;
    latitude?: number;
    longitude?: number;
}

export interface SearchNearbyRequest {
    user_latitude: number;
    user_longitude: number;
    radius?: number;
}

export interface Position {
    id: string;
    name: string;
    information?: string;
    phone?: string;
    open_date?: string;
    open_time?: string;
    close_time?: string;
    latitude: number;
    longitude: number;
}

export const createPosition = async (data: CreatePositionRequest): Promise<Position> => {
    try {
        return await mainApi.post<Position>(CREATE_POSITION, data);
    } catch (error) {
        console.error("Error creating position:", error);
        throw error;
    }
};

export const getPositionById = async (position_id: string): Promise<Position> => {
    try {
        const endpoint = GET_POSITION_BY_ID.replace(":position_id", position_id);
        return await mainApi.get<Position>(endpoint);
    } catch (error) {
        console.error("Error getting position:", error);
        throw error;
    }
};

export const updatePosition = async (position_id: string, data: UpdatePositionRequest): Promise<Position> => {
    try {
        const endpoint = UPDATE_POSITION.replace(":position_id", position_id);
        return await mainApi.put<Position>(endpoint, data);
    } catch (error) {
        console.error("Error updating position:", error);
        throw error;
    }
};

export const deletePosition = async (position_id: string): Promise<{ message: string }> => {
    try {
        const endpoint = DELETE_POSITION.replace(":position_id", position_id);
        return await mainApi.delete<{ message: string }>(endpoint);
    } catch (error) {
        console.error("Error deleting position:", error);
        throw error;
    }
};

export const searchNearbyPosition = async (data: SearchNearbyRequest): Promise<Position[]> => {
    try {
        return await mainApi.post<Position[]>(SEARCH_NEARBY_POSITION, data);
    } catch (error) {
        console.error("Error searching nearby positions:", error);
        throw error;
    }
};
