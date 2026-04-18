import { Server, Socket } from "socket.io";
import { prisma } from "../../lib/prisma";

// เก็บ mapping ของ socket.id → user_id
const userSockets: Map<string, string> = new Map();

export const setupSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        // ตั้งค่า online status เมื่อ user เข้ามา
        socket.on("user_online", async (user_id: string) => {
            try {
                userSockets.set(socket.id, user_id);
                // join personal room เพื่อรับ conversation_updated
                socket.join(`user_${user_id}`);
                await prisma.user.update({
                    where: { user_id },
                    data: { isOnline: true },
                });
                io.emit("user_status_changed", { user_id, isOnline: true });
            } catch (err) {
                console.error("[Socket] user_online error:", err);
            }
        });

        // ตั้งค่า offline status เมื่อ app ไปอยู่ background
        socket.on("user_offline", async (user_id: string) => {
            try {
                await prisma.user.update({
                    where: { user_id },
                    data: { isOnline: false },
                });
                io.emit("user_status_changed", { user_id, isOnline: false });
            } catch (err) {
                console.error("[Socket] user_offline error:", err);
            }
        });

        // เข้าร่วม room ของ chat
        socket.on("join_room", (chat_id: string) => {
            socket.join(chat_id);
        });

        // ส่งข้อความ
        socket.on(
            "send_message",
            async (data: {
                chat_id: string;
                message: string;
                sender_id: string;
                chatType?: string;
            }) => {
                try {
                    const { chat_id, message, sender_id, chatType = "text" } = data;

                    // ✅ เช็ค chat มี user นี้ไหม
                    const chat = await prisma.chat.findUnique({
                        where: { id: chat_id },
                    });

                    if (!chat) {
                        socket.emit("error", { message: "Chat not found" });
                        return;
                    }

                    // ✅ เช็ค sender อยู่ในแชทนี้ไหม
                    if (chat.user1_id !== sender_id && chat.user2_id !== sender_id) {
                        socket.emit("error", { message: "Unauthorized" });
                        return;
                    }

                    // บันทึกลง DB
                    const newMessage = await prisma.chat_Message.create({
                        data: {
                            chat_id,
                            message,
                            sender_id,
                            chatType,
                            status: "sent",
                            isRead: false,
                        },
                        include: {
                            sender: {
                                select: {
                                    user_id: true,
                                    username: true,
                                },
                            },
                        },
                    });

                    // ✅ อัปเดต lastMessageAt ของ chat
                    await prisma.chat.update({
                        where: { id: chat_id },
                        data: { updatedAt: new Date() },
                    });

                    // broadcast ไปทุกคนใน room (รวม sender)
                    io.to(chat_id).emit("new_message", newMessage);

                    // แจ้ง personal room ของทั้ง 2 user ให้ update conversation list
                    const payload = {
                        chat_id,
                        message,
                        chatType,
                        sender_id,
                        createdAt: newMessage.createdAt.toISOString(),
                    };
                    io.to(`user_${chat.user1_id}`).emit("conversation_updated", payload);
                    io.to(`user_${chat.user2_id}`).emit("conversation_updated", payload);
                } catch (err) {
                    console.error("[Socket] send_message error:", err);
                    socket.emit("error", { message: "Failed to send message" });
                }
            }
        );

        // อ่านข้อความแล้ว → mark isRead ของข้อความจากอีกฝั่ง + แจ้ง room
        socket.on("mark_read", async (data: { chat_id: string; user_id: string }) => {
            try {
                const { chat_id, user_id } = data;
                const result = await prisma.chat_Message.updateMany({
                    where: {
                        chat_id,
                        isRead: false,
                        sender_id: { not: user_id }  // Mark only messages from the other user
                    },
                    data: { isRead: true, status: "read" },
                });
                if (result.count > 0) {
                    io.to(chat_id).emit("messages_read", { chat_id });
                }
            } catch (err) {
                console.error("[Socket] mark_read error:", err);
            }
        });

        // ลบข้อความ
        socket.on("delete_message", async (data: { message_id: string; chat_id: string; user_id: string }) => {
            try {
                const { message_id, chat_id, user_id } = data;

                // ตรวจสอบว่าข้อความนี้เป็นของ user ที่ลบ
                const message = await prisma.chat_Message.findUnique({
                    where: { id: message_id },
                });

                if (!message) {
                    socket.emit("error", { message: "Message not found" });
                    return;
                }

                if (message.sender_id !== user_id) {
                    socket.emit("error", { message: "Unauthorized to delete this message" });
                    return;
                }

                // ลบข้อความ
                await prisma.chat_Message.delete({
                    where: { id: message_id },
                });

                // broadcast ไปทุกคนใน chat room ว่าข้อความนี้ถูกลบแล้ว
                io.to(chat_id).emit("message_deleted", { message_id, chat_id });
            } catch (err) {
                console.error("[Socket] delete_message error:", err);
                socket.emit("error", { message: "Failed to delete message" });
            }
        });

        // แก้ไขข้อความ
        socket.on("edit_message", async (data: { message_id: string; chat_id: string; user_id: string; new_message: string }) => {
            try {
                const { message_id, chat_id, user_id, new_message } = data;

                const message = await prisma.chat_Message.findUnique({
                    where: { id: message_id },
                });

                if (!message) {
                    socket.emit("error", { message: "Message not found" });
                    return;
                }

                if (message.sender_id !== user_id) {
                    socket.emit("error", { message: "Unauthorized to edit this message" });
                    return;
                }

                if (message.chatType !== "text") {
                    socket.emit("error", { message: "Cannot edit image messages" });
                    return;
                }

                const updated = await prisma.chat_Message.update({
                    where: { id: message_id },
                    data: { message: new_message },
                });

                io.to(chat_id).emit("message_edited", { message_id, chat_id, new_message: updated.message });
            } catch (err) {
                console.error("[Socket] edit_message error:", err);
                socket.emit("error", { message: "Failed to edit message" });
            }
        });

        // ออกจาก room
        socket.on("leave_room", (chat_id: string) => {
            socket.leave(chat_id);
        });

        socket.on("disconnect", async () => {
            const user_id = userSockets.get(socket.id);
            if (user_id) {
                try {
                    await prisma.user.update({
                        where: { user_id },
                        data: { isOnline: false },
                    });
                    io.emit("user_status_changed", { user_id, isOnline: false });
                } catch (err) {
                    console.error("[Socket] disconnect error:", err);
                }
                userSockets.delete(socket.id);
            }
        });
    });
};
