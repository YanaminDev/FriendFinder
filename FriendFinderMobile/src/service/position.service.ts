import { GET_ALL_POSITIONS, GET_POSITION_BY_ID, SEARCH_NEARBY_POSITION, UPLOAD_POSITION_IMAGE } from "../api/endpoint";
import mainApi from "../api/main.api";

export interface Position {
    id: string;
    name: string;
    information?: string | null;
    phone?: string | null;
    open_date?: string | null;
    open_time?: string | null;
    close_time?: string | null;
    image?: string | null;
    latitude: number;
    longitude: number;
    isHidden?: boolean;
}

export const getAllPositions = async (): Promise<Position[]> => {
    try {
        return await mainApi.get<Position[]>(GET_ALL_POSITIONS);
    } catch (error) {
        console.error("Error fetching positions:", error);
        throw error;
    }
};

export const getPositionById = async (positionId: string): Promise<Position> => {
    try {
        const endpoint = GET_POSITION_BY_ID.replace(":position_id", positionId);
        return await mainApi.get<Position>(endpoint);
    } catch (error) {
        console.error("Error fetching position:", error);
        throw error;
    }
};

export const searchNearbyPositions = async (
    latitude: number,
    longitude: number,
    radius: number = 5
): Promise<Position[]> => {
    try {
        return await mainApi.post<Position[]>(SEARCH_NEARBY_POSITION, {
            user_latitude: latitude,
            user_longitude: longitude,
            radius,
        });
    } catch (error) {
        console.error("Error searching nearby positions:", error);
        throw error;
    }
};

export const uploadPositionImage = async (
    positionId: string,
    imageFile: { uri: string; name: string; type: string }
): Promise<Position> => {
    try {
        const formData = new FormData();
        formData.append("image", { uri: imageFile.uri, name: imageFile.name, type: imageFile.type } as any);

        const endpoint = UPLOAD_POSITION_IMAGE.replace(":position_id", positionId);
        return await mainApi.upload<Position>(endpoint, formData);
    } catch (error) {
        console.error("Error uploading position image:", error);
        throw error;
    }
};
