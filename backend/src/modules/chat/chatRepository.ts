import { prisma } from "../../../lib/prisma";
import {
    CreateChatSchema,
    GetChatSchema,
    GetChatsByUserSchema,
    DeleteChatSchema
} from "./chatModel";
import { z } from "zod";

type CreateChatInput = z.infer<typeof CreateChatSchema>;
type GetChatInput = z.infer<typeof GetChatSchema>;
type GetChatsByUserInput = z.infer<typeof GetChatsByUserSchema>;
type DeleteChatInput = z.infer<typeof DeleteChatSchema>;

export const chatRepository = {
    createChat: async (data: CreateChatInput) => {
        try {
            return await prisma.chat.create({
                data: {
                    user1_id: data.user1_id,
                    user2_id: data.user2_id
                },
                include: {
                    user1: true,
                    user2: true,
                    chatMessage: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getChatById: async (data: GetChatInput) => {
        try {
            return await prisma.chat.findUnique({
                where: {
                    id: data.chat_id
                },
                include: {
                    user1: true,
                    user2: true,
                    chatMessage: true
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    getChatsByUserId: async (data: GetChatsByUserInput) => {
        try {
            return await prisma.chat.findMany({
                where: {
                    OR: [
                        { user1_id: data.user_id },
                        { user2_id: data.user_id }
                    ]
                },
                include: {
                    user1: true,
                    user2: true,
                    chatMessage: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    deleteChat: async (data: DeleteChatInput) => {
        try {
            return await prisma.chat.delete({
                where: {
                    id: data.chat_id
                }
            });
        }
        catch (err) {
            throw err;
        }
    }
};