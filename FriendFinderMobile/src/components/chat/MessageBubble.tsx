// ─── MessageBubble ────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
  otherAvatar?: string;
  otherInitials?: string;
  otherAvatarBgColor?: string;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, otherAvatar, otherInitials, otherAvatarBgColor = '#9ca3af', showAvatar = false }) => {
  const [imageError, setImageError] = useState(false);

  const hasValidAvatar = !!(otherAvatar && typeof otherAvatar === 'string' && otherAvatar.length > 0 && otherAvatar !== 'undefined' && otherAvatar !== 'null' && !imageError);
  const displayInitials = otherInitials || '?';
  const displayBgColor = otherAvatarBgColor || '#9ca3af';
  const isImageMessage = message.chatType === 'image';

  if (message.isMine) {
    return (
      <View className="items-end my-1 px-4">
        {isImageMessage ? (
          <Image
            source={{ uri: message.text }}
            className="rounded-[18px] rounded-br-[4px]"
            style={{ width: 220, height: 220 }}
            resizeMode="cover"
          />
        ) : (
          <View className="bg-primary rounded-[18px] rounded-br-[4px] px-3.5 py-2.5 max-w-[72%]">
            <Text className="text-base text-white leading-5">{message.text}</Text>
          </View>
        )}
        {message.isRead && (
          <Text className="text-xs text-primary mt-0.5">อ่านแล้ว</Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-row justify-start items-end my-1 px-4 gap-1.5">
      {showAvatar ? (
        hasValidAvatar ? (
          <Image
            source={{ uri: otherAvatar }}
            className="w-8 h-8 rounded-full bg-gray-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: displayBgColor }}>
            <Text className="text-white text-xs font-bold">{displayInitials}</Text>
          </View>
        )
      ) : (
        <View className="w-8 h-8" />
      )}
      {isImageMessage ? (
        <Image
          source={{ uri: message.text }}
          className="rounded-[18px] rounded-bl-[4px]"
          style={{ width: 220, height: 220 }}
          resizeMode="cover"
        />
      ) : (
        <View className="bg-primary-light rounded-[18px] rounded-bl-[4px] px-3.5 py-2.5 max-w-[72%]">
          <Text className="text-base text-gray-900 leading-5" numberOfLines={0}>{message.text}</Text>
        </View>
      )}
    </View>
  );
};

export default MessageBubble;
