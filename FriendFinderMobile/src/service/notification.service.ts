import {
    CREATE_NOTIFICATION,
    GET_PENDING_NOTIFICATIONS,
    GET_ALL_NOTIFICATIONS,
    RESPOND_NOTIFICATION,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface NotificationData {
    id: string;
    sender_id: string;
    receiver_id: string;
    type: "match_request" | "match_accepted";
    status: "pending" | "accepted" | "rejected";
    position_id?: string;
    activity_id?: string;
    createdAt: string;
    sender?: {
        user_id: string;
        user_show_name: string;
        username: string;
    };
}

export interface CreateNotificationRequest {
    receiver_id: string;
    type: "match_request" | "match_accepted";
    position_id?: string;
    activity_id?: string;
}

export const createNotification = async (data: CreateNotificationRequest): Promise<NotificationData> => {
    try {
        return await mainApi.post<NotificationData>(CREATE_NOTIFICATION, data);
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

export const getPendingNotifications = async (): Promise<NotificationData[]> => {
    try {
        return await mainApi.get<NotificationData[]>(GET_PENDING_NOTIFICATIONS);
    } catch (error) {
        console.error("Error getting pending notifications:", error);
        throw error;
    }
};

export const getAllNotifications = async (): Promise<NotificationData[]> => {
    try {
        return await mainApi.get<NotificationData[]>(GET_ALL_NOTIFICATIONS);
    } catch (error) {
        console.error("Error getting all notifications:", error);
        throw error;
    }
};

export const respondNotification = async (id: string, status: "accepted" | "rejected"): Promise<NotificationData> => {
    try {
        return await mainApi.put<NotificationData>(RESPOND_NOTIFICATION, { id, status });
    } catch (error) {
        console.error("Error responding to notification:", error);
        throw error;
    }
};
