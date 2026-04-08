import {
    UPLOAD_LOCATION_IMAGE,
    GET_LOCATION_IMAGE_SIGNED_URL,
    GET_LOCATION_IMAGE_SIGNED_URL_BY_ID,
    GET_LOCATION_IMAGES,
    GET_LOCATION_IMAGE_BY_ID,
    DELETE_LOCATION_IMAGE,
    UPDATE_LOCATION_IMAGE,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface LocationImage {
    id: string;
    location_id: string;
    imageUrl: string;
    createdAt: string;
}

export interface SignedUrlResponse {
    signedUrl: string;
}

export const uploadLocationImage = async (locationId: string, imageFile: {
    uri: string;
    name: string;
    type: string;
}): Promise<LocationImage> => {
    try {
        const formData = new FormData();
        formData.append("image", { uri: imageFile.uri, name: imageFile.name, type: imageFile.type } as any);
        formData.append("location_id", locationId);
        return await mainApi.upload<LocationImage>(UPLOAD_LOCATION_IMAGE, formData);
    } catch (error) {
        console.error("Error uploading location image:", error);
        throw error;
    }
};

export const getLocationImageSignedUrl = async (locationId: string): Promise<SignedUrlResponse[]> => {
    try {
        const endpoint = GET_LOCATION_IMAGE_SIGNED_URL.replace(":locationId", locationId);
        return await mainApi.get<SignedUrlResponse[]>(endpoint);
    } catch (error) {
        console.error("Error getting location image signed url:", error);
        throw error;
    }
};

export const getLocationImageSignedUrlById = async (locationId: string, imageId: string): Promise<SignedUrlResponse> => {
    try {
        const endpoint = GET_LOCATION_IMAGE_SIGNED_URL_BY_ID.replace(":locationId", locationId).replace(":imageId", imageId);
        return await mainApi.get<SignedUrlResponse>(endpoint);
    } catch (error) {
        console.error("Error getting location image signed url by id:", error);
        throw error;
    }
};

export const getLocationImages = async (locationId: string): Promise<LocationImage[]> => {
    try {
        const endpoint = GET_LOCATION_IMAGES.replace(":locationId", locationId);
        return await mainApi.get<LocationImage[]>(endpoint);
    } catch (error) {
        console.error("Error getting location images:", error);
        throw error;
    }
};

export const getLocationImageById = async (locationId: string, imageId: string): Promise<LocationImage> => {
    try {
        const endpoint = GET_LOCATION_IMAGE_BY_ID.replace(":locationId", locationId).replace(":imageId", imageId);
        return await mainApi.get<LocationImage>(endpoint);
    } catch (error) {
        console.error("Error getting location image by id:", error);
        throw error;
    }
};

export const deleteLocationImage = async (imageId: string): Promise<{ message: string }> => {
    try {
        const endpoint = DELETE_LOCATION_IMAGE.replace(":imageId", imageId);
        return await mainApi.delete<{ message: string }>(endpoint);
    } catch (error) {
        console.error("Error deleting location image:", error);
        throw error;
    }
};

export const updateLocationImage = async (imageId: string, imageFile: {
    uri: string;
    name: string;
    type: string;
}): Promise<LocationImage> => {
    try {
        const endpoint = UPDATE_LOCATION_IMAGE.replace(":imageId", imageId);
        const formData = new FormData();
        formData.append("image", { uri: imageFile.uri, name: imageFile.name, type: imageFile.type } as any);
        return await mainApi.upload<LocationImage>(endpoint, formData);
    } catch (error) {
        console.error("Error updating location image:", error);
        throw error;
    }
};
