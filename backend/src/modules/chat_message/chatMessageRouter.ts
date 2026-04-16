import { Router } from "express";
import multer from "multer";
import { chatMessageRepository } from "./chatMessageRepository";
import {
    SendMessageSchema,
    GetMessagesSchema,
    DeleteMessageSchema
} from "./chatMessageModel";
import { authenticateToken } from "../../common/middleware/authenticate";
import { uploadFile } from "../../common/utils/uploadImage";

const upload = multer({ storage: multer.memoryStorage() });

export const chatMessageRouter = () => {
    const router = Router();

    // Send message
    router.post("/send", authenticateToken, async (req, res) => {
        try {
            const validateData = SendMessageSchema.parse(req.body);
            const data = await chatMessageRepository.sendMessage(validateData);
            res.status(201).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to send message" });
        }
    });

    // Get messages by chat ID
    router.get("/chat/:chat_id", authenticateToken, async (req, res) => {
        try {
            const chat_id = String(req.params.chat_id);
            if (!chat_id) {
                return res.status(400).json({ message: "Chat ID is required" });
            }
            const validateData = GetMessagesSchema.parse({ chat_id });
            const data = await chatMessageRepository.getMessages(validateData);
            res.status(200).json(data);
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to fetch messages" });
        }
    });

    // Delete message
    router.delete("/delete/:message_id", authenticateToken, async (req, res) => {
        try {
            const message_id = String(req.params.message_id);
            if (!message_id) {
                return res.status(400).json({ message: "Message ID is required" });
            }
            const validateData = DeleteMessageSchema.parse({ message_id });
            await chatMessageRepository.deleteMessage(validateData);
            res.status(200).json({ message: "Message deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to delete message" });
        }
    });

    // Upload chat image
    router.post("/upload-image", authenticateToken, upload.single("image"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            const result = await uploadFile(req.file as any, "chatImage", "chat-images");
            return res.status(200).json({ imageUrl: result.imageUrl });
        } catch (err) {
            return res.status(500).json({ message: `Failed to upload image: ${err}` });
        }
    });

    // Mark messages as read
    router.post("/mark-as-read/:chat_id", authenticateToken, async (req, res) => {
        try {
            const chat_id = String(req.params.chat_id);
            const currentUserId = (req as any).user.sub;
            if (!chat_id) {
                return res.status(400).json({ message: "Chat ID is required" });
            }
            const result = await chatMessageRepository.markMessagesAsRead(chat_id, currentUserId);
            res.status(200).json({
                message: "Messages marked as read",
                updatedCount: result.count
            });
        }
        catch (err) {
            return res.status(500).json({ message: "Failed to mark messages as read" });
        }
    });

    return router;
};