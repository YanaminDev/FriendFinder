import {
    SEND_MESSAGE,
    GET_MESSAGES_BY_CHAT,
    DELETE_MESSAGE,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface SendMessageRequest {
    chat_id: string;
    message: string;
    sender_id: string;
    chatType?: string;
}

export interface ChatMessage {
    id: string;
    chat_id: string;
    message: string;
    sender_id: string;
    createdAt: string;
    chatType: string;
    sender?: any;
}

export const sendMessage = async (data: SendMessageRequest): Promise<ChatMessage> => {
    try {
        return await mainApi.post<ChatMessage>(SEND_MESSAGE, data);
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const getMessagesByChat = async (chat_id: string): Promise<ChatMessage[]> => {
    try {
        const endpoint = GET_MESSAGES_BY_CHAT.replace(":chat_id", chat_id);
        return await mainApi.get<ChatMessage[]>(endpoint);
    } catch (error) {
        console.error("Error getting messages:", error);
        throw error;
    }
};

export const deleteMessage = async (message_id: string): Promise<{ message: string }> => {
    try {
        const endpoint = DELETE_MESSAGE.replace(":message_id", message_id);
        return await mainApi.delete<{ message: string }>(endpoint);
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};
