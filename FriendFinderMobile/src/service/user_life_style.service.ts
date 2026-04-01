import {
    CREATE_USER_LIFE_STYLE,
    GET_USER_LIFE_STYLE,
    UPDATE_USER_LOOKING_FOR,
    UPDATE_USER_DRINKING,
    UPDATE_USER_PET,
    UPDATE_USER_SMOKE,
    UPDATE_USER_WORKOUT,
    DELETE_USER_LIFE_STYLE,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreateUserLifeStyleRequest {
    user_id: string;
    looking_for_id: string;
    drinking_id: string;
    pet_id: string;
    smoke_id: string;
    workout_id: string;
}

export interface UserLifeStyle {
    user_id: string;
    looking_for_id: string;
    drinking_id: string;
    pet_id: string;
    smoke_id: string;
    workout_id: string;
    looking_for?: { id: string; name: string };
    drinking?: { id: string; name: string };
    pet?: { id: string; name: string };
    smoke?: { id: string; name: string };
    workout?: { id: string; name: string };
}

export const createUserLifeStyle = async (data: CreateUserLifeStyleRequest): Promise<UserLifeStyle> => {
    try {
        return await mainApi.post<UserLifeStyle>(CREATE_USER_LIFE_STYLE, data);
    } catch (error) {
        console.error("Error creating user life style:", error);
        throw error;
    }
};

export const getUserLifeStyle = async (userId: string): Promise<UserLifeStyle> => {
    try {
        const endpoint = GET_USER_LIFE_STYLE.replace(":userId", userId);
        return await mainApi.get<UserLifeStyle>(endpoint);
    } catch (error) {
        console.error("Error getting user life style:", error);
        throw error;
    }
};

export const updateUserLookingFor = async (looking_for_id: string): Promise<UserLifeStyle> => {
    try {
        return await mainApi.put<UserLifeStyle>(UPDATE_USER_LOOKING_FOR, { looking_for_id });
    } catch (error) {
        console.error("Error updating looking for:", error);
        throw error;
    }
};

export const updateUserDrinking = async (drinking_id: string): Promise<UserLifeStyle> => {
    try {
        return await mainApi.put<UserLifeStyle>(UPDATE_USER_DRINKING, { drinking_id });
    } catch (error) {
        console.error("Error updating drinking:", error);
        throw error;
    }
};

export const updateUserPet = async (pet_id: string): Promise<UserLifeStyle> => {
    try {
        return await mainApi.put<UserLifeStyle>(UPDATE_USER_PET, { pet_id });
    } catch (error) {
        console.error("Error updating pet:", error);
        throw error;
    }
};

export const updateUserSmoke = async (smoke_id: string): Promise<UserLifeStyle> => {
    try {
        return await mainApi.put<UserLifeStyle>(UPDATE_USER_SMOKE, { smoke_id });
    } catch (error) {
        console.error("Error updating smoke:", error);
        throw error;
    }
};

export const updateUserWorkout = async (workout_id: string): Promise<UserLifeStyle> => {
    try {
        return await mainApi.put<UserLifeStyle>(UPDATE_USER_WORKOUT, { workout_id });
    } catch (error) {
        console.error("Error updating workout:", error);
        throw error;
    }
};

export const deleteUserLifeStyle = async (): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_USER_LIFE_STYLE);
    } catch (error) {
        console.error("Error deleting user life style:", error);
        throw error;
    }
};
