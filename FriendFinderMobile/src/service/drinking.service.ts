import {
    GET_DRINKING,
    GET_DRINKING_BY_ID,
    CREATE_DRINKING,
    DELETE_DRINKING,
    UPDATE_DRINKING,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface Drinking {
    id: string;
    name: string;
}

export const getDrinking = async (): Promise<Drinking[]> => {
    try {
        return await mainApi.get<Drinking[]>(GET_DRINKING);
    } catch (error) {
        console.error("Error getting drinking list:", error);
        throw error;
    }
};

export const getDrinkingById = async (id: string): Promise<Drinking> => {
    try {
        const endpoint = GET_DRINKING_BY_ID.replace(":id", id);
        return await mainApi.get<Drinking>(endpoint);
    } catch (error) {
        console.error("Error getting drinking by id:", error);
        throw error;
    }
};

export const createDrinking = async (drinking: string): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(CREATE_DRINKING, { drinking });
    } catch (error) {
        console.error("Error creating drinking:", error);
        throw error;
    }
};

export const updateDrinking = async (id: string, name: string): Promise<{ message: string }> => {
    try {
        return await mainApi.put<{ message: string }>(UPDATE_DRINKING, { id, name });
    } catch (error) {
        console.error("Error updating drinking:", error);
        throw error;
    }
};

export const deleteDrinking = async (id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_DRINKING, { id });
    } catch (error) {
        console.error("Error deleting drinking:", error);
        throw error;
    }
};
