import {
    GET_SMOKE,
    GET_SMOKE_BY_ID,
    CREATE_SMOKE,
    DELETE_SMOKE,
    UPDATE_SMOKE,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface Smoke {
    id: string;
    name: string;
    icon: string;
}

export const getSmoke = async (): Promise<Smoke[]> => {
    try {
        return await mainApi.get<Smoke[]>(GET_SMOKE);
    } catch (error) {
        console.error("Error getting smoke list:", error);
        throw error;
    }
};

export const getSmokeById = async (id: string): Promise<Smoke> => {
    try {
        const endpoint = GET_SMOKE_BY_ID.replace(":id", id);
        return await mainApi.get<Smoke>(endpoint);
    } catch (error) {
        console.error("Error getting smoke by id:", error);
        throw error;
    }
};

export const createSmoke = async (smoke: string): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(CREATE_SMOKE, { smoke });
    } catch (error) {
        console.error("Error creating smoke:", error);
        throw error;
    }
};

export const updateSmoke = async (id: string, name: string): Promise<{ message: string }> => {
    try {
        return await mainApi.put<{ message: string }>(UPDATE_SMOKE, { id, name });
    } catch (error) {
        console.error("Error updating smoke:", error);
        throw error;
    }
};

export const deleteSmoke = async (id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_SMOKE, { id });
    } catch (error) {
        console.error("Error deleting smoke:", error);
        throw error;
    }
};
