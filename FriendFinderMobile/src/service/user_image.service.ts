import {
    UPLOAD_USER_IMAGE,
    GET_USER_IMAGE_SIGNED_URL,
    GET_USER_IMAGE_SIGNED_URL_BY_ID,
    GET_USER_IMAGES,
    GET_USER_IMAGE_BY_ID,
    DELETE_USER_IMAGE,
    UPDATE_USER_IMAGE,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface UserImage {
    id: string;
    user_id: string;
    imageUrl: string;
    createdAt: string;
}

export interface SignedUrlResponse {
    signedUrl: string;
}

export const uploadUserImage = async (userId: string, imageFile: {
    uri: string;
    name: string;
    type: string;
}): Promise<UserImage> => {
    try {
        const formData = new FormData();
        formData.append("image", { uri: imageFile.uri, name: imageFile.name, type: imageFile.type } as any);
        formData.append("user_id", userId);
        return await mainApi.upload<UserImage>(UPLOAD_USER_IMAGE, formData);
    } catch (error) {
        console.error("Error uploading user image:", error);
        throw error;
    }
};

export const getUserImageSignedUrl = async (userId: string): Promise<SignedUrlResponse[]> => {
    try {
        const endpoint = GET_USER_IMAGE_SIGNED_URL.replace(":userId", userId);
        return await mainApi.get<SignedUrlResponse[]>(endpoint);
    } catch (error) {
        console.error("Error getting user image signed url:", error);
        throw error;
    }
};

export const getUserImageSignedUrlById = async (userId: string, id: string): Promise<SignedUrlResponse> => {
    try {
        const endpoint = GET_USER_IMAGE_SIGNED_URL_BY_ID.replace(":userId", userId).replace(":id", id);
        return await mainApi.get<SignedUrlResponse>(endpoint);
    } catch (error) {
        console.error("Error getting user image signed url by id:", error);
        throw error;
    }
};

export const getUserImages = async (userId: string): Promise<UserImage[]> => {
    try {
        const endpoint = GET_USER_IMAGES.replace(":userId", userId);
        return await mainApi.get<UserImage[]>(endpoint);
    } catch (error) {
        console.error("Error getting user images:", error);
        throw error;
    }
};

export const getUserImageById = async (userId: string, id: string): Promise<UserImage> => {
    try {
        const endpoint = GET_USER_IMAGE_BY_ID.replace(":userId", userId).replace(":id", id);
        return await mainApi.get<UserImage>(endpoint);
    } catch (error) {
        console.error("Error getting user image by id:", error);
        throw error;
    }
};

export const deleteUserImage = async (imageId: string): Promise<{ message: string }> => {
    try {
        const endpoint = DELETE_USER_IMAGE.replace(":imageId", imageId);
        return await mainApi.delete<{ message: string }>(endpoint);
    } catch (error) {
        console.error("Error deleting user image:", error);
        throw error;
    }
};

export const updateUserImage = async (imageId: string, imageFile: {
    uri: string;
    name: string;
    type: string;
}): Promise<UserImage> => {
    try {
        const endpoint = UPDATE_USER_IMAGE.replace(":imageId", imageId);
        const formData = new FormData();
        formData.append("image", { uri: imageFile.uri, name: imageFile.name, type: imageFile.type } as any);
        return await mainApi.upload<UserImage>(endpoint, formData);
    } catch (error) {
        console.error("Error updating user image:", error);
        throw error;
    }
};
