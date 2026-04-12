import { Router } from "express";
import { notificationRepository } from "./notificationRepository";
import { CreateNotificationSchema, UpdateNotificationStatusSchema } from "./notificationModel";
import { authenticateToken } from "../../common/middleware/authenticate";

export const notificationRouter = () => {
    const router = Router();

    // สร้าง notification (ส่งคำขอ match)
    router.post("/create", authenticateToken, async (req, res) => {
        try {
            const sender_id = (req as any).user.sub;
            const validateData = CreateNotificationSchema.parse({ ...req.body, sender_id });
            const data = await notificationRepository.create(validateData);
            res.status(201).json(data);
        } catch (err: any) {
            console.error("Create notification error:", err);
            return res.status(500).json({ message: err.message || "Failed to create notification" });
        }
    });

    // ดึง notification ของ user (pending)
    router.get("/pending", authenticateToken, async (req, res) => {
        try {
            const receiver_id = (req as any).user.sub;
            const data = await notificationRepository.getPendingByReceiverId(receiver_id);
            res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ message: "Failed to fetch notifications" });
        }
    });

    // ดึง notification ทั้งหมดของ user
    router.get("/all", authenticateToken, async (req, res) => {
        try {
            const receiver_id = (req as any).user.sub;
            const data = await notificationRepository.getByReceiverId(receiver_id);
            res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ message: "Failed to fetch notifications" });
        }
    });

    // ตอบรับ/ปฏิเสธ notification (match request)
    router.put("/respond", authenticateToken, async (req, res) => {
        try {
            const validateData = UpdateNotificationStatusSchema.parse(req.body);
            const data = await notificationRepository.updateStatus(validateData);
            res.status(200).json(data);
        } catch (err: any) {
            console.error("Respond notification error:", err);
            return res.status(500).json({ message: err.message || "Failed to respond to notification" });
        }
    });

    return router;
};
