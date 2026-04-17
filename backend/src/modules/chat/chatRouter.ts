import { Router } from "express";
import { prisma } from "../../../lib/prisma";
import { chatRepository } from "./chatRepository";
import {
    CreateChatSchema,
    GetChatSchema,
    GetChatsByUserSchema,
    DeleteChatSchema
} from "./chatModel";
import { authenticateToken } from "../../common/middleware/authenticate";

export const chatRouter = () => {
    const router = Router();

    // Create chat
    router.post("/create", authenticateToken, async (req, res) => {
        try {
            const validateData = CreateChatSchema.parse(req.body);
            const data = await chatRepository.createChat(validateData);
            res.status(201).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to create chat" });
        }
    });

    // Get chat by ID
    router.get("/get/:chat_id", authenticateToken, async (req, res) => {
        try {
            const chat_id = String(req.params.chat_id);
            if (!chat_id) {
                return res.status(400).json({ message: "Chat ID is required" });
            }
            const validateData = GetChatSchema.parse({ chat_id });
            const data = await chatRepository.getChatById(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch chat" });
        }
    });

    // Get chats by user ID
    router.get("/user/:user_id", authenticateToken, async (req, res) => {
        try {
            const user_id = String(req.params.user_id);
            if (!user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const validateData = GetChatsByUserSchema.parse({ user_id });
            const data = await chatRepository.getChatsByUserId(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch chats" });
        }
    });

    // Delete chat
    router.delete("/delete/:chat_id", authenticateToken, async (req, res) => {
        try {
            const chat_id = String(req.params.chat_id);
            const user_id = (req as any).user?.sub;

            if (!chat_id) {
                return res.status(400).json({ message: "Chat ID is required" });
            }

            if (!user_id) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // ✅ ตรวจสอบว่า user เป็นสมาชิกของแชทนี้
            const chat = await prisma.chat.findUnique({
                where: { id: chat_id },
                select: { user1_id: true, user2_id: true }
            });

            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }

            if (chat.user1_id !== user_id && chat.user2_id !== user_id) {
                return res.status(403).json({ message: "Unauthorized to delete this chat" });
            }

            const validateData = DeleteChatSchema.parse({ chat_id });
            const deletedChat = await chatRepository.deleteChat(validateData);

            res.status(200).json({ message: "Chat deleted successfully", chat: deletedChat });
        }
        catch (err: any) {
            console.error("[Chat] delete error:", err?.message || err);
            return res.status(500).json({
                message: "Failed to delete chat",
                error: err?.message || "Unknown error"
            });
        }
    });

    return router;
};