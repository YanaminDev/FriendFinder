import { REGISTER, LOGIN, LOGOUT, DELETE_USER, DELETE_USER_BY_ID } from "../api/endpoint";
import mainApi from "../api/main.api";

export type Sex = "male" | "female" | "lgbtq";

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
