import { prisma } from "../../../lib/prisma";
import { CreateNotification, UpdateNotificationStatus } from "./notificationModel";

export const notificationRepository = {
    create: async (data: CreateNotification) => {
        try {
            return await prisma.notification.create({
                data: {
                    sender_id: data.sender_id,
                    receiver_id: data.receiver_id,
                    type: data.type,
                    position_id: data.position_id,
                    activity_id: data.activity_id,
                },
                include: {
                    sender: true,
                    receiver: true,
                }
            });
        } catch (err) {
            throw err;
        }
    },

    getByReceiverId: async (receiver_id: string) => {
        try {
            return await prisma.notification.findMany({
                where: { receiver_id },
                include: {
                    sender: true,
                },
                orderBy: { createdAt: "desc" },
            });
        } catch (err) {
            throw err;
        }
    },

    getPendingByReceiverId: async (receiver_id: string) => {
        try {
            return await prisma.notification.findMany({
                where: { receiver_id, status: "pending" },
                include: {
                    sender: true,
                },
                orderBy: { createdAt: "desc" },
            });
        } catch (err) {
            throw err;
        }
    },

    updateStatus: async (data: UpdateNotificationStatus) => {
        try {
            return await prisma.notification.update({
                where: { id: data.id },
                data: { status: data.status },
                include: {
                    sender: true,
                    receiver: true,
                }
            });
        } catch (err) {
            throw err;
        }
    },

    getById: async (id: string) => {
        try {
            return await prisma.notification.findUnique({
                where: { id },
                include: {
                    sender: true,
                    receiver: true,
                }
            });
        } catch (err) {
            throw err;
        }
    },
};
