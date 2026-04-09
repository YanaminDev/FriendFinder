import {
    GET_LANGUAGE,
    GET_LANGUAGE_BY_ID,
    CREATE_LANGUAGE,
    DELETE_LANGUAGE,
    UPDATE_LANGUAGE,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface Language {
    id: string;
    name: string;
    icon: string;
}

export const getLanguage = async (): Promise<Language[]> => {
    try {
        return await mainApi.get<Language[]>(GET_LANGUAGE);
    } catch (error) {
        console.error("Error getting language list:", error);
        throw error;
    }
};

export const getLanguageById = async (id: string): Promise<Language> => {
    try {
        const endpoint = GET_LANGUAGE_BY_ID.replace(":id", id);
        return await mainApi.get<Language>(endpoint);
    } catch (error) {
        console.error("Error getting language by id:", error);
        throw error;
    }
};

export const createLanguage = async (language: string): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(CREATE_LANGUAGE, { language });
    } catch (error) {
        console.error("Error creating language:", error);
        throw error;
    }
};

export const updateLanguage = async (id: string, name: string): Promise<{ message: string }> => {
    try {
        return await mainApi.put<{ message: string }>(UPDATE_LANGUAGE, { id, name });
    } catch (error) {
        console.error("Error updating language:", error);
        throw error;
    }
};

export const deleteLanguage = async (id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_LANGUAGE, { id });
    } catch (error) {
        console.error("Error deleting language:", error);
        throw error;
    }
};
