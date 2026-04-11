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
                await prisma.user.update({
                    where: { user_id },
                    data: { isOnline: true },
                });
                io.emit("user_status_changed", { user_id, isOnline: true });
            } catch (err) {
                console.error("[Socket] user_online error:", err);
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
                } catch (err) {
                    console.error("[Socket] send_message error:", err);
                    socket.emit("error", { message: "Failed to send message" });
                }
            }
        );

        // อ่านข้อความแล้ว → mark isRead + แจ้ง room
        socket.on("mark_read", async (chat_id: string) => {
            try {
                const result = await prisma.chat_Message.updateMany({
                    where: { chat_id, isRead: false },
                    data: { isRead: true, status: "read" },
                });
                if (result.count > 0) {
                    io.to(chat_id).emit("messages_read", { chat_id });
                }
            } catch (err) {
                console.error("[Socket] mark_read error:", err);
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
