import {
    GET_ACTIVITY,
    GET_ACTIVITY_BY_ID,
    CREATE_ACTIVITY,
    DELETE_ACTIVITY,
    UPDATE_ACTIVITY,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface Activity {
    id: string;
    name: string;
}

export const getActivity = async (): Promise<Activity[]> => {
    try {
        return await mainApi.get<Activity[]>(GET_ACTIVITY);
    } catch (error) {
        console.error("Error getting activities:", error);
        throw error;
    }
};

export const getActivityById = async (id: string): Promise<Activity> => {
    try {
        const endpoint = GET_ACTIVITY_BY_ID.replace(":id", id);
        return await mainApi.get<Activity>(endpoint);
    } catch (error) {
        console.error("Error getting activity by id:", error);
        throw error;
    }
};

export const createActivity = async (activity: string): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(CREATE_ACTIVITY, { activity });
    } catch (error) {
        console.error("Error creating activity:", error);
        throw error;
    }
};

export const updateActivity = async (id: string, name: string): Promise<{ message: string }> => {
    try {
        return await mainApi.put<{ message: string }>(UPDATE_ACTIVITY, { id, name });
    } catch (error) {
        console.error("Error updating activity:", error);
        throw error;
    }
};

export const deleteActivity = async (id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_ACTIVITY, { id });
    } catch (error) {
        console.error("Error deleting activity:", error);
        throw error;
    }
};
