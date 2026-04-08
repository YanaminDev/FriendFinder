import {
    GET_PET,
    GET_PET_BY_ID,
    CREATE_PET,
    DELETE_PET,
    UPDATE_PET,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface Pet {
    id: string;
    name: string;
}

export const getPet = async (): Promise<Pet[]> => {
    try {
        return await mainApi.get<Pet[]>(GET_PET);
    } catch (error) {
        console.error("Error getting pet list:", error);
        throw error;
    }
};

export const getPetById = async (id: string): Promise<Pet> => {
    try {
        const endpoint = GET_PET_BY_ID.replace(":id", id);
        return await mainApi.get<Pet>(endpoint);
    } catch (error) {
        console.error("Error getting pet by id:", error);
        throw error;
    }
};

export const createPet = async (pet: string): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(CREATE_PET, { pet });
    } catch (error) {
        console.error("Error creating pet:", error);
        throw error;
    }
};

export const updatePet = async (id: string, name: string): Promise<{ message: string }> => {
    try {
        return await mainApi.put<{ message: string }>(UPDATE_PET, { id, name });
    } catch (error) {
        console.error("Error updating pet:", error);
        throw error;
    }
};

export const deletePet = async (id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_PET, { id });
    } catch (error) {
        console.error("Error deleting pet:", error);
        throw error;
    }
};
