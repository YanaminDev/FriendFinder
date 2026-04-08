// ─── ChatDetailScreen ──────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import MessageBubble from '../../components/chat/MessageBubble';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../../constants/mockData';
import { ChatMessage } from '../../types';

const ChatDetailScreen: React.FC<{ navigation: any; route: { params: { conversationId: string } } }> = ({ navigation, route }) => {
  const { conversationId } = route.params;
  console.log('ChatDetailScreen rendering with conversationId:', conversationId);
  const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId) ?? MOCK_CONVERSATIONS[0];
  console.log('Found conversation:', conversation);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, {
      id: `msg_${Date.now()}`,
      senderId: 'user_001',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    }]);
    setText('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader
        title={conversation.user.username}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              otherAvatar={conversation.user.avatar}
              showAvatar
            />
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View className="flex-row items-center px-4 py-3 gap-2 border-t border-gray-100">
          <View className="flex-1 bg-gray-100 rounded-full px-4 h-[44px] justify-center">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="พิมพ์ข้อความ..."
              placeholderTextColor="#9ca3af"
              className="text-base text-gray-900 p-0"
              returnKeyType="send"
              onSubmitEditing={send}
            />
          </View>
          <TouchableOpacity
            onPress={send}
            className="w-[44px] h-[44px] bg-primary rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg">➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;
