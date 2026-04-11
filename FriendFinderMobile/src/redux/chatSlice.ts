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
      const exists = state.currentMessages.some(m => m.id === action.payload.id);
      if (!exists) {
        state.currentMessages.push(action.payload);
      }
    },
    clearMessages: (state) => {
      state.currentMessages = [];
    },
    markAllMessagesRead: (state) => {
      state.currentMessages = state.currentMessages.map(m => ({
        ...m,
        isRead: true,
        status: 'read',
      }));
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

export const { addMessage, clearMessages, markAllMessagesRead } = chatSlice.actions;
export default chatSlice.reducer;
