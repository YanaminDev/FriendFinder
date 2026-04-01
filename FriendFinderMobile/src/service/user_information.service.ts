import {
    CREATE_USER_INFORMATION,
    GET_USER_INFORMATION,
    UPDATE_USER_BIO,
    UPDATE_USER_HEIGHT,
    UPDATE_USER_BLOOD_GROUP,
    UPDATE_USER_LANGUAGE,
    UPDATE_USER_EDUCATION,
    DELETE_USER_INFORMATION,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export type BloodGroup = "A" | "B" | "AB" | "O";

export interface CreateUserInformationRequest {
    user_id: string;
    user_height: number;
    user_bio?: string;
    blood_group?: BloodGroup;
    language_id?: string;
    education_id?: string;
}

export interface UserInformation {
    user_id: string;
    user_height: number;
    user_bio?: string;
    blood_group?: BloodGroup;
    language_id?: string;
    education_id?: string;
    language?: { id: string; name: string };
    education?: { id: string; name: string };
}

export const createUserInformation = async (data: CreateUserInformationRequest): Promise<UserInformation> => {
    try {
        return await mainApi.post<UserInformation>(CREATE_USER_INFORMATION, data);
    } catch (error) {
        console.error("Error creating user information:", error);
        throw error;
    }
};

export const getUserInformation = async (userId: string): Promise<UserInformation> => {
    try {
        const endpoint = GET_USER_INFORMATION.replace(":userId", userId);
        return await mainApi.get<UserInformation>(endpoint);
    } catch (error) {
        console.error("Error getting user information:", error);
        throw error;
    }
};

export const updateUserBio = async (user_bio: string): Promise<UserInformation> => {
    try {
        return await mainApi.put<UserInformation>(UPDATE_USER_BIO, { user_bio });
    } catch (error) {
        console.error("Error updating user bio:", error);
        throw error;
    }
};

export const updateUserHeight = async (user_height: number): Promise<UserInformation> => {
    try {
        return await mainApi.put<UserInformation>(UPDATE_USER_HEIGHT, { user_height });
    } catch (error) {
        console.error("Error updating user height:", error);
        throw error;
    }
};

export const updateUserBloodGroup = async (blood_group: BloodGroup): Promise<UserInformation> => {
    try {
        return await mainApi.put<UserInformation>(UPDATE_USER_BLOOD_GROUP, { blood_group });
    } catch (error) {
        console.error("Error updating user blood group:", error);
        throw error;
    }
};

export const updateUserLanguage = async (language_id: string): Promise<UserInformation> => {
    try {
        return await mainApi.put<UserInformation>(UPDATE_USER_LANGUAGE, { language_id });
    } catch (error) {
        console.error("Error updating user language:", error);
        throw error;
    }
};

export const updateUserEducation = async (education_id: string): Promise<UserInformation> => {
    try {
        return await mainApi.put<UserInformation>(UPDATE_USER_EDUCATION, { education_id });
    } catch (error) {
        console.error("Error updating user education:", error);
        throw error;
    }
};

export const deleteUserInformation = async (): Promise<{ message: string }> => {
    try {
        return await mainApi.delete<{ message: string }>(DELETE_USER_INFORMATION);
    } catch (error) {
        console.error("Error deleting user information:", error);
        throw error;
    }
};
