import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addMessage, deleteMessage as deleteMessageAction, editMessage as editMessageAction, removeConversation, clearMessages, markAllMessagesRead, updateConversationLastMessage } from '../redux/chatSlice';
import { setIncomingProposal, setIncomingProposalImage } from '../redux/locationProposalSlice';
import { getLocationImages } from '../service/location_image.service';
import type { ChatMessage } from '../service/chat_message.service';
import { LocationProposal } from '../service/location_proposal.service';

const SOCKET_URL = 'http://192.168.1.100:3000';

// Global socket instance
let globalSocket: Socket | null = null;
let connectedUserId: string | null = null;

export const useSocket = (chat_id: string | null, onChatDeleted?: () => void) => {
    const dispatch = useAppDispatch();
    const socketRef = useRef<Socket | null>(null);
    const currentUserId = useAppSelector(state => state.user.user_id);
    const currentMessages = useAppSelector(state => state.chat.currentMessages);

    useEffect(() => {
        // ถ้า user เปลี่ยน (logout/login คนใหม่) ให้ disconnect socket เก่า
        if (globalSocket && connectedUserId && connectedUserId !== currentUserId) {
            globalSocket.disconnect();
            globalSocket = null;
            connectedUserId = null;
        }

        let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;

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

            // ตรวจจับ app background/foreground เพื่อ emit online/offline
            const handleAppStateChange = (nextAppState: AppStateStatus) => {
                if (nextAppState === 'active' && connectedUserId) {
                    globalSocket?.emit('user_online', connectedUserId);
                } else if ((nextAppState === 'background' || nextAppState === 'inactive') && connectedUserId) {
                    globalSocket?.emit('user_offline', connectedUserId);
                }
            };
            appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

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

            // ห้องแชทถูกลบ → ลบออกจาก conversation list ทันที (ทุกหน้า)
            globalSocket.on('chat_deleted', (data: { chat_id: string }) => {
                dispatch(removeConversation(data.chat_id));
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

        return () => {
            appStateSubscription?.remove();
        };
    }, [currentUserId, dispatch]);

    useEffect(() => {
        if (!chat_id || !socketRef.current) return;

        const socket = socketRef.current;

        // ถ้า socket connected อยู่แล้ว join room ทันที
        if (socket.connected) {
            socket.emit('join_room', chat_id);
            // Emit mark_read จาก useAppSelector currentMessages ที่ fetch มา
        } else {
            // ถ้ายังไม่ connected รอ connect event
            socket.once('connect', () => {
                socket.emit('join_room', chat_id);
            });
        }

        // รับข้อความใหม่ real-time
        const handleNewMessage = (message: ChatMessage) => {
            dispatch(addMessage(message));
            // mark_read เฉพาะข้อความจากคนอื่น (ไม่ใช่ของตัวเอง)
            if (message.sender_id !== currentUserId) {
                socket.emit('mark_read', { chat_id, user_id: currentUserId });
            }
        };
        socket.on('new_message', handleNewMessage);

        // อีกฝั่งอ่านข้อความแล้ว → อัปเดต isRead ใน Redux (เฉพาะของอีกฝั่ง)
        const handleMessagesRead = () => {
            console.log('[useSocket] messages_read event received, marking messages as read');
            dispatch(markAllMessagesRead(currentUserId));
        };
        socket.on('messages_read', handleMessagesRead);

        // ข้อความถูกลบ → ลบออกจาก Redux
        const handleMessageDeleted = (data: { message_id: string }) => {
            dispatch(deleteMessageAction(data.message_id));
        };
        socket.on('message_deleted', handleMessageDeleted);

        // ข้อความถูกแก้ไข → อัปเดตใน Redux
        const handleMessageEdited = (data: { message_id: string; new_message: string }) => {
            dispatch(editMessageAction({ messageId: data.message_id, newMessage: data.new_message }));
        };
        socket.on('message_edited', handleMessageEdited);

        // ห้องแชทถูกลบ → ลบออกจาก list + ถ้าอยู่ในห้องนี้ให้ navigate ออก
        const handleChatDeleted = (data: { chat_id: string }) => {
            dispatch(removeConversation(data.chat_id));
            if (data.chat_id === chat_id) {
                dispatch(clearMessages());
                onChatDeleted?.();
            }
        };
        socket.on('chat_deleted', handleChatDeleted);

        return () => {
            socket.emit('leave_room', chat_id);
            socket.off('new_message', handleNewMessage);
            socket.off('messages_read', handleMessagesRead);
            socket.off('message_deleted', handleMessageDeleted);
            socket.off('message_edited', handleMessageEdited);
            socket.off('chat_deleted', handleChatDeleted);
        };
    }, [chat_id, currentUserId, dispatch]);

    // Emit mark_read เมื่อมี unread messages จากอีกฝั่ง
    useEffect(() => {
        if (!chat_id || !socketRef.current) return;

        const hasUnreadFromOther = currentMessages.some(
            m => !m.isRead && m.sender_id !== currentUserId
        );

        if (hasUnreadFromOther && socketRef.current.connected) {
            socketRef.current.emit('mark_read', { chat_id, user_id: currentUserId });
        }
    }, [chat_id, currentMessages, currentUserId]);

    const sendMessage = (data: {
        chat_id: string;
        message: string;
        sender_id: string;
        chatType?: string;
    }) => {
        socketRef.current?.emit('send_message', data);
    };

    const deleteMessage = (message_id: string, chat_id: string) => {
        socketRef.current?.emit('delete_message', { message_id, chat_id, user_id: currentUserId });
    };

    const editMessage = (message_id: string, chat_id: string, new_message: string) => {
        socketRef.current?.emit('edit_message', { message_id, chat_id, user_id: currentUserId, new_message });
    };

    return { sendMessage, deleteMessage, editMessage };
};
