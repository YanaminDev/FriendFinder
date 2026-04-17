import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getChatsByUser } from '../service/chat.service';
import { getMessagesByChat } from '../service/chat_message.service';
import type { Chat } from '../service/chat.service';
import type { ChatMessage } from '../service/chat_message.service';

interface ChatState {
  conversations: Chat[];
  currentMessages: ChatMessage[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentMessages: [],
  loadingConversations: false,
  loadingMessages: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (user_id: string) => {
    return await getChatsByUser(user_id);
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chat_id: string) => {
    return await getMessagesByChat(chat_id);
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // เพิ่มข้อความใหม่จาก socket แบบ real-time
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const p = action.payload;
      const exists = state.currentMessages.some(m =>
        m.id === p.id ||
        // dedup image: ถ้า URL + sender เดิมอยู่แล้ว (temp vs real) ให้ข้าม
        (p.chatType === 'image' && m.message === p.message && m.sender_id === p.sender_id)
      );
      if (!exists) {
        state.currentMessages.push(p);
      } else if (p.chatType === 'image' && !p.id.startsWith('temp_')) {
        // แทนที่ temp message ด้วย real message จาก DB (มี id จริง)
        const idx = state.currentMessages.findIndex(
          m => m.message === p.message && m.sender_id === p.sender_id
        );
        if (idx !== -1) state.currentMessages[idx] = p;
      }
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.currentMessages = state.currentMessages.filter(m => m.id !== action.payload);
    },
    clearMessages: (state) => {
      state.currentMessages = [];
    },
    markAllMessagesRead: (state, action: PayloadAction<string | undefined>) => {
      const currentUserId = action.payload;
      state.currentMessages = state.currentMessages.map(m => ({
        ...m,
        // mark ข้อความที่ตัวเองส่งว่าถูกอ่านแล้ว (อีกฝั่งอ่านแล้ว)
        isRead: currentUserId ? (m.sender_id === currentUserId ? true : m.isRead) : true,
        status: currentUserId ? (m.sender_id === currentUserId ? 'read' : m.status) : 'read',
      }));
    },
    updateConversationLastMessage: (state, action: PayloadAction<{
      chat_id: string;
      message: string;
      chatType: string;
      sender_id: string;
      createdAt: string;
      isFromOtherUser: boolean;
    }>) => {
      const { chat_id, message, chatType, sender_id, createdAt, isFromOtherUser } = action.payload;
      const idx = state.conversations.findIndex(c => c.id === chat_id);
      if (idx !== -1) {
        const conv = { ...state.conversations[idx] };
        conv.chatMessage = [{ id: Date.now().toString(), message, sender_id, isRead: false, chatType, createdAt }];
        if (isFromOtherUser) {
          conv._count = { chatMessage: (conv._count?.chatMessage ?? 0) + 1 };
        }
        // ดึง conversation ขึ้นมาด้านบน (ข้อความล่าสุด)
        state.conversations.splice(idx, 1);
        state.conversations.unshift(conv);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loadingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.error.message ?? 'Failed to fetch conversations';
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loadingMessages = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.currentMessages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.error.message ?? 'Failed to fetch messages';
      });
  },
});

export const { addMessage, deleteMessage, clearMessages, markAllMessagesRead, updateConversationLastMessage } = chatSlice.actions;
export default chatSlice.reducer;
