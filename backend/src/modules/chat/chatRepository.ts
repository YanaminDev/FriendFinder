import { prisma } from "../../../lib/prisma";
import { supabase } from "../../../lib/supabase";
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
                    user1: {
                        select: {
                            user_id: true,
                            user_show_name: true,
                            username: true,
                            isOnline: true,
                            images: {
                                take: 1,
                                orderBy: { createdAt: 'asc' }
                            }
                        }
                    },
                    user2: {
                        select: {
                            user_id: true,
                            user_show_name: true,
                            username: true,
                            isOnline: true,
                            images: {
                                take: 1,
                                orderBy: { createdAt: 'asc' }
                            }
                        }
                    },
                    chatMessage: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        select: {
                            id: true,
                            message: true,
                            sender_id: true,
                            isRead: true,
                            chatType: true,
                            createdAt: true,
                        }
                    },
                    _count: {
                        select: {
                            chatMessage: {
                                where: {
                                    isRead: false,
                                    sender_id: { not: data.user_id }
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            });
        }
        catch (err) {
            throw err;
        }
    },

    deleteChat: async (data: DeleteChatInput) => {
        try {
            // ✅ ดึง messages ที่มีรูปทั้งหมด
            const messagesWithImages = await prisma.chat_Message.findMany({
                where: {
                    chat_id: data.chat_id,
                    chatType: 'image'
                }
            });

            // ✅ ลบรูปจาก Supabase storage
            if (messagesWithImages.length > 0) {
                const filePaths = messagesWithImages
                    .map(msg => {
                        const match = msg.message.match(/chat-images\/(.+)$/);
                        return match ? `chat-images/${match[1]}` : null;
                    })
                    .filter((path): path is string => path !== null);

                if (filePaths.length > 0) {
                    await supabase.storage
                        .from('chatImage')
                        .remove(filePaths)
                        .catch(err => console.error('Image cleanup error:', err?.message));
                }
            }

            // ✅ ลบ messages จาก database
            await prisma.chat_Message.deleteMany({
                where: { chat_id: data.chat_id }
            });

            // ✅ ลบ chat
            const deletedChat = await prisma.chat.delete({
                where: {
                    id: data.chat_id
                },
                include: {
                    user1: { select: { user_id: true } },
                    user2: { select: { user_id: true } }
                }
            });
            return deletedChat;
        }
        catch (err) {
            throw err;
        }
    }
};