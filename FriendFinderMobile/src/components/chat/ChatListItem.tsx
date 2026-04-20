// ─── ChatListItem ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatConversation } from '../../types';

interface ChatListItemProps {
  conversation: ChatConversation;
  onPress: () => void;
  onAvatarPress?: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ conversation, onPress, onAvatarPress }) => {
  const [imageError, setImageError] = useState(false);

  const user = conversation.user as any;
  const hasValidAvatar = !!(user.avatar && user.avatar !== 'undefined' && user.avatar !== 'null' && !imageError);
  const displayInitials = user.initials || user.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  const displayBgColor = user.avatarBgColor || '#9ca3af';

  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 gap-3 border-b border-gray-50"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <TouchableOpacity
        className="relative w-14 h-14"
        onPress={onAvatarPress ?? onPress}
        activeOpacity={onAvatarPress ? 0.7 : 1}
      >
        {hasValidAvatar ? (
          <Image
            source={{ uri: user.avatar }}
            className="w-14 h-14 rounded-full bg-gray-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <View
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{ backgroundColor: displayBgColor }}
          >
            <Text className="text-white text-base font-bold">
              {displayInitials}
            </Text>
          </View>
        )}
        {conversation.user.isOnline && (
          <View className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-online border-2 border-white" />
        )}
      </TouchableOpacity>

      {/* Content */}
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
          {conversation.user.name}
        </Text>
        {conversation.lastMessageType === 'image' ? (
          <View className="flex-row items-center gap-1">
            <Ionicons
              name="image-outline"
              size={14}
              color={conversation.unreadCount > 0 ? '#111827' : '#6b7280'}
            />
            <Text className={`text-sm ${conversation.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              {conversation.lastMessage}
            </Text>
          </View>
        ) : (
          <Text
            className={`text-sm ${conversation.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}
            numberOfLines={1}
          >
            {conversation.lastMessage}
          </Text>
        )}
      </View>

      {/* Meta */}
      <View className="items-end gap-1">
        <Text className={`text-xs ${conversation.unreadCount > 0 ? 'text-primary font-semibold' : 'text-gray-400'}`}>
          {conversation.lastMessageTime}
        </Text>
        {conversation.unreadCount > 0 && (
          <View className="bg-primary rounded-full min-w-[20px] h-5 items-center justify-center px-1">
            <Text className="text-xs text-white font-bold">{conversation.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChatListItem;
