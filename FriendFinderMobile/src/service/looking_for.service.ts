import {
    GET_LOOKING_FOR,
    GET_LOOKING_FOR_BY_ID,
    CREATE_LOOKING_FOR,
    DELETE_LOOKING_FOR,
    UPDATE_LOOKING_FOR,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface LookingFor {
    id: string;
    name: string;
}

export const getLookingFor = async (): Promise<LookingFor[]> => {
    try {
        return await mainApi.get<LookingFor[]>(GET_LOOKING_FOR);
    } catch (error) {
        console.error("Error getting looking for list:", error);
        throw error;
    }
};

export const getLookingForById = async (id: string): Promise<LookingFor> => {
    try {
        const endpoint = GET_LOOKING_FOR_BY_ID.replace(":id", id);
        return await mainApi.get<LookingFor>(endpoint);
    } catch (error) {
        console.error("Error getting looking for by id:", error);
        throw error;
    }
};

export const createLookingFor = async (looking_for: string): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(CREATE_LOOKING_FOR, { looking_for });
    } catch (error) {
        console.error("Error creating looking for:", error);
        throw error;
    }
};

export const updateLookingFor = async (id: string, name: string): Promise<{ message: string }> => {
    try {
        return await mainApi.put<{ message: string }>(UPDATE_LOOKING_FOR, { id, name });
    } catch (error) {
        console.error("Error updating looking for:", error);
        throw error;
    }
};

export const deleteLookingFor = async (id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_LOOKING_FOR, { id });
    } catch (error) {
        console.error("Error deleting looking for:", error);
        throw error;
    }
};
