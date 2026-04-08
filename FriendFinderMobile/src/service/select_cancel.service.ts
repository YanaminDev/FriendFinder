import {
    GET_SELECT_CANCEL,
    GET_SELECT_CANCEL_BY_ID,
    CREATE_SELECT_CANCEL,
    DELETE_SELECT_CANCEL,
    UPDATE_SELECT_CANCEL,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface SelectCancel {
    id: string;
    name: string;
}

export const getSelectCancel = async (): Promise<SelectCancel[]> => {
    try {
        return await mainApi.get<SelectCancel[]>(GET_SELECT_CANCEL);
    } catch (error) {
        console.error("Error getting select cancel list:", error);
        throw error;
    }
};

export const getSelectCancelById = async (id: string): Promise<SelectCancel> => {
    try {
        const endpoint = GET_SELECT_CANCEL_BY_ID.replace(":id", id);
        return await mainApi.get<SelectCancel>(endpoint);
    } catch (error) {
        console.error("Error getting select cancel by id:", error);
        throw error;
    }
};

export const createSelectCancel = async (select_cancel: string): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(CREATE_SELECT_CANCEL, { select_cancel });
    } catch (error) {
        console.error("Error creating select cancel:", error);
        throw error;
    }
};

export const updateSelectCancel = async (id: string, name: string): Promise<{ message: string }> => {
    try {
        return await mainApi.put<{ message: string }>(UPDATE_SELECT_CANCEL, { id, name });
    } catch (error) {
        console.error("Error updating select cancel:", error);
        throw error;
    }
};

export const deleteSelectCancel = async (id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_SELECT_CANCEL, { id });
    } catch (error) {
        console.error("Error deleting select cancel:", error);
        throw error;
    }
};
