// ─── MessageBubble ────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image } from 'react-native';
import { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
  otherAvatar?: string;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, otherAvatar, showAvatar = false }) => {
  if (message.isMine) {
    return (
      <View className="flex-row justify-end items-end my-1 px-4 gap-1.5">
        <View className="bg-primary rounded-[18px] rounded-br-[4px] px-3.5 py-2.5 max-w-[72%]">
          <Text className="text-base text-white leading-5">{message.text}</Text>
        </View>
        {showAvatar && otherAvatar && (
          <Image source={{ uri: otherAvatar }} className="w-8 h-8 rounded-full bg-gray-200" />
        )}
      </View>
    );
  }

  return (
    <View className="flex-row justify-start items-end my-1 px-4 gap-1.5">
      {showAvatar && otherAvatar ? (
        <Image source={{ uri: otherAvatar }} className="w-8 h-8 rounded-full bg-gray-200" />
      ) : (
        <View className="w-8 h-8" />
      )}
      <View className="bg-primary-light rounded-[18px] rounded-bl-[4px] px-3.5 py-2.5 max-w-[72%]">
        <Text className="text-base text-gray-900 leading-5">{message.text}</Text>
      </View>
    </View>
  );
};

export default MessageBubble;
