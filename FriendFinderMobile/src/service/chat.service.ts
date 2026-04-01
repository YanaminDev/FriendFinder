import {
    CREATE_CHAT,
    GET_CHAT_BY_ID,
    GET_CHATS_BY_USER,
    DELETE_CHAT,
} from "../api/endpoint";
import mainApi from "../api/main.api";

export interface CreateChatRequest {
    user1_id: string;
    user2_id: string;
}

export interface Chat {
    id: string;
    user1_id: string;
    user2_id: string;
    createdAt: string;
    user1?: any;
    user2?: any;
    chatMessage?: any[];
}

export const createChat = async (data: CreateChatRequest): Promise<Chat> => {
    try {
        return await mainApi.post<Chat>(CREATE_CHAT, data);
    } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
};

export const getChatById = async (chat_id: string): Promise<Chat> => {
    try {
        const endpoint = GET_CHAT_BY_ID.replace(":chat_id", chat_id);
        return await mainApi.get<Chat>(endpoint);
    } catch (error) {
        console.error("Error getting chat by id:", error);
        throw error;
    }
};

export const getChatsByUser = async (user_id: string): Promise<Chat[]> => {
    try {
        const endpoint = GET_CHATS_BY_USER.replace(":user_id", user_id);
        return await mainApi.get<Chat[]>(endpoint);
    } catch (error) {
        console.error("Error getting chats by user:", error);
        throw error;
    }
};

export const deleteChat = async (chat_id: string): Promise<{ message: string }> => {
    try {
        const endpoint = DELETE_CHAT.replace(":chat_id", chat_id);
        return await mainApi.delete<{ message: string }>(endpoint);
    } catch (error) {
        console.error("Error deleting chat:", error);
        throw error;
    }
};
