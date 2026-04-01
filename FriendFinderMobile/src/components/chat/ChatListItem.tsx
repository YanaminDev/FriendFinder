// ─── ChatListItem ─────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChatConversation } from '../../types';

interface ChatListItemProps {
  conversation: ChatConversation;
  onPress: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ conversation, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center px-4 py-3 gap-3 border-b border-gray-50"
    onPress={onPress}
    activeOpacity={0.7}
  >
    {/* Avatar */}
    <View className="relative w-[54px] h-[54px]">
      <Image
        source={{ uri: conversation.user.avatar }}
        className="w-[54px] h-[54px] rounded-full bg-gray-200"
      />
      {conversation.user.isOnline && (
        <View className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-online border-2 border-white" />
      )}
    </View>

    {/* Content */}
    <View className="flex-1 gap-0.5">
      <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
        {conversation.user.username}
      </Text>
      <Text className="text-sm text-gray-500" numberOfLines={1}>
        {conversation.lastMessage}
      </Text>
    </View>

    {/* Meta */}
    <View className="items-end gap-1">
      <Text className="text-xs text-gray-400">{conversation.lastMessageTime}</Text>
      {conversation.unreadCount > 0 && (
        <View className="bg-primary rounded-full min-w-[20px] h-5 items-center justify-center px-1">
          <Text className="text-xs text-white font-bold">{conversation.unreadCount}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default ChatListItem;
