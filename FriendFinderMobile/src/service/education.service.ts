import {
    GET_EDUCATION,
    GET_EDUCATION_BY_ID,
    CREATE_EDUCATION,
    DELETE_EDUCATION,
    UPDATE_EDUCATION,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface Education {
    id: string;
    name: string;
    icon: string;
}

export const getEducation = async (): Promise<Education[]> => {
    try {
        return await mainApi.get<Education[]>(GET_EDUCATION);
    } catch (error) {
        console.error("Error getting education list:", error);
        throw error;
    }
};

export const getEducationById = async (id: string): Promise<Education> => {
    try {
        const endpoint = GET_EDUCATION_BY_ID.replace(":id", id);
        return await mainApi.get<Education>(endpoint);
    } catch (error) {
        console.error("Error getting education by id:", error);
        throw error;
    }
};

export const createEducation = async (education: string): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(CREATE_EDUCATION, { education });
    } catch (error) {
        console.error("Error creating education:", error);
        throw error;
    }
};

export const updateEducation = async (id: string, name: string): Promise<{ message: string }> => {
    try {
        return await mainApi.put<{ message: string }>(UPDATE_EDUCATION, { id, name });
    } catch (error) {
        console.error("Error updating education:", error);
        throw error;
    }
};

export const deleteEducation = async (id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_EDUCATION, { id });
    } catch (error) {
        console.error("Error deleting education:", error);
        throw error;
    }
};
