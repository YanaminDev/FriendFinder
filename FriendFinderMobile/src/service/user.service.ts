import { CHECK_USERNAME, REGISTER, LOGIN, LOGOUT, DELETE_USER, DELETE_USER_BY_ID, GET_USER_PROFILE, UPDATE_USER_SHOW_NAME, UPDATE_USER_INTERESTED_GENDER } from "../api/endpoint";
import mainApi from "../api/main.api";

export type Sex = "male" | "female" | "lgbtq";

export interface UserProfile {
    user_id: string;
    username: string;
    user_show_name: string;
    sex: Sex;
    age: number;
    birth_of_date: string;
    interested_gender: Sex;
    role: string;
}

export interface RegisterRequest {
    user_show_name: string;
    username: string;
    password: string;
    sex: Sex;
    age: number;
    birth_of_date: string;
    interested_gender: Sex;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        return await mainApi.get<UserProfile>(GET_USER_PROFILE);
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};

export const checkUsername = async (username: string): Promise<{ exists: boolean }> => {
    try {
        return await mainApi.post<{ exists: boolean }>(CHECK_USERNAME, { username });
    } catch (error) {
        console.error("Error checking username:", error);
        throw error;
    }
};

export const register = async (data: RegisterRequest): Promise<{ message: string; user_id?: string }> => {
    try {
        return await mainApi.post<{ message: string }>(REGISTER, data);
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

export const login = async (data: LoginRequest): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(LOGIN, data);
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const logout = async (): Promise<{ message: string }> => {
    try {
        return await mainApi.post<{ message: string }>(LOGOUT);
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

export const deleteUser = async (): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_USER);
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export const deleteUserByAdmin = async (id: string): Promise<{ message: string }> => {
    try {
        const endpoint = DELETE_USER_BY_ID.replace(":id", id);
        return await mainApi.delete<{ message: string }>(endpoint);
    } catch (error) {
        console.error("Error deleting user by admin:", error);
        throw error;
    }
};

export const updateUserShowName = async (user_show_name: string): Promise<UserProfile> => {
    try {
        return await mainApi.put<UserProfile>(UPDATE_USER_SHOW_NAME, { user_show_name });
    } catch (error) {
        console.error("Error updating user show name:", error);
        throw error;
    }
};

export const updateUserInterestedGender = async (interested_gender: Sex): Promise<UserProfile> => {
    try {
        return await mainApi.put<UserProfile>(UPDATE_USER_INTERESTED_GENDER, { interested_gender });
    } catch (error) {
        console.error("Error updating interested gender:", error);
        throw error;
    }
};
