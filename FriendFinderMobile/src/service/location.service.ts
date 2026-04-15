import {
    GET_LOCATION,
    GET_LOCATION_BY_ID,
    GET_LOCATION_BY_POSITION,
    GET_LOCATION_AI_RECOMMEND,
    CREATE_LOCATION,
    UPDATE_LOCATION,
    DELETE_LOCATION,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreateLocationRequest {
    name: string;
    description?: string;
    phone?: string;
    position_id: string;
    activity_id: string;
    open_date?: string;
    open_time?: string;
    close_time?: string;
}

export interface UpdateLocationRequest {
    description?: string;
    phone?: string;
    open_date?: string;
    open_time?: string;
    close_time?: string;
}

export interface Location {
    id: string;
    name: string;
    description?: string;
    phone?: string;
    position_id: string;
    activity_id: string;
    open_date?: string;
    open_time?: string;
    close_time?: string;
    activity?: { id: string; name: string };
    position?: { id: string; name: string };
}

export const getLocation = async (): Promise<Location[]> => {
    try {
        return await mainApi.get<Location[]>(GET_LOCATION);
    } catch (error) {
        console.error("Error getting locations:", error);
        throw error;
    }
};

export const getLocationsByPosition = async (position_id: string): Promise<Location[]> => {
    try {
        const endpoint = GET_LOCATION_BY_POSITION.replace(":position_id", position_id);
        return await mainApi.get<Location[]>(endpoint);
    } catch (error) {
        console.error("Error getting locations by position:", error);
        throw error;
    }
};

export const getAIRecommendedLocations = async (
    position_id: string,
    user_id1: string,
    user_id2: string,
    activity_id: string
): Promise<Location[]> => {
    try {
        const endpoint = GET_LOCATION_AI_RECOMMEND.replace(":position_id", position_id);
        return await mainApi.get<Location[]>(
            `${endpoint}?user_id1=${user_id1}&user_id2=${user_id2}&activity_id=${activity_id}`
        );
    } catch (error) {
        console.error("Error getting AI recommended locations:", error);
        throw error;
    }
};

export const getLocationById = async (id: string): Promise<Location> => {
    try {
        const endpoint = GET_LOCATION_BY_ID.replace(":id", id);
        return await mainApi.get<Location>(endpoint);
    } catch (error) {
        console.error("Error getting location by id:", error);
        throw error;
    }
};

export const createLocation = async (data: CreateLocationRequest): Promise<Location> => {
    try {
        return await mainApi.post<Location>(CREATE_LOCATION, data);
    } catch (error) {
        console.error("Error creating location:", error);
        throw error;
    }
};

export const updateLocation = async (id: string, data: UpdateLocationRequest): Promise<Location> => {
    try {
        const endpoint = UPDATE_LOCATION.replace(":id", id);
        return await mainApi.put<Location>(endpoint, data);
    } catch (error) {
        console.error("Error updating location:", error);
        throw error;
    }
};

export const deleteLocation = async (id: string): Promise<{ message: string }> => {
    try {
        const endpoint = DELETE_LOCATION.replace(":id", id);
        return await mainApi.delete<{ message: string }>(endpoint);
    } catch (error) {
        console.error("Error deleting location:", error);
        throw error;
    }
};
