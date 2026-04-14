import { prisma } from "../../../lib/prisma";
import {
    SendMessageSchema,
    GetMessagesSchema,
    DeleteMessageSchema
} from "./chatMessageModel";
import { z } from "zod";

type SendMessageInput = z.infer<typeof SendMessageSchema>;
type GetMessagesInput = z.infer<typeof GetMessagesSchema>;
type DeleteMessageInput = z.infer<typeof DeleteMessageSchema>;

export const chatMessageRepository = {
    sendMessage: async (data: SendMessageInput) => {
        try {
            return await prisma.chat_Message.create({
                data: {
                    chat_id: data.chat_id,
                    message: data.message,
                    sender_id: data.sender_id,
                    chatType: data.chatType || "text",
                    status: "sent",
                    isRead: false,
                },
                include: {
                    chat: true,
                    sender: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getMessages: async (data: GetMessagesInput) => {
        try {
            return await prisma.chat_Message.findMany({
                where: {
                    chat_id: data.chat_id
                },
                include: {
                    chat: true,
                    sender: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    deleteMessage: async (data: DeleteMessageInput) => {
        try {
            return await prisma.chat_Message.delete({
                where: {
                    id: data.message_id
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    markMessagesAsRead: async (chat_id: string, currentUserId: string) => {
        try {
            return await prisma.chat_Message.updateMany({
                where: {
                    chat_id: chat_id,
                    isRead: false,
                    sender_id: { not: currentUserId }  // Mark only messages from the other user
                },
                data: {
                    isRead: true,
                    status: "read"
                }
            });
        }
        catch (err) {
            throw err;
        }
    }
};