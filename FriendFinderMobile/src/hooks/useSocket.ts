import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addMessage, markAllMessagesRead, updateConversationLastMessage } from '../redux/chatSlice';
import { setIncomingProposal, setIncomingProposalImage } from '../redux/locationProposalSlice';
import { getLocationImages } from '../service/location_image.service';
import type { ChatMessage } from '../service/chat_message.service';
import { LocationProposal } from '../service/location_proposal.service';

const SOCKET_URL = 'http://192.168.1.100:3000';

// Global socket instance
let globalSocket: Socket | null = null;
let connectedUserId: string | null = null;

export const useSocket = (chat_id: string | null) => {
    const dispatch = useAppDispatch();
    const socketRef = useRef<Socket | null>(null);
    const currentUserId = useAppSelector(state => state.user.user_id);

    useEffect(() => {
        // ถ้า user เปลี่ยน (logout/login คนใหม่) ให้ disconnect socket เก่า
        if (globalSocket && connectedUserId && connectedUserId !== currentUserId) {
            globalSocket.disconnect();
            globalSocket = null;
            connectedUserId = null;
        }

        // สร้าง global socket connection ใหม่ (ถ้ายังไม่มี)
        if (currentUserId && !globalSocket) {
            globalSocket = io(SOCKET_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5,
            });

            connectedUserId = currentUserId;
            globalSocket.on('connect', () => {
                // ส่ง user_id เมื่อเข้า app
                if (currentUserId) {
                    globalSocket?.emit('user_online', currentUserId);
                }
            });

            globalSocket.on('disconnect', () => {
                // global socket disconnected
            });

            globalSocket.on('error', (err: { message: string }) => {
                console.error('[Socket] global error:', err.message);
            });

            // รับ update conversation list real-time
            globalSocket.on('conversation_updated', (data: {
                chat_id: string;
                message: string;
                chatType: string;
                sender_id: string;
                createdAt: string;
            }) => {
                dispatch(updateConversationLastMessage({
                    ...data,
                    isFromOtherUser: data.sender_id !== currentUserId,
                }));
            });

            // รับ location proposal real-time
            globalSocket.on('location_proposal_received', async (proposal: LocationProposal) => {
                dispatch(setIncomingProposal(proposal));

                // ดึงรูปภาพของสถานที่
                if (proposal.location_id) {
                    try {
                        const imgs = await getLocationImages(proposal.location_id);
                        if (imgs?.[0]?.imageUrl) {
                            dispatch(setIncomingProposalImage(imgs[0].imageUrl));
                        }
                    } catch (err) {
                        console.error('Error fetching proposal location image:', err);
                    }
                }
            });

        }

        socketRef.current = globalSocket;
    }, [currentUserId, dispatch]);

    useEffect(() => {
        if (!chat_id || !socketRef.current) return;

        const socket = socketRef.current;

        // ถ้า socket connected อยู่แล้ว join room ทันที
        if (socket.connected) {
            socket.emit('join_room', chat_id);
            socket.emit('mark_read', chat_id);
        } else {
            // ถ้ายังไม่ connected รอ connect event
            socket.on('connect', () => {
                socket.emit('join_room', chat_id);
                socket.emit('mark_read', chat_id);
            });
        }

        // รับข้อความใหม่ real-time
        socket.on('new_message', (message: ChatMessage) => {
            dispatch(addMessage(message));
            // mark_read เฉพาะข้อความจากคนอื่น (ไม่ใช่ของตัวเอง)
            if (message.sender_id !== currentUserId) {
                socket.emit('mark_read', chat_id);
            }
        });

        // อีกฝั่งอ่านข้อความแล้ว → อัปเดต isRead ใน Redux
        socket.on('messages_read', () => {
            dispatch(markAllMessagesRead());
        });

        return () => {
            socket.emit('leave_room', chat_id);
            socket.off('new_message');
            socket.off('messages_read');
        };
    }, [chat_id, dispatch]);

    const sendMessage = (data: {
        chat_id: string;
        message: string;
        sender_id: string;
        chatType?: string;
    }) => {
        socketRef.current?.emit('send_message', data);
    };

    return { sendMessage };
};
