import {
    GET_WORKOUT,
    GET_WORKOUT_BY_ID,
    CREATE_WORKOUT,
    DELETE_WORKOUT,
    UPDATE_WORKOUT,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface Workout {
    id: string;
    name: string;
    icon: string;
}

export const getWorkout = async (): Promise<Workout[]> => {
    try {
        return await mainApi.get<Workout[]>(GET_WORKOUT);
    } catch (error) {
        console.error("Error getting workout list:", error);
        throw error;
    }
};

export const getWorkoutById = async (id: string): Promise<Workout> => {
    try {
        const endpoint = GET_WORKOUT_BY_ID.replace(":id", id);
        return await mainApi.get<Workout>(endpoint);
    } catch (error) {
        console.error("Error getting workout by id:", error);
        throw error;
    }
};

export const createWorkout = async (workout: string): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(CREATE_WORKOUT, { workout });
    } catch (error) {
        console.error("Error creating workout:", error);
        throw error;
    }
};

export const updateWorkout = async (id: string, name: string): Promise<{ message: string }> => {
    try {
        return await mainApi.put<{ message: string }>(UPDATE_WORKOUT, { id, name });
    } catch (error) {
        console.error("Error updating workout:", error);
        throw error;
    }
};

export const deleteWorkout = async (id: string): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_WORKOUT, { id });
    } catch (error) {
        console.error("Error deleting workout:", error);
        throw error;
    }
};
